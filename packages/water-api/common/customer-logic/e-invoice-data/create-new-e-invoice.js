'use strict';
const util = require('util');
const chunk = require('lodash/chunk');
const flatten = require('lodash/flatten');
const zip = require('lodash/zip');
const omit = require('lodash/omit');
const compact = require('lodash/compact');
const uniq = require('lodash/uniq');
const get = require('lodash/get');
const set = require('lodash/set');
const has = require('lodash/has');
const moment = require('moment-timezone');
const uuidv4 = require('uuid/v4');
const httpError = require('http-errors');
const mapSeries = util.promisify(require('async/mapSeries'));
const eInvoiceUtils = require('../../utils/formatEInvoiceData');
const toObjectId = require('../../utils/to-object-id');
const Transaction = require('../../utils/transaction');
const { getConnectorFromModel } = require('../../utils/transaction-utils');
const vnptEinvoiceHelpers = require('../../utils/vnpt-einvoice-helpers');

module.exports = EInvoiceData => {
  EInvoiceData.createNewEInvoiceHelper = async (rawEinvoiceData, eInvoiceCredential, invoiceIssuedDate) => {
    const { sellerInfo } = EInvoiceData.app.models.EInvoice.config.dataSource.settings.meta;
    const einvoiceBatches = chunk(rawEinvoiceData, 50);
    const processedEinvoiceData = einvoiceBatches.map(batch => ({
      commonInvoiceInputs: batch.map(invoiceItem =>
        eInvoiceUtils.newInvoice(sellerInfo, { ...invoiceItem, invoiceIssuedDate }, eInvoiceCredential),
      ),
    }));
    const results = await mapSeries(processedEinvoiceData, async invoiceItem => {
      const result = await EInvoiceData.app.models.EInvoice.sendRequest({
        requestType: 'createNewInvoiceInBatch',
        data: invoiceItem,
        supplierTaxCode: eInvoiceCredential.supplierTaxCode,
      });
      if (result.createInvoiceOutputs.length !== invoiceItem.commonInvoiceInputs.length) {
        throw httpError(500, 'error.INTERNAL_THIRD_PARTY_SERVICE_ERROR');
      }
      return result;
    });
    return flatten(results.map(({ createInvoiceOutputs }) => createInvoiceOutputs));
  };

  EInvoiceData.createNewEInvoice = async (filter, selectedIds, invoiceIssuedDate, res) => {
    const jobKey = `createNewEInvoiceInternal_${moment(invoiceIssuedDate).format('DD-MM-YYYY HH:mm:ss')}`;
    const runningJobStatus = await EInvoiceData.app.models.BackgroundJob.findOne({
      where: { key: jobKey },
    });
    // Find out the permission for one invoking this
    const user = await res.req.accessToken.user.get();
    if (!runningJobStatus) {
      const jobId = await EInvoiceData.app.runBackground({
        path: 'EInvoiceData.createNewEInvoiceInternal',
        jobKey,
        customeMsg: 'error.CREATE_EINVOICES_IN_PROGRESS',
        data: { filter, selectedIds, invoiceIssuedDate, user },
      });
      return { jobId, status: 'NEW' };
    } else if (runningJobStatus.error) {
      return { status: runningJobStatus.status, error: runningJobStatus.error };
    } else {
      return { status: runningJobStatus.status };
    }
  };

  EInvoiceData.createNewEInvoiceInternal = async ({ filter, selectedIds, invoiceIssuedDate, user }) => {
    const transaction = new Transaction(EInvoiceData);
    const session = transaction.start();

    const rawEinvoiceDataCollection = getConnectorFromModel(EInvoiceData);
    const rawEinvoiceRangeCollection = getConnectorFromModel(EInvoiceData, 'EInvoiceRange');

    try {
      let invoiceDatas = [];
      if (selectedIds && selectedIds.length > 0) {
        const selectedMeterNumberIds = selectedIds.map(
          id => `${id}${moment(filter.termInvoice.gte).format('-YYYY-MM')}`,
        );
        invoiceDatas = await getConnectorFromModel(EInvoiceData, 'ClientMeterNumber')
          .find({
            _id: { $in: selectedMeterNumberIds },
          })
          .toArray();
      } else {
        const formattedWhere = { where: { ...filter, startMeterDate: { lt: filter.termInvoice.gte } }, fetchAll: true };
        invoiceDatas = await EInvoiceData.app.models.Client.joinWithMeterNumber(formattedWhere, user, session);
      }
      // Remove clients not using water
      let waterUsedInvoiceDatas = invoiceDatas.filter(({ invoiceData: { totalWaterUsed } }) => totalWaterUsed > 0);

      // Exit when there's no client to make einvoices for
      if (waterUsedInvoiceDatas.length === 0) {
        return;
      }

      // Only create einvoices for records does not have einvoice prior
      const invoiceIds = waterUsedInvoiceDatas.map(({ _id }) => toObjectId(_id));
      const existingEinvoices = await rawEinvoiceDataCollection
        .find({ _id: { $in: invoiceIds } }, { session })
        .toArray()
        .then(results => results.reduce((acc, val) => set(acc, val._id.toString(), val), {}));
      const canceledEinvoices = await rawEinvoiceDataCollection
        .find({ _id: { $in: invoiceIds }, canceled: true }, { session })
        .toArray()
        .then(results => results.reduce((acc, val) => set(acc, val._id.toString(), val), {}));

      // Filter out records having einvoices already
      waterUsedInvoiceDatas = waterUsedInvoiceDatas.filter(
        ({ _id }) => !has(existingEinvoices, _id) || has(canceledEinvoices, _id),
      );

      // Get active einvoice credential
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

      // Branch out workflows based on dedicated providers
      switch (eInvoiceCredential.provider) {
        case 'VIETTEL': {
          const eInvoiceCreationResults = await EInvoiceData.createNewEInvoiceHelper(
            waterUsedInvoiceDatas,
            eInvoiceCredential,
            invoiceIssuedDate,
          );

          // Only store successfully created einvoices
          // Emit errors when encountered any
          const eInvoiceStorageData = compact(
            zip(eInvoiceCreationResults, waterUsedInvoiceDatas).map(([creationResult, rawInvoiceData]) => {
              if (!creationResult.errorCode && !creationResult.description) {
                const einvoiceData = eInvoiceUtils.resultData(
                  creationResult,
                  rawInvoiceData,
                  creationResult.transactionUuid,
                  invoiceIssuedDate,
                  eInvoiceCredential,
                );
                einvoiceData._id = einvoiceData.id;
                delete einvoiceData.id;
                return einvoiceData;
              } else {
                return null;
              }
            }),
          );

          const errorRequests = eInvoiceCreationResults.filter(
            ({ errorCode, description }) => errorCode || description,
          );
          if (errorRequests.length > 0) {
            const error = httpError();
            error.messages = uniq(errorRequests.map(({ errorCode, description }) => description || errorCode));
            throw error;
          }

          try {
            // Repackage previously cancelled einvoice into new ones
            const brandNewInvoices = [];
            for (const formattedInvoice of eInvoiceStorageData) {
              if (has(canceledEinvoices, formattedInvoice._id)) {
                const canceledInvoice = get(canceledEinvoices, formattedInvoice._id);
                if ('scrappedEinvoice' in canceledInvoice) {
                  set(
                    formattedInvoice,
                    'scrappedEinvoice',
                    canceledInvoice.scrappedEinvoice.concat(omit(canceledInvoice, 'scrappedEinvoice')),
                  );
                } else {
                  set(formattedInvoice, 'scrappedEinvoice', [canceledInvoice]);
                }
                await rawEinvoiceDataCollection.replaceOne({ _id: formattedInvoice._id }, formattedInvoice, {
                  session,
                });
              } else {
                brandNewInvoices.push(formattedInvoice);
              }
            }

            if (brandNewInvoices.length > 0) {
              await rawEinvoiceDataCollection.insertMany(eInvoiceStorageData, { session });
            }
            // Update einvoice range statistics
            const verifyData = await EInvoiceData.app.models.EInvoiceRange.getProvidesStatusUsingInvoice(
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
            await transaction.commit();
          } catch (err) {
            // Cancel previously made einvoices
            // TODO: Implement transactional deletion of einvoice
            // await mapSeries(eInvoiceCreationResults, async ({ result }) => {
            //   const requestedDataForCancelingEinvoice = eInvoiceUtils.cancelInvoice(result, invoiceIssuedDate);
            //   await EInvoiceData.app.models.EInvoice.sendRequest({
            //     requestType: 'cancelTransactionInvoice',
            //     data: requestedDataForCancelingEinvoice,
            //   });
            // });
            // CURRENT WORKAROUND: Do nothing
            throw err;
          }
          break;
        }
        case 'VNPT': {
          // Add credential data
          // set(eInvoiceCredential, 'webUsername', rawEinvoiceCredential.webUsername);
          // set(eInvoiceCredential, 'webPassword', rawEinvoiceCredential.webPassword);
          // set(eInvoiceCredential, 'apiUsername', rawEinvoiceCredential.apiUsername);
          // set(eInvoiceCredential, 'apiPassword', rawEinvoiceCredential.apiPassword);
          // set(eInvoiceCredential, 'host', rawEinvoiceCredential.host);
          eInvoiceCredential = { ...rawEinvoiceCredential, ...eInvoiceCredential };
          // stupid code for vnpt (ttnsbacninh)
          const fixUrl = r => r.toLowerCase().replace('/bewacop', '/p');
          // Extract client data from invoice data
          const clientData = waterUsedInvoiceDatas.map(invoice => get(invoice, 'invoiceData.client'));
          // console.log(clientData, rawEinvoiceCredential);
          if (clientData.length > 0) {
            const rawReturnedResult = await vnptEinvoiceHelpers.pushDataToServer(
              clientData,
              eInvoiceCredential,
              fixUrl,
            );
            const returnedResult = parseInt(rawReturnedResult, 10);
            if (returnedResult === clientData.length) {
              // Produce new key for each invoice data
              const waterUsedInvoiceDataWithKey = waterUsedInvoiceDatas.map(invoiceData =>
                set(invoiceData, 'key', uuidv4()),
              );
              // Client pushed successfully, now create einvoices for them
              const createdInvoiceResult = await vnptEinvoiceHelpers.createInvoice(
                waterUsedInvoiceDataWithKey,
                invoiceIssuedDate,
                eInvoiceCredential,
              );
              //API thanh hoa OK
              // if (createdInvoiceResult.startsWith('OK')) {
              //   const formattedInvoiceResults = waterUsedInvoiceDataWithKey.map(data =>
              //     vnptEinvoiceHelpers.formatEinvoiceOutput(data, invoiceIssuedDate, eInvoiceCredential),
              //   );

              //API thanh hoa OK
              const resultParse = JSON.parse(createdInvoiceResult);
              if (resultParse.status === 'Ok') {
                const formattedInvoiceResults = waterUsedInvoiceDataWithKey.map(data =>
                  vnptEinvoiceHelpers.formatEinvoiceOutput(data, invoiceIssuedDate, eInvoiceCredential),
                );

                const brandNewInvoices = [];
                for (const formattedInvoice of formattedInvoiceResults) {
                  if (has(canceledEinvoices, formattedInvoice._id)) {
                    const canceledInvoice = get(canceledEinvoices, formattedInvoice._id);
                    if ('scrappedEinvoice' in canceledInvoice) {
                      set(
                        formattedInvoice,
                        'scrappedEinvoice',
                        canceledInvoice.scrappedEinvoice.concat(omit(canceledInvoice, 'scrappedEinvoice')),
                      );
                    } else {
                      set(formattedInvoice, 'scrappedEinvoice', [canceledInvoice]);
                    }
                    await rawEinvoiceDataCollection.replaceOne({ _id: formattedInvoice._id }, formattedInvoice, {
                      session,
                    });
                  } else {
                    brandNewInvoices.push(formattedInvoice);
                  }
                }

                // Insert new einvoices
                if (brandNewInvoices.length > 0) {
                  await rawEinvoiceDataCollection.insertMany(brandNewInvoices, { session });
                }
                await transaction.commit();
              }
            }
          }
          break;
        }
      }
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  EInvoiceData.remoteMethod('createNewEInvoice', {
    http: { verb: 'post' },
    accepts: [
      { arg: 'filter', type: 'object', required: true },
      { arg: 'selectedIds', type: ['string'] },
      { arg: 'invoiceIssuedDate', type: 'date', required: true },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    returns: { arg: 'data', type: 'number', root: true },
  });
};
