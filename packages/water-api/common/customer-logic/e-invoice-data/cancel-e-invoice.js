'use strict';
const httpError = require('http-errors');
const set = require('lodash/set');
const eInvoiceUtils = require('../../utils/formatEInvoiceData');
const { getConnectorFromModel } = require('../../utils/transaction-utils');
const toObjectId = require('../../utils/to-object-id');
const vnptEinvoiceHelpers = require('../../utils/vnpt-einvoice-helpers');

module.exports = EInvoiceData => {
  EInvoiceData.cancelEinvoice = async (id, invoiceIssuedDate, session) => {
    const rawEInvoiceDataCollection = getConnectorFromModel(EInvoiceData);
    const rawEinvoiceRangeCollection = getConnectorFromModel(EInvoiceData, 'EInvoiceRange');

    // 1. Get einvoice credential
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

    // 2. Find the original einvoice
    const originalEinvoice = await rawEInvoiceDataCollection.findOne({ _id: toObjectId(id) }, { session });
    if (originalEinvoice) {
      switch (eInvoiceCredential.provider) {
        case 'VIETTEL': {
          // 3. Prepare the data
          const preparedData = eInvoiceUtils.cancelInvoice(
            eInvoiceCredential,
            originalEinvoice.eInvoiceNo,
            originalEinvoice.eInvoiceDate,
            invoiceIssuedDate,
          );

          // 4. Send to einvoice provider API
          let canceledInvoiceResult = null;
          try {
            const result = await EInvoiceData.app.models.EInvoice.sendRequest({
              requestType: 'cancelTransactionInvoice',
              data: preparedData,
              supplierTaxCode: eInvoiceCredential.supplierTaxCode,
            });
            canceledInvoiceResult = result;
          } catch (error) {
            throw error;
          }

          if (!canceledInvoiceResult.errorCode) {
            // 5. If the cancellation went well, set the original einvoice as "canceled"
            await rawEInvoiceDataCollection.findOneAndUpdate(
              { _id: toObjectId(id) },
              { $set: { canceled: true } },
              { session },
            );

            // 6. Update the einvoice range
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
          }
          break;
        }
        case 'VNPT': {
          // Set new provider-exclusive credential
          // set(eInvoiceCredential, 'webUsername', rawEinvoiceCredential.webUsername);
          // set(eInvoiceCredential, 'webPassword', rawEinvoiceCredential.webPassword);
          // set(eInvoiceCredential, 'apiUsername', rawEinvoiceCredential.apiUsername);
          // set(eInvoiceCredential, 'apiPassword', rawEinvoiceCredential.apiPassword);
          // set(eInvoiceCredential, 'host', rawEinvoiceCredential.host);
          eInvoiceCredential = { ...rawEinvoiceCredential, ...eInvoiceCredential};

          // Request to dismiss previous invoice
          const canceledInvoiceResult = await vnptEinvoiceHelpers.cancelInvoice(
            eInvoiceCredential,
            originalEinvoice.eInvoiceNo,
          );
       
          if (canceledInvoiceResult.startsWith('OK')) {
            // 6. If the cancellation went well, set the original einvoice as "canceled"
            let invoice = await EInvoiceData.findById(id);
            await invoice.updateAttribute("canceled", true, (err, instance) => {
              console.log("canceledEInvoice error", err)
           });
          
           /*  await rawEInvoiceDataCollection.findOneAndUpdate(
              { _id: id},
              { $set: { "canceled": true } },
              { session },
            ); */
          } else {
            throw new Error('INVOICE_REPLACEMENT_ERROR');
          }
          break;
        }
      }
    }
  };
};
