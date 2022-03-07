'use strict';
const moment = require('moment-timezone');
const createError = require('http-errors');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.delete = async id => {
    // console.log('delete client meter number', id);
    if (!id) {
      throw createError(400, 'error.DATA_NOT_EXIST');
    }

    let Client = ClientMeterNumber.app.models.Client;
    let ClientMeterHistory = ClientMeterNumber.app.models.ClientMeterHistory;

    let recordDelete = await ClientMeterNumber.findById(id);
    if (!recordDelete) {
      throw createError(400, 'error.DATA_NOT_EXIST');
    }

    // lay 2 record cuoi cung
    let lastRecords = await twoLastRecord(recordDelete, ClientMeterNumber);

    // kiem tra recordDelelete hop le?
    checkValidRecord(recordDelete, lastRecords);

    let client = await getClientRecord(Client, recordDelete.clientId.toString());

    // update fields model Client:  lastMeterNumber, lastTimeMeterNumberUpdate, termMeterNumber
    await updateClientByRecord(lastRecords, client, ClientMeterHistory);

    let res = await recordDelete.destroy();

    return res;
  };

  // delete lich su ghi nuoc
  ClientMeterNumber.remoteMethod('delete', {
    http: { verb: 'delete' },
    accepts: [{ arg: 'id', type: 'string' }],
    returns: [{ arg: 'data', type: 'any', root: true }],
  });
};

// check recordDelete hop le khi:
// + record cuoi cung
// + record chua xuat hoa don
function checkValidRecord(recordDelete, records) {
  if (!records || !records.length) {
    throw createError(400, 'error.CAN_NOT_DELETE_DATA');
  }

  let lastRecord = records[0];
  if (recordDelete.id !== lastRecord.id) {
    throw createError(400, 'error.ONLY_DELETE_LAST_MONTH_RECORD');
  }

  if (recordDelete.invoiceData && Object.keys(recordDelete.invoiceData).length) {
    throw createError(400, 'error.LOCKED_INVOICE_CAN_NOT_DELETE');
  }

  return true;
}
async function getClientRecord(Client, clientId) {
  let client = await Client.findById(clientId);
  if (!client) throw new Error('');
  return client;
}
async function twoLastRecord(recordDelete, ClientMeterNumber) {
  let lastRecords = await ClientMeterNumber.find({
    where: { clientId: recordDelete.clientId.toString() },
    order: 'fromDate DESC',
    limit: 2,
  });
  if (!lastRecords) throw createError(400, 'error.CAN_NOT_DELETE_DATA');
  return lastRecords;
}
async function updateClientByRecord(lastRecords, client, ClientMeterHistory) {
  if (lastRecords && lastRecords.length > 1) {
    // lastRecords[0]: record can xoa
    // lastRecords[1]: record truoc [record can xoa]
    let toDate = lastRecords[1].toDate;
    const data = {
      lastMeterNumber: lastRecords[1].currentNumber,
      lastTimeMeterNumberUpdate: toDate,
      termMeterNumber: moment(toDate)
        .startOf('month')
        .toDate(),
    };
    await client.updateAttributes(data);
  } else {
    let clientHistory = await ClientMeterHistory.findOne({
      where: { clientId: client.id.toString() },
      order: 'setupDate ASC',
    });
    const data = {
      lastMeterNumber: clientHistory.newMeterNumber,
      lastTimeMeterNumberUpdate: clientHistory.setupDate,
      termMeterNumber: moment(clientHistory.setupDate)
        .startOf('month')
        .toDate(),
    };
    await client.updateAttributes(data);
    return;
  }
}
