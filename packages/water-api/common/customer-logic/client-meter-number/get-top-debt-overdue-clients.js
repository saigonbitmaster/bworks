'use strict';
const moment = require('moment-timezone');
const get = require('lodash/get');
const aggregate = require('../../utils/aggregate');
const config = require('../../../server/config');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.getTopDebtOverdueClients = async (filter, res) => {
    const month = get(filter, 'where.termMeterNumber');
    const debtOverdueLimit = get(config, 'customerReport.debtOverdueLimit', 5);

    if (month) {
      const startMonth = moment(month)
        .startOf('month')
        .toDate();
      const endMonth = moment(month)
        .endOf('month')
        .toDate();

      const query = [
        {
          $match: {
            'invoiceData.totalFee': { $exists: true },
            $expr: {
              $and: [
                { $lte: ['$toDate', endMonth] },
                { $gte: ['$toDate', startMonth] },
                { $eq: ['$paymentStatus', false] },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'EInvoiceData',
            let: { meterNumberId: '$_id' },
            pipeline: [
              {
                $match: {
                  canceled: false,
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$meterNumberId'] },
                      {
                        $gte: [
                          moment().toDate(),
                          { $add: ['$eInvoiceDate', moment.duration(debtOverdueLimit, 'days').asMilliseconds()] },
                        ],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: '$eInvoiceNo',
                },
              },
            ],
            as: 'invoice',
          },
        },
        { $unwind: '$invoice' },
        { $sort: { 'invoiceData.totalFee': -1 } },
        { $limit: 7 },
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
            id: '$_id',
            code: '$client.code',
            name: '$client.name',
            debt: '$invoiceData.totalFee',
          },
        },
      ];
      const result = await aggregate(ClientMeterNumber, query);
      res.header('Content-Range', result.length);
      return result;
    } else {
      res.header('Content-Range', 0);
      return [];
    }
  };

  ClientMeterNumber.remoteMethod('getTopDebtOverdueClients', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
