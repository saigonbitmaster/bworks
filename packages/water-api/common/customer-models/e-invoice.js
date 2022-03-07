'use strict';
const crypto = require('crypto');
const basic = require('basic-authorization-header');
const has = require('lodash/has');
const set = require('lodash/set');
const mapValues = require('lodash/mapValues');
const debug = require('debug')('water-api:model:e-invoice');

module.exports = EInvoice => {
  // eslint-disable-next-line no-unused-vars
  EInvoice.sendRequest = async ({ params, ...rest }) => {
    const meta = EInvoice.config.dataSource.settings.meta;
    const { username, password, tax } = meta;
    let { requestType, data, supplierTaxCode } = params || rest;
    let authorization = basic(username, password);
    let subUrl = '';
    const finalTax = supplierTaxCode ? supplierTaxCode : tax;
    switch (requestType) {
      case 'createNewInvoice': {
        subUrl = `InvoiceWS/createInvoice/${finalTax}`;
        break;
      }
      case 'replaceInvoice': {
        subUrl = `InvoiceWS/createInvoice/${finalTax}`;
        break;
      }
      case 'replaceInvoiceInBatch': {
        subUrl = `InvoiceWS/createBatchInvoice/${finalTax}`;
        break;
      }
      case 'getProvidesStatusUsingInvoice': {
        subUrl = 'InvoiceUtilsWS/getProvidesStatusUsingInvoice';
        break;
      }
      case 'getUsingInvoiceByTime': {
        subUrl = 'InvoiceUtilsWS/getListInvoiceDataControl';
        break;
      }
      case 'getInvoicePdfFile': {
        subUrl = 'InvoiceUtilsWS/getInvoiceRepresentationFile';
        break;
      }
      case 'getInvoiceDraftPreview': {
        subUrl = `InvoiceUtilsWS/createInvoiceDraftPreview/${finalTax}`;
        break;
      }
      case 'createNewInvoiceInBatch': {
        subUrl = `InvoiceWS/createBatchInvoice/${finalTax}`;
        break;
      }
      case 'cancelTransactionInvoice': {
        subUrl = `InvoiceWS/cancelTransactionInvoice`;
        break;
      }
      default: {
        break;
      }
    }

    debug({ requestType, data });

    // Encrypt buyer data before sending to Viettel Einvoice API
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const encrypt = text => {
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
      let encrypted = cipher.update(text);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return encrypted.toString('hex').slice(0, text.length);
    };

    if (process.env.NODE_ENV !== 'production') {
      if (has(data, 'buyerInfo')) {
        const encryptedData = mapValues(data.buyerInfo, value => encrypt(value));
        set(data, 'buyerInfo', encryptedData);
      } else if (
        has(data, 'commonInvoiceInputs') &&
        Array.isArray(data.commonInvoiceInputs) &&
        data.commonInvoiceInputs.length > 0
      ) {
        for (let i = 0; i < data.commonInvoiceInputs.length; i++) {
          const invoiceInput = data.commonInvoiceInputs[i];
          if (has(invoiceInput, 'buyerInfo')) {
            const encryptedData = mapValues(invoiceInput.buyerInfo, value => encrypt(value));
            set(data, `commonInvoiceInputs.[${i}].buyerInfo`, encryptedData);
          }
        }
      }
    }

    return new Promise((resolve, reject) => {
      if (requestType === 'cancelTransactionInvoice') {
        EInvoice.invoke({ authorization, subUrl, formData: data }, (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      } else {
        EInvoice.invoke({ authorization, subUrl, data }, (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      }
    });
  };
};
