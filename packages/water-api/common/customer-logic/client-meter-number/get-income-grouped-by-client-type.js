'use strict';
const aggregate = require('../../utils/aggregate');
const moment = require('moment-timezone');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.getIncomeGroupedByClientType = async month => {
    const current = moment(month)
      .startOf('month')
      .toDate();

    // Use aggregation to get aggregated income grouped by client type
    const query = [
      {
        $match: {
          'invoiceData.totalFee': { $exists: true },
          $expr: {
            $and: [{ $gte: [current, '$fromDate'] }, { $lt: [current, '$toDate'] }],
          },
        },
      },
      {
        $project: {
          _id: 0,
          clientId: '$clientId',
          fee: '$invoiceData.totalFee',
        },
      },
      {
        $lookup: {
          from: 'Client',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client',
        },
      },
      { $unwind: '$client' },
      {
        $project: {
          _id: '$client.type',
          fee: '$fee',
        },
      },
      { $group: { _id: '$_id', value: { $sum: '$fee' } } },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: '$value',
        },
      },
    ];
    const result = await aggregate(ClientMeterNumber, query);
    return result;
  };

  ClientMeterNumber.remoteMethod('getIncomeGroupedByClientType', {
    accepts: { arg: 'month', type: 'date' },
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
