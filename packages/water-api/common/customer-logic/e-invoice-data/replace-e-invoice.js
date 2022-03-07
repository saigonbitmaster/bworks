'use strict';
const moment = require('moment-timezone');
const set = require('lodash/set');
const omit = require('lodash/omit');
const uuidv4 = require('uuid/v4');
const httpError = require('http-errors');
const eInvoiceUtils = require('../../utils/formatEInvoiceData');
const validateEinvoiceReplacementDate = require('../../utils/validate-einvoice-replacement-date');
const { getConnectorFromModel } = require('../../utils/transaction-utils');
const vnptEinvoiceHelpers = require('../../utils/vnpt-einvoice-helpers');

module.exports = EinvoiceData => {
  EinvoiceData.replaceEinvoice = async (changedMeterNumberId, invoiceIssuedDate, toDate, session) => {
    const { sellerInfo } = EinvoiceData.app.models.EInvoice.config.dataSource.settings.meta;
    const rawEinvoiceDataCollection = getConnectorFromModel(EinvoiceData);
    const rawEinvoiceRangeCollection = getConnectorFromModel(EinvoiceData, 'EInvoiceRange');

    const latestEinvoice = await EinvoiceData.getLatestEinvoice(toDate, session);

    if (!validateEinvoiceReplacementDate(latestEinvoice, invoiceIssuedDate)) {
      throw httpError(400, 'INVALID_EINVOICE_REPLACEMENT_DATE');
    }

    // Assuming invoice data has been recomputed
    const changedMeterNumberRecord = await getConnectorFromModel(EinvoiceData, 'ClientMeterNumber').findOne(
      {
        _id: changedMeterNumberId,
      },
      { session },
    );
    if (changedMeterNumberRecord) {
      // Get the corresponding invoice data
      // Notice that invoice id === meter number id so we could fetch both of them using a common id
      const originalInvoiceRecord = await rawEinvoiceDataCollection.findOne(
        {
          _id: changedMeterNumberId,
        },
        { session },
      );
      if (originalInvoiceRecord) {
        // Get the active einvoice credential
        const rawEinvoiceCredential = await rawEinvoiceRangeCollection.findOne({ isActive: true }, { session });
        if (!rawEinvoiceCredential) {
          throw httpError(500, 'error.NO_ACTIVE_EINVOICE_RANGE');
        }
        let eInvoiceCredential = {
          supplierTaxCode: rawEinvoiceCredential.supplierTaxCode,
          templateCode: rawEinvoiceCredential.templateCode,
          invoiceSeries: rawEinvoiceCredential.serial,
          provider: rawEinvoiceCredential.provider,
        };

        switch (eInvoiceCredential.provider) {
          case 'VIETTEL': {
            // Declare default replaceData
            const replaceDataArg = {
              additionalReferenceDesc: 'Ghi chú thay thế hoá đơn',
              invoiceNote: 'Thay thế hoá đơn',
              additionalReferenceDate: moment().valueOf(),
              originalInvoiceIssueDate: moment(originalInvoiceRecord.eInvoiceDate).valueOf(),
              originalInvoiceId: originalInvoiceRecord.eInvoiceNo,
            };
            // Format data into API-compatible form
            const formattedInvoiceDataForReplacement = eInvoiceUtils.replaceInvoice(
              sellerInfo,
              changedMeterNumberRecord,
              invoiceIssuedDate,
              eInvoiceCredential,
              replaceDataArg,
            );
            // Send to Einvoice API and save result into storage
            const replacedInvoiceResult = await EinvoiceData.app.models.EInvoice.sendRequest({
              requestType: 'replaceInvoice',
              data: formattedInvoiceDataForReplacement,
              supplierTaxCode: eInvoiceCredential.supplierTaxCode,
            });
            if (!replacedInvoiceResult.errorCode && !replacedInvoiceResult.description) {
              const replacedInvoiceResultInStorageForm = eInvoiceUtils.resultData(
                replacedInvoiceResult,
                changedMeterNumberRecord,
                formattedInvoiceDataForReplacement.generalInvoiceInfo.transactionUuid,
                invoiceIssuedDate,
                eInvoiceCredential,
              );
              delete replacedInvoiceResultInStorageForm.id;
              if ('scrappedEinvoice' in originalInvoiceRecord) {
                replacedInvoiceResultInStorageForm.scrappedEinvoice = originalInvoiceRecord.scrappedEinvoice.concat(
                  omit(originalInvoiceRecord, 'scrappedEinvoice'),
                );
              } else {
                replacedInvoiceResultInStorageForm.scrappedEinvoice = [originalInvoiceRecord];
              }
              await rawEinvoiceDataCollection.replaceOne(
                {
                  _id: changedMeterNumberId,
                },
                replacedInvoiceResultInStorageForm,
                { session },
              );

              // Update einvoice range statistics
              const verifyData = await EinvoiceData.app.models.EInvoiceRange.getProvidesStatusUsingInvoice(
                {
                  supplierTaxCode: rawEinvoiceCredential.supplierTaxCode,
                  templateCode: rawEinvoiceCredential.templateCode,
                  serial: rawEinvoiceCredential.serial,
                },
                session,
              );
              const { numOfpublishInv, totalInv } = verifyData;
              const verifyAt = new Date();
              await rawEinvoiceRangeCollection.findOneAndUpdate(
                { _id: rawEinvoiceCredential._id },
                { $set: { numOfpublishInv, verifyAt, totalInv } },
                { session },
              );
            } else {
              throw new Error(`${replacedInvoiceResult.errorCode}: ${replacedInvoiceResult.description}`);
            }
            break;
          }
          case 'VNPT': {
            // Set up provider-exclusive credential
            // set(eInvoiceCredential, 'webUsername', rawEinvoiceCredential.webUsername);
            // set(eInvoiceCredential, 'webPassword', rawEinvoiceCredential.webPassword);
            // set(eInvoiceCredential, 'apiUsername', rawEinvoiceCredential.apiUsername);
            // set(eInvoiceCredential, 'apiPassword', rawEinvoiceCredential.apiPassword);
            // set(eInvoiceCredential, 'host', rawEinvoiceCredential.host);

            eInvoiceCredential = { ...rawEinvoiceCredential, ...eInvoiceCredential};
            // Set up new key to changed meter number record
            set(changedMeterNumberRecord, 'key', uuidv4());

            // Replace the old meter number record
            const replacedInvoiceResult = await vnptEinvoiceHelpers.replaceInvoice(
              changedMeterNumberRecord,
              invoiceIssuedDate,
              originalInvoiceRecord,
              eInvoiceCredential,
            );

            if (replacedInvoiceResult.startsWith('OK')) {
              // Format into proper storable form
              const storableReplacedInvoice = vnptEinvoiceHelpers.formatEinvoiceOutput(
                changedMeterNumberRecord,
                invoiceIssuedDate,
                eInvoiceCredential,
              );

              // Repackage old invoice into newly replaced one
              delete storableReplacedInvoice.id;
              if ('scrappedEinvoice' in originalInvoiceRecord) {
                storableReplacedInvoice.scrappedEinvoice = originalInvoiceRecord.scrappedEinvoice.concat(
                  omit(originalInvoiceRecord, 'scrappedEinvoice'),
                );
              } else {
                storableReplacedInvoice.scrappedEinvoice = [originalInvoiceRecord];
              }
              await rawEinvoiceDataCollection.replaceOne(
                {
                  _id: changedMeterNumberId,
                },
                storableReplacedInvoice,
                { session },
              );
            } else {
              // Throw an error to abort current transaction
              throw new Error('INVOICE_REPLACEMENT_ERROR');
            }
            break;
          }
        }
      }
    }
  };
};
