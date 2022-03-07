'use strict';
const moment = require('moment-timezone');
const omit = require('lodash/omit');
const bulkUpdate = require('../../utils/bulk-update');
const Transaction = require('../../utils/transaction.js');
const toObjectId = require('../../utils/to-object-id');
const { getConnectorFromModel } = require('../../utils/transaction-utils');
const { getInvoiceData } = require('./calculate-invoices-utils');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.calculateInvoices = async (month, ids, filterValues) => {
    if (ids && ids.length > 0) {
      return ClientMeterNumber.calculateInvoicesInternal({ month, ids, filterValues });
    }
    const jobId = await ClientMeterNumber.app.runBackground({
      path: 'ClientMeterNumber.calculateInvoicesInternal',
      jobKey: `calculateInvoicesInternal-${moment(month).valueOf()}`,
      customeMsg: 'error.INVOICE_LOCK_INPROGRESS',
      data: { month, ids, filterValues },
    });
    return { jobId };
  };

  ClientMeterNumber.calculateInvoicesInternal = async ({ month, ids, filterValues, session, transaction }) => {
    let passingSession = true;
    // Wrap write ops in transaction
    if (!session || !transaction) {
      transaction = new Transaction(ClientMeterNumber);
      session = transaction.start();
      passingSession = false;
    }

    const invoiceDatas = await getInvoiceData({ model: ClientMeterNumber, month, ids, filterValues, session });
    // update client
    let clientUpdates = invoiceDatas.map(item => {
      let termInvoice = moment(item.invoiceData.toDate)
        .startOf('month')
        .toDate();
      return {
        $condition: { _id: toObjectId(item.clientId), termInvoice: { $lt: termInvoice } },
        termInvoice,
      };
    });

    let result = [];
    try {
      if (clientUpdates.length === 1 && invoiceDatas.length === 1) {
        // Update sequentially instead of bulk update for one record
        await getConnectorFromModel(ClientMeterNumber, 'Client').findOneAndUpdate(
          clientUpdates[0].$condition,
          { $set: { termInvoice: clientUpdates[0].termInvoice } },
          { session },
        );
        result = await getConnectorFromModel(ClientMeterNumber)
          .findOneAndUpdate(
            { _id: invoiceDatas[0].id },
            { $set: omit(invoiceDatas[0], 'id') },
            { returnOriginal: false, session },
          )
          .then(({ value }) => value);
      } else {
        await bulkUpdate(ClientMeterNumber.app.models.Client, clientUpdates, session);
        // update ClientMeterNumber
        result = await bulkUpdate(ClientMeterNumber, invoiceDatas, session);
      }
      await ClientMeterNumber.app.models.Client.calculateDebt(ids, session);

      // case: chot tat ca
      // if (!ids || !ids.length) {
      //   await ClientMeterNumber.exportInvoiceByGeo(month, filterValues, session);
      // }

      if (!passingSession) {
        await transaction.commit();
      }
      return result;
    } catch (error) {
      if (!passingSession) {
        await transaction.rollback();
      }
      throw error;
    }
  };

  ClientMeterNumber.remoteMethod('calculateInvoices', {
    accepts: [
      { arg: 'month', type: 'date', required: true },
      { arg: 'ids', type: ['string'] },
      { arg: 'filterValues', type: 'object' },
    ],
    returns: { arg: 'data', type: 'number', root: true },
  });
};
