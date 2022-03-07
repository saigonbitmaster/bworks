const util = require('util');
const fs = require('fs');
const promisifiedFsDeleteFile = util.promisify(require('fs').unlink);
const promisifiedFsWriteFile = util.promisify(require('fs').writeFile);
const path = require('path');
const moment = require('moment-timezone');
const chunk = require('lodash/chunk');
const has = require('lodash/has');
const flatten = require('lodash/flatten');
const httpError = require('http-errors');
const easyMergePdf = require('easy-pdf-merge');
const mapSeries = util.promisify(require('async/mapSeries'));
const uuidv1 = require('uuid/v1');
const vnptEinvoiceHelper = require('../../utils/vnpt-einvoice-helpers');

module.exports = EinvoiceData => {
  EinvoiceData.downloadEinvoiceInternal = async (filterValues, selectedIds, res) => {
    // Fetch active einvoice range
    const rawEinvoiceCredential = await EinvoiceData.app.models.EInvoiceRange.findOne({ where: { isActive: true } });
    if (!rawEinvoiceCredential) {
      throw httpError(500, 'error.NO_ACTIVE_EINVOICE_RANGE');
    }

    let results = [];
    switch (rawEinvoiceCredential.provider) {
      case 'VIETTEL': {
        // Fetch einvoice data
        // Only einvoices having sufficient fields can be downloaded
        let qualifiedEinvoices = [];
        if (selectedIds && selectedIds.length > 0) {
          const selectedMeterNumberIds = selectedIds.map(
            id => `${id}${moment(filterValues.where.termInvoice.gte).format('-YYYY-MM')}`,
          );
          qualifiedEinvoices = await EinvoiceData.find({ where: { id: { inq: selectedMeterNumberIds } } }).then(
            results => {
              const filteredResults = results
                .filter(result => !(has(result, 'tax') && has(result, 'eInvoiceNo') && has(result, 'templateCode')))
                .map(result => ({
                  supplierTaxCode: result.tax,
                  invoiceNo: result.eInvoiceNo,
                  templateCode: result.templateCode,
                  fileType: 'PDF',
                }));
              return filteredResults;
            },
          );
        } else {
          filterValues.fetchAllEinvoice = true;
          qualifiedEinvoices = await EinvoiceData.app.models.Client.joinWithMeterNumber(filterValues, res, false).then(
            results => {
              const remappedResults = results.map(result => ({
                supplierTaxCode: result.tax,
                invoiceNo: result.eInvoiceNo,
                templateCode: result.templateCode,
                fileType: 'PDF',
              }));
              return remappedResults;
            },
          );
        }

        // Divide into batches of 50 records and send download requests for byte string
        const downloadBatches = chunk(qualifiedEinvoices, 50);
        results = await mapSeries(downloadBatches, async batch => {
          const results = await Promise.all(
            batch.map(
              async invoiceItem =>
                await EinvoiceData.app.models.EInvoice.sendRequest({
                  requestType: 'getInvoicePdfFile',
                  data: invoiceItem,
                  supplierTaxCode: rawEinvoiceCredential.supplierTaxCode,
                }),
            ),
          );
          if (results.length !== batch.length) {
            throw httpError(500, 'error.INTERNAL_THIRD_PARTY_SERVICE_ERROR');
          }
          return results;
        });
        break;
      }
      case 'VNPT': {
        // Fetch einvoice data
        // Only einvoices having sufficient fields can be downloaded
        let qualifiedEinvoices = [];
        if (selectedIds && selectedIds.length > 0) {
          const selectedMeterNumberIds = selectedIds.map(
            id => `${id}${moment(filterValues.where.termInvoice.gte).format('-YYYY-MM')}`,
          );
          qualifiedEinvoices = await EinvoiceData.find({
            where: { id: { inq: selectedMeterNumberIds } },
            fields: { eInvoiceNo: true },
          }).then(results => results.map(result => result.eInvoiceNo));
        } else {
          filterValues.fetchAllEinvoice = true;
          qualifiedEinvoices = await EinvoiceData.app.models.Client.joinWithMeterNumber(
            filterValues,
            res,
            false,
          ).then(results => results.map(result => result.eInvoiceNo));
        }

        // Divide into batches of 50 records and send download requests for byte string
        const downloadBatches = chunk(qualifiedEinvoices, 50);
        const einvoiceCredential = rawEinvoiceCredential;
        results = await mapSeries(downloadBatches, async batch => {
          const results = await Promise.all(
            batch.map(async invoiceNo => await vnptEinvoiceHelper.downloadInvoice(invoiceNo, einvoiceCredential)),
          ).then(batchResults => batchResults.map(batchResult => ({ fileName: uuidv1(), fileToBytes: batchResult })));
          if (results.length !== batch.length) {
            throw httpError(500, 'error.INTERNAL_THIRD_PARTY_SERVICE_ERROR');
          }
          return results;
        });
        break;
      }
    }

    const flattenedResults = flatten(results);

    // Save all blobs to temp files before merging
    const tmpDirPath = '/tmp/';
    const pdfs = [];
    for (let { fileName, fileToBytes } of flattenedResults) {
      const tmpFilePath = path.resolve(tmpDirPath, fileName);
      await promisifiedFsWriteFile(tmpFilePath, Buffer.from(fileToBytes, 'base64'));
      pdfs.push(tmpFilePath);
    }

    // Merge and return the filepath
    const mergedPdfFilepath = path.resolve(tmpDirPath, `${uuidv1()}.pdf`);
    return new Promise((resolve, reject) => {
      if (pdfs.length > 0) {
        if (pdfs.length === 1) {
          resolve(pdfs[0]);
        } else {
          easyMergePdf(pdfs, mergedPdfFilepath, err => {
            // Set up tasks of deleting merged PDFs to be processed in background
            EinvoiceData.app.runBackground({
              path: 'EInvoiceData.deleteUsedPdf',
              jobKey: uuidv1(),
              data: { filepaths: pdfs },
            });
            if (err) reject(err);
            resolve(mergedPdfFilepath);
          });
        }
      } else {
        reject();
      }
    });
  };

  EinvoiceData.deleteUsedPdf = ({ filepaths }) =>
    new Promise((resolve, reject) => {
      try {
        for (let filepath of filepaths) {
          promisifiedFsDeleteFile(filepath);
          resolve();
        }
      } catch (err) {
        reject(err);
      }
    });

  EinvoiceData.downloadEinvoice = (filterValues, selectedIds, res, callback) => {
    EinvoiceData.downloadEinvoiceInternal(filterValues, selectedIds, res).then(mergedPdfFilepath => {
      const downloadStream = fs.createReadStream(mergedPdfFilepath);
      const fileName = path.basename(mergedPdfFilepath);
      const contentType = 'application/pdf';
      const contentDisposition = `inline; filename=${fileName}`;
      return callback(null, downloadStream, contentType, contentDisposition);
    });
  };

  EinvoiceData.remoteMethod('downloadEinvoice', {
    http: { verb: 'get' },
    accepts: [
      { arg: 'filterValues', type: 'object' },
      { arg: 'selectedIds', type: ['string'] },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
