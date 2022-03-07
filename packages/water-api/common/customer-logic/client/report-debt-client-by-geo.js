'use strict';
const moment = require('moment');
const set = require('lodash/set');
const ObjectID = require('mongodb').ObjectID;
const utilCommon = require('water-api/common/utils/common');
const aggregate = require('../../utils/aggregate');
module.exports = function(Client) {
  Client.reportDebtClientByGeo = async function(filter, res) {
     console.log('reportDebtClientByGeo: ', filter);
    try {
      let { districtId, provinceId, wardId, time, flgTotal, flgGetFull } = filter.where;

      let total = {
        totalDebt: 0,
      };
      let dataCollect = [];

      let geoModelChild = '';
      let keyNameGeoChild = '';
      let keyIdChildGeo = '';

      let keyIdGeo = '';
      let idGeo = '';

      if (!time) {
        res.header('content-range', 0);
        return flgTotal === true ? total : dataCollect;
      }

      if (provinceId) {
        // tmp.push({ provinceId });
        geoModelChild = 'GeoDistrict';
        keyNameGeoChild = 'district';
        keyIdChildGeo = 'districtId';

        keyIdGeo = 'provinceId';
        idGeo = provinceId;
      }
      if (districtId) {
        // tmp.push({ districtId });
        geoModelChild = 'GeoWard';
        keyNameGeoChild = 'ward';
        keyIdChildGeo = 'wardId';

        keyIdGeo = 'districtId';
        idGeo = districtId;
      }
      if (wardId) {
        // end level geo
        // neu la xa/phuong, thi lay chinh no
        // tmp.push({ wardId });
        geoModelChild = 'GeoWard';
        keyNameGeoChild = 'ward';
        keyIdChildGeo = 'wardId';

        keyIdGeo = 'wardId';
        idGeo = wardId;
      }

      if (!geoModelChild) {
        res.header('content-range', 0);
        return flgTotal === true ? total : dataCollect;
      }
      let agrFilter = {};
      if (!flgTotal && !flgGetFull) {
        agrFilter = utilCommon.getAgrFilter(filter); // su dung cho list
      }

      let results = await aggregate(Client, query(keyIdGeo, idGeo, geoModelChild, keyIdChildGeo, time, agrFilter));
      let clients = [];
      if (flgTotal === true || flgGetFull === true) {
        clients = results;
      } else {
        clients = results[0].data;
      }
      // console.log(results);
      for (let i = 0; i < clients.length; i++) {
        let itemClient = clients[i];
        let record = {};
        record.id = itemClient._id;
        record.code = itemClient.code;
        record.name = itemClient.name;
        record.formattedAddress = itemClient.formattedAddress;
        record[keyNameGeoChild] = itemClient.geo.name ? itemClient.geo.name : '';
        record.debt = itemClient.clientMeterNumber.invoiceData.totalFee;
        record.status = itemClient.status;
        dataCollect.push(record);

        total.totalDebt += record.debt;
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
        res.header('content-range', results[0].info.length === 1 ? results[0].info[0].total : 0);
        return dataCollect;
      }
    } catch (error) {
      throw error;
    }
  };
  // bao cao cong no khach hang theo dia ly
  Client.remoteMethod('reportDebtClientByGeo', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });

  const query = (keyIdGeo, idGeo, nameChildGeo, keyIdChildGeo, time, agrFilter) => {
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
              { $eq: null }, // replace , ex: ['$provinceId', ObjectID('5bb58a51d1c950171e3c7aa1')]
              { $in: ['$status', ['ACTIVE', 'STOP', 'PAUSE']] },
            ],
          },
        },
      },
      {
        $lookup: {
          from: null, // replace, child geo, ex: GeoDistrict
          let: { idGeo: null }, // replace, id child geo, ex: '$districtId'
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$idGeo'] }],
                },
              },
            },
            { $project: { name: 1, fullName: 1 } },
          ],
          as: 'geo',
        },
      },
      { $unwind: '$geo' },
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
      // { $limit: 2 },
      {
        $facet: {
          info: [{ $count: 'total' }],
          data: [{ $skip: null }, { $limit: null }, { $sort: null }],
        },
      },
    ];

    let tmp = [];
    tmp.push(`$${keyIdGeo}`, new ObjectID(idGeo));

    let eqGeo = [];
    if (keyIdGeo === 'wardId') {
      eqGeo.push(`$_id`, '$$idGeo');
    } else {
      eqGeo.push(`$${keyIdGeo}`, '$$idGeo');
    }

    let q = set(rawQuery, '[0].$match.$expr.$and[0].$eq', tmp);

    q = set(q, '[1].$lookup.from', nameChildGeo);
    q = set(q, '[1].$lookup.let.idGeo', `$${keyIdChildGeo}`);

    q = set(q, '[3].$lookup.pipeline[0].$match.$expr.$and[0].$lte[1]', endTime);
    q = set(q, '[3].$lookup.pipeline[0].$match.$expr.$and[1].$gte[1]', startTime);
    if (Object.keys(agrFilter).length) {
      q = set(q, '[6].$facet.data[0].$skip', agrFilter.skip);
      q = set(q, '[6].$facet.data[1].$limit', agrFilter.limit);
      q = set(q, '[6].$facet.data[2].$sort', agrFilter.sort);
    } else {
      q.pop(); // remove [$facet] => lay tat ca reocord
    }

    return q;
  };
};
