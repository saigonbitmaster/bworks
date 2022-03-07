'use strict';

module.exports = ClientMeterNumber => {
  ClientMeterNumber.shouldReplaceEinvoice = async id => {
    let result = false;
    const meterNumber = await ClientMeterNumber.findById(id, { invoiceData: 1 });
    if (meterNumber && meterNumber.invoiceData) {
      const einvoice = await ClientMeterNumber.app.models.EInvoiceData.findById(id);
      if (einvoice && !einvoice.canceled) {
        result = true;
      }
    }
   
    return result;
  };

  ClientMeterNumber.remoteMethod('shouldReplaceEinvoice', {
    http: { verb: 'get' },
    accepts: { arg: 'id', type: 'string' },
    returns: { arg: 'result', type: 'boolean' },
  });
};
