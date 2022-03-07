'use strict';
const moment = require('moment-timezone');
const ObjectID = require('mongodb').ObjectID;
const set = require('lodash/set');
const aggregate = require('../../utils/aggregate');

module.exports = function(Client) {
  Client.countClientByWrite = async (time, provinceId, districtId, wardId) => {
    const res = await aggregate(Client, queryNew(time, provinceId, districtId, wardId));
    const writtenResult = [
      { _id: { status: true }, countClient: 0 },
      { _id: { status: false }, countClient: 0 },
    ];
    for (let count of res) {
      if (count._id && count.countClient) {
        if (count._id.status !== null) {
          writtenResult[0].countClient += count.countClient;
        } else {
          writtenResult[1].countClient += count.countClient;
        }
      }
    }
    return writtenResult;
  };

  // map ghi nuoc/ thanh toan, count tat ca client ghi nuoc, thanh toan
  Client.remoteMethod('countClientByWrite', {
    accepts: [
      { arg: 'time', type: 'date' },
      { arg: 'provinceId', type: 'string' },
      { arg: 'districtId', type: 'string' },
      { arg: 'wardId', type: 'string' },
    ],
    http: { verb: 'get' },
    returns: { root: true, type: Array },
  });

  Client.countClientByPay = async (time, provinceId, districtId, wardId) => {
    const res = await aggregate(Client, queryNew(time, provinceId, districtId, wardId));
    const paidResult = [
      { _id: { status: 'paid' }, countClient: 0 },
      { _id: { status: 'notPaid' }, countClient: 0 },
      { _id: { status: 'notUsed' }, countClient: 0 },
    ];

    for (let count of res) {
      if (count._id && count.countClient) {
        if (count._id.status === 'paid') {
          paidResult[0].countClient += count.countClient;
        } else if (count._id.status === 'notPaid') {
          paidResult[1].countClient += count.countClient;
        } else if (count._id.status === 'notUsed') {
          paidResult[2].countClient += count.countClient;
        }
      }
    }
    return paidResult;
  };

  Client.remoteMethod('countClientByPay', {
    accepts: [
      { arg: 'time', type: 'date' },
      { arg: 'provinceId', type: 'string' },
      { arg: 'districtId', type: 'string' },
      { arg: 'wardId', type: 'string' },
    ],
    http: { verb: 'get' },
    returns: { root: true, type: Array },
  });
  const queryNew = (month, provinceId, districtId, wardId) => {
    let startMonth = moment(month)
      .startOf('month')
      .toDate();
    let endMonth = moment(month)
      .endOf('month')
      .toDate();
    let rawQuery = [
      { $match: null }, //replace
      {
        $lookup: {
          from: 'ClientMeterNumber',
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$clientId', '$$id'] },
                    { $gte: ['$toDate', null] }, // must be replace // startMonth
                    { $lte: ['$toDate', null] }, // must be replace // endMonth
                  ],
                },
              },
            },
            { $project: { toDate: 1, paymentStatus: 1, invoiceData: 1 } },
            { $limit: 1 },
          ],
          as: 'meterNumber',
        },
      },
      {
        $unwind: {
          path: '$meterNumber',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            status: {
              $cond: {
                if: { $not: '$meterNumber' },
                then: null,
                else: {
                  $cond: {
                    if: { $eq: ['$meterNumber.invoiceData.totalWaterUsed', 0] },
                    then: 'notUsed',
                    else: {
                      $cond: { if: { $eq: ['$meterNumber.paymentStatus', false] }, then: 'notPaid', else: 'paid' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: { status: '$status' },
          countClient: { $sum: 1 },
        },
      },
    ];

    let q = {};
    // q.status = 'ACTIVE';
    q.startMeterDate = { $lt: startMonth };
    if (provinceId) {
      q.provinceId = new ObjectID(provinceId);
    }
    if (districtId) {
      q.districtId = new ObjectID(districtId);
    }
    if (wardId) {
      q.wardId = new ObjectID(wardId);
    }
    let query = set(rawQuery, '[0].$match', q);
    query = set(query, '[1].$lookup.pipeline[0].$match.$expr.$and[1].$gte[1]', startMonth);
    query = set(query, '[1].$lookup.pipeline[0].$match.$expr.$and[2].$lte[1]', endMonth);
    return query;
  };
};
