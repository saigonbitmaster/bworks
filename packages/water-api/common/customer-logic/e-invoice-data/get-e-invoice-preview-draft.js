'use strict';
const moment = require('moment-timezone');
const httpError = require('http-errors');
const eInvoiceUtil = require('../../utils/formatEInvoiceData');
const { getConnectorFromModel } = require('../../utils/transaction-utils');

module.exports = EInvoiceData => {
  EInvoiceData.getEInvoiceDraftPreview = async (filter, selectedIds, invoiceIssuedDate, res) => {
    const formattedWhere = { where: { ...filter, startMeterDate: { lt: filter.termInvoice.gte } }, fetchOne: true };

    const { sellerInfo } = EInvoiceData.app.models.EInvoice.config.dataSource.settings.meta;

    // Get einvoice data
    let rawInvoiceData = [];
    if (selectedIds && selectedIds.length > 0) {
      const selectedMeterNumberIds = selectedIds.map(id => `${id}${moment(filter.termInvoice.gte).format('-YYYY-MM')}`);
      rawInvoiceData = await EInvoiceData.app.models.ClientMeterNumber.findOne({
        where: { id: { inq: selectedMeterNumberIds } },
      }).then(i => i.toJSON());
    } else {
      rawInvoiceData = await EInvoiceData.app.models.Client.joinWithMeterNumber(formattedWhere, res);
    }

    if (!Array.isArray(rawInvoiceData)) {
      rawInvoiceData = [rawInvoiceData];
    }

    // Get the active einvoice credential
    const rawEinvoiceCredential = await getConnectorFromModel(EInvoiceData, 'EInvoiceRange').findOne({
      isActive: true,
    });
    if (!rawEinvoiceCredential) {
      throw httpError(500, 'error.NO_ACTIVE_EINVOICE_RANGE');
    }
    const eInvoiceCredential = {
      supplierTaxCode: rawEinvoiceCredential.supplierTaxCode,
      templateCode: rawEinvoiceCredential.templateCode,
      invoiceSeries: rawEinvoiceCredential.serial,
    };
    if (rawInvoiceData.length > 0) {
      const eInvoiceData = eInvoiceUtil.newInvoice(
        sellerInfo,
        { ...rawInvoiceData[0], invoiceIssuedDate },
        eInvoiceCredential,
      );
      const result = await EInvoiceData.app.models.EInvoice.sendRequest({
        requestType: 'getInvoiceDraftPreview',
        data: eInvoiceData,
      });
      return result.fileToBytes;
    }
    return null;
  };

  EInvoiceData.remoteMethod('getEInvoiceDraftPreview', {
    http: { verb: 'post' },
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'selectedIds', type: ['string'] },
      { arg: 'invoiceIssuedDate', type: 'date', required: true },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    returns: { arg: 'data', type: 'any', root: true },
  });
};
