'use strict';
const createError = require('http-errors');

module.exports = Einvoicerange => {
  Einvoicerange.observe('before save', async function(ctx) {
    // validate unique
    const { supplierTaxCode, templateCode, serial, isActive, priority, provider, id } = ctx.instance || ctx.data;
    if (ctx.isNewInstance) {
      const count = await Einvoicerange.count({ supplierTaxCode, templateCode, serial });
      if (count > 0) {
        throw createError(400, 'error.EXISTS_INVOICE_SERIAL');
      }
    }

    // if user has activate a range, ensure that is the only one currently active amongst others
    if (isActive) {
      const existingActiveEinvoiceRanges = await Einvoicerange.find({
        where: { isActive: true, id: { neq: id } },
        fields: { serial: 1 },
      }).then(results => results.map(({ serial }) => serial));
      if (existingActiveEinvoiceRanges.length > 0 && !existingActiveEinvoiceRanges.includes(serial)) {
        throw createError(400, 'error.MULTIPLE_ACTIVE_EINVOICE_RANGE_CONCURRENTLY');
      }
    }

    // validate priority value to be within 1 and 5
    if (priority) {
      if (priority < 1 || priority > 5) {
        throw createError(400, 'error.INVALID_PRIORITY_VALUE');
      }
    }

    if (provider === 'VIETTEL' && isActive) {
      //
      const verifyData = await Einvoicerange.getProvidesStatusUsingInvoice({ supplierTaxCode, templateCode, serial });
      if (!verifyData || verifyData.errorCode) {
        throw createError(400, 'error.INVALID_INVOICE_SERIAL');
      }
      const { numOfpublishInv, totalInv } = verifyData;
      ctx.instance.numOfpublishInv = numOfpublishInv;
      ctx.instance.verifyAt = new Date();
      ctx.instance.totalInv = totalInv;
    }
  });
};
