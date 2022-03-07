'use strict';
const httpError = require('http-errors');
const moment = require('moment-timezone');
const promisify = require('util').promisify;
const mapSeries = promisify(require('async/mapSeries'));
const chunk = require('lodash/chunk');
const compact = require('lodash/compact');
const zip = require('lodash/zip');
const flatten = require('lodash/flatten');
const Transaction = require('../../utils/transaction');
const aggregate = require('../../utils/aggregate');
const eInvoiceUtils = require('../../utils/formatEInvoiceData');
const bulkUpdate = require('../../utils/bulk-update');
const toObjectId = require('../../utils/to-object-id');
const { getConnectorFromModel } = require('../../utils/transaction-utils');

module.exports = ClientMeterNumber => {
  const meterNumberAndEinvoiceAggregationQuery = ids => [
    { $match: { _id: { $in: ids } } },
    { $lookup: { from: 'EInvoiceData', localField: '_id', foreignField: '_id', as: 'einvoice' } },
    { $unwind: '$einvoice' },
  ];

  const bulkUpdateMonthHelper = async (joinedData, eInvoiceCredential) => {
    const { sellerInfo } = ClientMeterNumber.app.models.EInvoice.config.dataSource.settings.meta;
    // Prepare each record
    const preparedJoinedData = joinedData.map(({ einvoice, einvoiceReplacementDate, ...changedMeterNumberRecord }) => {
      // Declare default replaceData
      const replaceDataArg = {
        additionalReferenceDesc: 'Ghi chú thay thế hoá đơn',
        invoiceNote: 'Thay thế hoá đơn',
        additionalReferenceDate: moment(einvoiceReplacementDate).valueOf(),
        originalInvoiceIssueDate: moment(einvoice.eInvoiceDate).valueOf(),
        originalInvoiceId: einvoice.eInvoiceNo,
      };
      // Format data into API-compatible form
      const formattedInvoiceDataForReplacement = eInvoiceUtils.replaceInvoice(
        sellerInfo,
        changedMeterNumberRecord,
        einvoiceReplacementDate,
        eInvoiceCredential,
        replaceDataArg,
      );
      return {
        formatted: formattedInvoiceDataForReplacement,
        changedMeterNumberRecord,
        einvoice,
        einvoiceReplacementDate,
      };
    });

    // Divide data into batches and send API requests
    const eInvoiceBatches = chunk(preparedJoinedData, 50);
    const results = await mapSeries(eInvoiceBatches, async invoiceItem => {
      const formatteds = invoiceItem.map(i => i.formatted);
      const replacedInvoiceResults = await ClientMeterNumber.app.models.EInvoice.sendRequest({
        requestType: 'replaceInvoiceInBatch',
        data: { commonInvoiceInputs: formatteds },
        supplierTaxCode: eInvoiceCredential.supplierTaxCode,
      });
      if (replacedInvoiceResults.createInvoiceOutputs.length !== invoiceItem.length) {
        throw httpError(500, 'error.INTERNAL_THIRD_PARTY_SERVICE_ERROR');
      }
      return zip(replacedInvoiceResults.createInvoiceOutputs, invoiceItem).map(
        ([creationResult, { formatted, changedMeterNumberRecord, einvoice, einvoiceReplacementDate }]) => {
          if (!creationResult.errorCode && !creationResult.description) {
            const einvoiceData = eInvoiceUtils.resultData(
              creationResult,
              changedMeterNumberRecord,
              formatted.generalInvoiceInfo.transactionUuid,
              einvoiceReplacementDate,
              eInvoiceCredential,
            );
            if ('replacedEinvoice' in einvoiceData) {
              einvoiceData.replacedEinvoice = einvoice.replacedEinvoice.concat(einvoice);
            } else {
              einvoiceData.replacedEinvoice = [einvoice];
            }
            return einvoiceData;
          } else {
            return null;
          }
        },
      );
    });

    return compact(flatten(results));
  };

  ClientMeterNumber.bulkUpdateMonth = async (records, transaction, session) => {
    // Begin transaction
    let passingSession = true;
    if (!transaction || !session) {
      transaction = new Transaction(ClientMeterNumber);
      session = transaction.start();
      passingSession = false;
    }

    const rawEinvoiceRange = getConnectorFromModel(ClientMeterNumber, 'EInvoiceRange');

    try {
      // Get the active einvoice credential
      const rawEinvoiceCredential = await rawEinvoiceRange.findOne({ isActive: true }, { session });
      if (!rawEinvoiceCredential) {
        throw httpError(500, 'error.NO_ACTIVE_EINVOICE_RANGE');
      }
      const eInvoiceCredential = {
        supplierTaxCode: rawEinvoiceCredential.supplierTaxCode,
        templateCode: rawEinvoiceCredential.templateCode,
        invoiceSeries: rawEinvoiceCredential.serial,
      };

      // Fetch all ids of client whose meter number is edited
      const ids = [];
      const einvoiceReplaceDates = {};
      for (const record of records) {
        const updatedData = await ClientMeterNumber.updateMonth(record, 'ctm', {}, transaction, session);
        if (updatedData) {
          if (updatedData.id) {
            ids.push(toObjectId(updatedData.id));
          }
          if (updatedData.invoiceIssuedDate) {
            einvoiceReplaceDates[updatedData.id] = moment(updatedData.invoiceIssuedDate);
          }
        }
      }

      // Join 2 arrays of meter number and einvoice data by matching '_id' key
      const joinedData = await aggregate(ClientMeterNumber, meterNumberAndEinvoiceAggregationQuery(ids), session);

      // Add einvoice export dates
      for (let joinedDatum of joinedData) {
        const id = joinedDatum._id.toString();
        if (einvoiceReplaceDates[id]) {
          joinedDatum.einvoiceReplacementDate = einvoiceReplaceDates[id];
        }
      }

      // Invoke a subroutine to executing HTTP request to create replaced einvoices in batch
      const results = await bulkUpdateMonthHelper(joinedData, eInvoiceCredential);

      // Bulk update the old einvoice data with new ones
      await bulkUpdate(ClientMeterNumber.app.models.EInvoiceData, results, session);

      // Update the active einvoice range
      const verifyData = await ClientMeterNumber.app.models.EInvoiceRange.getProvidesStatusUsingInvoice(
        {
          supplierTaxCode: rawEinvoiceCredential.supplierTaxCode,
          templateCode: rawEinvoiceCredential.templateCode,
          serial: rawEinvoiceCredential.serial,
        },
        session,
      );
      const { numOfpublishInv, totalInv } = verifyData;
      const verifyAt = new Date();
      await rawEinvoiceRange.findOneAndUpdate(
        { _id: rawEinvoiceCredential._id },
        { $set: { numOfpublishInv, verifyAt, totalInv } },
        { session },
      );
      if (!passingSession) await transaction.commit();
    } catch (err) {
      if (!passingSession) await transaction.rollback();
      throw err;
    }
  };
};
