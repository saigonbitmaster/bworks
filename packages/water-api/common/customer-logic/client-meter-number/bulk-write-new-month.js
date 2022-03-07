'use strict';
const Transaction = require('../../utils/transaction');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.bulkWriteNewMonth = async (records, options, transaction, session) => {
    // Begin transaction
    let passingSession = true;
    if (!transaction || !session) {
      transaction = new Transaction(ClientMeterNumber);
      session = transaction.start();
      passingSession = false;
    }

    try {
      for (const record of records) {
        await ClientMeterNumber.writeNewMonth(record, options, transaction, session);
      }
      if (!passingSession) await transaction.commit();
    } catch (err) {
      if (!passingSession) await transaction.rollback();
      throw err;
    }
  };
};
