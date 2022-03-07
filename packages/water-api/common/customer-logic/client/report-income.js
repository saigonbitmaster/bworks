'use strict';
const moment = require('moment');
const set = require('lodash/set');
const ObjectID = require('mongodb').ObjectID;
const utilCommon = require('water-api/common/utils/common');
const aggregate = require('../../utils/aggregate');
module.exports = function(Client) {
  // report doanh thu/san luong theo loai khach hang
  Client.reportIncomeByClientType = async function(filter, res) {
    // console.log('reportIncomeByClientType: ', filter);
    try {
      // flgTotal = true : tinh tong tat ca cac record
      let { time, flgTotal, flgGetFull } = filter.where;

      let dataCollect = [];

      let total = {
        sumTotalInvoice: 0,
        sumTotalWaterUsage: 0,
      };

      if (!time) {
        res.header('content-range', 0);
        return flgTotal === true ? total : dataCollect;
      }

      let clientTypes = ['RESIDENT', 'ORGANIZATION', 'INDUSTRY', 'SERVICE'];

      for (let i = 0; i < clientTypes.length; i++) {
        let itemClientType = clientTypes[i];
        let record = {};
        record.id = itemClientType;
        record.clientType = itemClientType;
        record.totalInvoice = 0;
        record.totalWaterUsage = 0;
        let data = await aggregate(Client, query('type', itemClientType, time));
        if (data && data.length === 1) {
          record.totalInvoice = data[0].totalFee;
          record.totalWaterUsage = data[0].totalWaterUsed;

          total.sumTotalInvoice += data[0].totalFee;
          total.sumTotalWaterUsage += data[0].totalWaterUsed;
        }
        dataCollect.push(record);
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

  // report doanh thu/san luong theo geo
  Client.reportIncomeByGeo = async function(filter, res) {
    // console.log('reportIncomeByGeo: ', filter);
    try {
      // flgTotal = true : tinh tong tat ca cac record
      let { districtId, provinceId, wardId, time, flgTotal, flgGetFull } = filter.where;

      let cdt = {};
      let tmp = [];
      let dataCollect = [];

      let total = {
        sumTotalInvoice: 0,
        sumTotalWaterUsage: 0,
      };

      let geoModelChild = '';
      let keyNameGeoChild = '';
      let keyIdGeoChild = '';
      if (!time) {
        res.header('content-range', 0);
        return flgTotal === true ? total : dataCollect;
      }

      if (provinceId) {
        tmp.push({ provinceId });
        geoModelChild = 'GeoDistrict';
        keyNameGeoChild = 'district';
        keyIdGeoChild = 'districtId';
      }
      if (districtId) {
        tmp.push({ districtId });
        geoModelChild = 'GeoWard';
        keyNameGeoChild = 'ward';
        keyIdGeoChild = 'wardId';
      }
      if (wardId) {
        // end level geo
        // neu la xa/phuong, thi lay chinh no
        tmp.push({ wardId });
        geoModelChild = 'GeoWard';
        keyNameGeoChild = 'ward';
        keyIdGeoChild = 'wardId';
      }

      if (!geoModelChild) {
        res.header('content-range', 0);
        return flgTotal === true ? total : dataCollect;
      }

      let geos = [];
      if (wardId) {
        // neu la xa/phuong, thi lay chinh no
        let geo = await Client.app.models[geoModelChild].findById(wardId);
        if (geo) {
          geos.push(geo);
        }
      } else {
        // lay id cac child geo thuoc parent geo
        cdt.where = { and: tmp };
        geos = await Client.app.models[geoModelChild].find(cdt);
      }

      // console.log('geos', geos);
      if (!geos || !geos.length) {
        res.header('content-range', 0);
        return flgTotal === true ? total : dataCollect;
      }
      for (let i = 0; i < geos.length; i++) {
        let itemGeo = geos[i];
        // tim ten geo cua tung client
        let record = {};
        record.id = itemGeo.id;
        record[keyNameGeoChild] = itemGeo.name;
        record.totalInvoice = 0;
        record.totalWaterUsage = 0;
        let data = await aggregate(Client, query(keyIdGeoChild, itemGeo.id, time));
        if (data && data.length === 1) {
          record.totalInvoice = data[0].totalFee;
          record.totalWaterUsage = data[0].totalWaterUsed;

          total.sumTotalInvoice += data[0].totalFee;
          total.sumTotalWaterUsage += data[0].totalWaterUsed;
        }

        dataCollect.push(record);
      } // for i
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
  // report doanh thu/san luong theo nha cung cap
  Client.reportIncomeByProvider = async function(filter, res) {
    // console.log('reportIncomeByProvider: ', filter);
    try {
      // flgTotal = true : tinh tong tat ca cac record
      let { time, flgTotal, flgGetFull } = filter.where;

      let cdt = {};
      let dataCollect = [];

      let total = {
        sumTotalInvoice: 0,
        sumTotalWaterUsage: 0,
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
        let data = await aggregate(Client, query('providerId', itemProvider.id, time));

        let record = {};
        record.id = itemProvider.id;
        record.provider = itemProvider.name;
        record.totalInvoice = 0;
        record.totalWaterUsage = 0;
        if (data && data.length === 1) {
          record.totalInvoice = data[0].totalFee;
          record.totalWaterUsage = data[0].totalWaterUsed;

          total.sumTotalInvoice += data[0].totalFee;
          total.sumTotalWaterUsage += data[0].totalWaterUsed;
        }
        dataCollect.push(record);
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
  Client.reportIncome = async function(filter, res) {
    let { where } = filter;
    switch (where.incomeBy) {
      case 'geo': {
        return await Client.reportIncomeByGeo(filter, res);
      }
      case 'provider': {
        return await Client.reportIncomeByProvider(filter, res);
      }
      case 'clientType': {
        return await Client.reportIncomeByClientType(filter, res);
      }
      default: {
        if (res) {
          res.header('content-range', 0);
        }
        return [];
      }
    }
  };
  // bao cao doanh thu/san luong
  Client.remoteMethod('reportIncome', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });

  const query = (key, val, time) => {
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
              { $eq: null }, // replace , ex: ['$provinceId', ObjectID('5bb58a51d1c950171e3c7aa1')] hoac ['$type', 'RESIDENT)]
              // { $in: ['$status', ['ACTIVE', 'STOP', 'PAUSE']] },
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                invoiceData: { $exists: true },
                $expr: {
                  $and: [
                    { $lte: ['$toDate', null] }, //replace, end time
                    { $gte: ['$toDate', null] }, //replace, start time
                    { $eq: ['$clientId', '$$id'] },
                  ],
                },
              },
            },
            { $limit: 1 },
            { $project: { 'invoiceData.totalWaterUsed': 1, 'invoiceData.totalFee': 1 } },
          ],
          as: 'clientMeterNumber',
        },
      },
      { $unwind: '$clientMeterNumber' },
      {
        $group: {
          _id: null,
          totalWaterUsed: {
            $sum: '$clientMeterNumber.invoiceData.totalWaterUsed',
          },
          totalFee: {
            $sum: '$clientMeterNumber.invoiceData.totalFee',
          },
        },
      },
    ];
    let tmp = [];
    if (key === 'type') {
      tmp.push(`$${key}`, val);
    } else {
      tmp.push(`$${key}`, new ObjectID(val));
    }

    let q = set(rawQuery, '[0].$match.$expr.$and[0].$eq', tmp);
    q = set(q, '[1].$lookup.pipeline[0].$match.$expr.$and[0].$lte[1]', endTime);
    q = set(q, '[1].$lookup.pipeline[0].$match.$expr.$and[1].$gte[1]', startTime);
    return q;
  };
};
