'use strict';
// const set = require('lodash/set');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-timezone');
const aggregate = require('../../utils/aggregate');
const { isEmpty } = require('lodash');

module.exports = function(Client) {
  Client.getClientByNotificationGroup = async function(filter = {}) {
    let res = await aggregate(Client, makeAggregate(filter));
    return res;
  };

  // get client hien thi tren map
  Client.remoteMethod('getClientByNotificationGroup', {
    accepts: [
      { arg: 'functionCondition', type: 'object' },
      { arg: 'geographyCondition', type: 'object' },
    ],
    http: { verb: 'post' },
    returns: { root: true, type: Array },
  });

  // makeAggregate
  const makeAggregate = ({ functionCondition = {}, geographyCondition = {} }) => {
    const geographyObjectId = makeObjectId(geographyCondition);
    // const { invoiceFilter, meterNumberFilter } = functionCondition;
    const geoMatch = isEmpty(geographyObjectId) ? [] : [{ $match: { ...geographyObjectId, status: 'ACTIVE' } }];
    const currentMonth = moment().toDate();
    // const previousMonth = moment().subtract(1, 'month');
    const clientUserMatch = [
      {
        $lookup: {
          from: 'ClientUser',
          let: { clientId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$clientId', '$$clientId'],
                },
              },
            },
            {
              $project: {
                userDevices: true,
              },
            },
          ],
          as: 'ClientUser',
        },
      },
      {
        $unwind: {
          path: '$ClientUser',
          preserveNullAndEmptyArrays: false,
        },
      },
    ];
    const meterNumberMatch = [
      {
        $addFields: {
          lastWritedMeterId: {
            $concat: [
              { $convert: { input: '$_id', to: 'string' } },
              { $dateToString: { date: currentMonth, format: '-%Y-%m' } },
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          localField: 'lastWritedMeterId',
          foreignField: '_id',
          as: 'lastWriteMeterNumber',
        },
      },
      {
        $unwind: {
          path: '$lastWriteMeterNumber',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    const projectMatch = [
      {
        $project: {
          id: true,
          ClientUser: true,
        },
      },
    ];
    const aggregate = [...geoMatch, ...clientUserMatch, ...meterNumberMatch, ...projectMatch];
    // console.log('aggregate: ', JSON.stringify(aggregate));
    return aggregate;
  };
  const makeObjectId = geographyCondition => {
    const result = {};
    const keys = Object.keys(geographyCondition);
    for (const key of keys) {
      const value = geographyCondition[key];
      if (value) {
        result[key] = new ObjectID(value);
      }
    }
    return result;
  };
};
