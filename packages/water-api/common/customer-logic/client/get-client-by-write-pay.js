'use strict';
const moment = require('moment-timezone');
const ObjectID = require('mongodb').ObjectID;
const set = require('lodash/set');
const has = require('lodash/has');
const aggregate = require('../../utils/aggregate');

module.exports = function(Client) {
  Client.getClientByWrite = async function(time, provinceId, districtId, wardId, centerPoint, maxDistance) {
    if (!time) {
      return [];
    }
    let pt;
    if (centerPoint) {
      pt = JSON.parse(centerPoint);
    }
    const res = await aggregate(Client, queryNew(time, provinceId, districtId, wardId, pt, maxDistance));

    // Merge written people into one group no matter their paid status
    const writtenRes = res.map(client => {
      if (has(client, 'status')) {
        if (client.status === null) {
          client.status = false;
        } else {
          client.status = true;
        }
      }
      return client;
    });
    return writtenRes;
  };

  // map ghi nuoc/ thanh thoan
  Client.remoteMethod('getClientByWrite', {
    accepts: [
      { arg: 'time', type: 'date' },
      { arg: 'provinceId', type: 'string' },
      { arg: 'districtId', type: 'string' },
      { arg: 'wardId', type: 'string' },
      { arg: 'centerPoint', type: 'string' },
      { arg: 'maxDistance', type: 'number' },
    ],
    http: { verb: 'get' },
    returns: { root: true, type: Array },
  });

  Client.getClientByPay = async (time, provinceId, districtId, wardId, centerPoint, maxDistance) => {
    if (!time) {
      return [];
    }
    let pt;
    if (centerPoint) {
      pt = JSON.parse(centerPoint);
    }
    const res = await aggregate(Client, queryNew(time, provinceId, districtId, wardId, pt, maxDistance));
    // Filter out client does not have this month's meter number
    const paidRes = res.filter(client => client.status !== null);
    return paidRes;
  };

  Client.remoteMethod('getClientByPay', {
    accepts: [
      { arg: 'time', type: 'date' },
      { arg: 'provinceId', type: 'string' },
      { arg: 'districtId', type: 'string' },
      { arg: 'wardId', type: 'string' },
      { arg: 'centerPoint', type: 'string' },
      { arg: 'maxDistance', type: 'number' },
    ],
    http: { verb: 'get' },
    returns: { root: true, type: Array },
  });

  // centerPoint: array
  const queryNew = (month, provinceId, districtId, wardId, centerPoint, maxDistance) => {
    let startMonth = moment(month)
      .startOf('month')
      .toDate();
    let endMonth = moment(month)
      .endOf('month')
      .toDate();
    let rawQuery = [
      {
        $geoNear: {
          near: { type: 'Point', coordinates: null }, //replace, array, format: [lng, lat]
          key: 'position',
          distanceField: 'dist.calculated',
          maxDistance: null, // replace
          includeLocs: 'dist.position',
          spherical: true,
          limit: 9999999999,
          // query: {
          //   status: 'ACTIVE',
          //   startMeterDate: { $lte: ISODate('2018-09-01T00:00:00.000+0700') },
          //   provinceId: ObjectId('5bb58a51d1c950171e3c7aa1'),
          //   districtId: ObjectId('5bb58a52d1c950171e3c7b92'),
          // },
          query: null, // replace
        },
      },
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
            _id: '$_id',
            name: '$name',
            formattedAddress: '$formattedAddress',
            position: '$position',
            // status: { $cond: { if: { $not: '$meterNumber' }, then: null, else: '$meterNumber.paymentStatus' } },
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
      //{ $limit: 500 },
    ];

    let coordinates = [];
    coordinates.push(centerPoint.lng);
    coordinates.push(centerPoint.lat);

    let q = {};
    q.status = 'ACTIVE';
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
    let query = set(rawQuery, '[0].$geoNear.near.coordinates', coordinates);
    query = set(query, '[0].$geoNear.maxDistance', maxDistance);
    query = set(query, '[0].$geoNear.query', q);
    query = set(query, '[1].$lookup.pipeline[0].$match.$expr.$and[1].$gte[1]', startMonth);
    query = set(query, '[1].$lookup.pipeline[0].$match.$expr.$and[2].$lte[1]', endMonth);
    return query;
  };
};
