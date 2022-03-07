'use strict';
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
const set = require('lodash/set');
const utilCommon = require('water-api/common/utils/common');
const aggregate = require('../../utils/aggregate');
module.exports = function(Client) {
  Client.reportDebtClientByProvider = async function(filter, res) {
    // console.log('reportDebtClientByProvider: ', filter);
    try {
      let { time, flgTotal, flgGetFull } = filter.where;

      let cdt = {};
      let dataCollect = [];

      let total = {
        totalDebt: 0,
      };

      if (!time) {
        res.header('content-range', 0);
        return flgTotal === true ? total : dataCollect;
      }

      let providers = await Client.app.models.WaterProvider.find(cdt);
      if (!providers || !providers.length) {
        res.header('content-range', 0);
        return flgTotal === true ? total : dataCollect;
      }

      let lenProvider = providers.length;
      for (let i = 0; i < lenProvider; i++) {
        let itemProvider = providers[i];
        let clients = await aggregate(Client, query(itemProvider.id, time));
        for (let i = 0; i < clients.length; i++) {
          let itemClient = clients[i];
          let record = {};
          record.id = itemClient._id;
          record.code = itemClient.code;
          record.name = itemClient.name;
          record.formattedAddress = itemClient.formattedAddress;
          record.debt = itemClient.clientMeterNumber.invoiceData.totalFee;
          record.provider = itemProvider.name;
          record.status = itemClient.status;
          dataCollect.push(record);

          total.totalDebt += record.debt;
        }
      }
      if (flgGetFull === true) {
        if (res) {
          res.header('content-range', dataCollect.length);
        }
        return dataCollect;
      } else if (flgTotal === true) {
        if (res) {
          res.header('content-range', 0);
        }
        return total;
      } else {
        return utilCommon.filterData(filter, dataCollect, res);
      }
    } catch (error) {
      throw error;
    }
  };
  // bao cao cong no khach hang theo nha cung cap
  Client.remoteMethod('reportDebtClientByProvider', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });

  const query = (id, time) => {
    let startTime = moment(time)
      .startOf('month')
      .toDate();
    let endTime = moment(time)
      .endOf('month')
      .toDate();
    let rawQuery = [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: null }, // replace , ex: ['$providerId', ObjectID('5a9513c61a4ea1255a443b7b')]
              { $in: ['$status', ['ACTIVE', 'STOP', 'PAUSE']] },
            ],
          },
        },
      },
      // {
      //   $lookup: {
      //     from: 'WaterProvider',
      //     let: { idWP: '$providerId' },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [{ $eq: ['$_id', '$$idWP'] }],
      //           },
      //         },
      //       },
      //       { $project: { name: 1, fullName: 1 } },
      //     ],
      //     as: 'provider',
      //   },
      // },
      // { $unwind: '$provider' },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $lte: ['$toDate', null] }, //replace, end time
                    { $gte: ['$toDate', null] }, //replace, start time
                    { $eq: ['$clientId', '$$id'] },
                    { $eq: ['$paymentStatus', false] },
                  ],
                },
              },
            },
            { $project: { clientId: 1, toDate: 1, 'invoiceData.totalFee': 1, paymentStatus: 1 } },
          ],
          as: 'clientMeterNumber',
        },
      },
      { $unwind: '$clientMeterNumber' },
      {
        $match: {
          'clientMeterNumber.invoiceData': { $exists: true },
        },
      },
    ];
    let tmp = [];
    tmp.push('$providerId', new ObjectID(id));
    let q = set(rawQuery, '[0].$match.$expr.$and[0].$eq', tmp);
    q = set(q, '[1].$lookup.pipeline[0].$match.$expr.$and[0].$lte[1]', endTime);
    q = set(q, '[1].$lookup.pipeline[0].$match.$expr.$and[1].$gte[1]', startTime);
    return q;
  };
};
