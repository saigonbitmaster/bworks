'use strict';
const toObjectId = require('../../utils/to-object-id');
const createError = require('http-errors');
const { getConnectorFromModel } = require('../../utils/transaction-utils');

module.exports = Einvoicerange => {
  Einvoicerange.getProvidesStatusUsingInvoice = async (data, session) => {
    let currentData;
    if (typeof data === 'string') {
      if (session) {
        currentData = await getConnectorFromModel(Einvoicerange).findOne({ _id: toObjectId(data) });
      } else {
        currentData = await Einvoicerange.findById(data);
      }
    } else {
      currentData = data;
    }

    if (!currentData) {
      throw createError(400, 'error.WRONG_E_INVOICE_RANGE_ID');
    }

    const { supplierTaxCode, templateCode, serial } = currentData;
    // api docs param: templateCode, but real: pattern => Viettel shit document :(
    const result = await Einvoicerange.app.models.EInvoice.sendRequest({
      data: { supplierTaxCode, templateCode, serial },
      requestType: 'getProvidesStatusUsingInvoice',
    });
    return result;
  };
};
