'use strict';
const moment = require('moment-timezone');
const get = require('lodash/get');
const aggregate = require('../../utils/aggregate');
const utilCommon = require('../../utils/common');
const ObjectID = require('mongodb').ObjectID;

module.exports = ClientMeterNumber => {
  ClientMeterNumber.paymentCollection = async (filter, res) => {
    let result = null;
    //const timeFrom = moment(timeRange.from).startOf('month').toDate();
    let startDay = filter.where.startDay;
    let endDay = filter.where.endDay;
    const timeFrom = moment(startDay)
      .startOf('day')
      .toDate();
    const timeTo = moment(endDay)
      .endOf('day')
      .toDate();
    //build match if filter with IDs or not
    /* let matchFilter = filter.where.id
      ? {
          updatedDate: {
            $gt: timeFrom,
            $lt: timeTo,
          },
          updaterId: { $in: filter.where.id.map(item => new ObjectID(item))},
          paymentStatus: true,
        }
      : {
          updatedDate: {
            $gt: timeFrom,
            $lt: timeTo,
          },
          paymentStatus: true,
        };

    let pipeline = [
      {
        $match: matchFilter,
      },
      {
        $group: {
          _id: '$updaterId',
          total: { $sum: '$invoiceData.totalFee' },
        },
      },
      {
        $lookup: {
          from: 'PaymentCollection',
          localField: '_id',
          foreignField: 'userID',
          as: 'paidOff',
        },
      },
      { $unwind: '$paidOff' },
      {
        $match: {
          'paidOff.paidOffDate': {
            $gt: timeFrom,
            $lt: timeTo,
          },
        },
      },
      {
        $group: {
            _id: "$_id",
            totalCollect: { $first: '$total' },
            totalPaidOff: { $sum: '$paidOff.amount' },
         
        }
    },
     {
        $project: {
            id: "$_id",
            totalCollect:'$totalCollect',
            totalPaidOff: '$totalPaidOff',
            totalUnPaidOff: { $subtract: ['$totalCollect', '$totalPaidOff']}
        }
    },
    ]; */

    let matchFilter = filter.where.id
      ? {
          updatedDate: {
            $gt: timeFrom,
            $lt: timeTo,
          },
          updaterId: { $in: filter.where.id.map(item => new ObjectID(item)) },
        }
      : {
          updatedDate: {
            $gt: timeFrom,
            $lt: timeTo,
          },
        };

    let pipeline = [
      {
        $match: matchFilter,
      },
      {
        $group: {
          _id: '$updaterId',
          total: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', true] }, '$invoiceData.totalFee', 0],
            },
          },
          totalUnCollect: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', false] }, '$invoiceData.totalFee', 0],
            },
          },
          totalClients: { $sum: 1 },
          paidClients: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', true] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'PaymentCollection',

          let: { userID: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userID', '$$userID'] },
                    { $gt: ['$paidOffDate', timeFrom] },
                    { $lt: ['$paidOffDate', timeTo] },
                  ],
                },
              },
            },
          ],

          as: 'paidOff',
        },
      },

      { $unwind: { path: '$paidOff', preserveNullAndEmptyArrays: true } },

      {
        $group: {
          _id: '$_id',
          totalCollect: { $first: '$total' },
          totalClients: { $first: '$totalClients' },
          totalUnCollect: { $first: '$totalUnCollect' },
          paidClients: { $first: '$paidClients' },
          totalPaidOff: { $sum: '$paidOff.amount' },
        },
      },
      {
        $project: {
          id: '$_id',
          totalClients: '$totalClients',
          paidClients: '$paidClients',
          totalCollect: '$totalCollect',
          totalUnCollect: '$totalUnCollect',
          totalPaidOff: '$totalPaidOff',
          totalUnPaidOff: { $subtract: ['$totalCollect', '$totalPaidOff'] },
        },
      },
    ];

    let data = await aggregate(ClientMeterNumber.app.models.ClientMeterNumber, pipeline);
    result = utilCommon.filterData(filter, data, res);
    return result;
  };

  ClientMeterNumber.remoteMethod('paymentCollection', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],

    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
