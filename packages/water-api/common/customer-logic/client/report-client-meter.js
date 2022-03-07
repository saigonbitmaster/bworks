'use strict';
const moment = require('moment');
const utilCommon = require('../../utils/common');
const aggregate = require('../../utils/aggregate');

//lấy ngày setup đồng hồ làm ngày tính tuổi ĐH
module.exports = function(Client) {
  Client.reportClientMeter = async function(filter, res) {
    try {
      let { districtId, provinceId, wardId, time, flgTotal, flgGetFull } = filter.where;
      let cdt = {};
      let tmp = [];

      let total = {
        totalValid: 0, // trong thoi han
        totalNearExpired: 0, // sap het han
        totalExpired: 0, // qua thoi han
        totalAll: 0, // tong tat ca
      };

      //Lấy định mức tuổi thọ vật tư từ bảng ctmconfigs
      //expiredStandards.value.existTime.value = tuổi thọ vật tư
      //expiredStandards.value.lessTime.value = tuổi sắp hết hạn vật tư
      let expiredStandards = await Client.app.models.CtmConfig.findById('StatisticMatLifeSpan');
      let expiredDate = moment(time)
        .subtract(expiredStandards.value.existTime.value, 'months')
        .toDate();
      let nearExpired = moment(time)
        .subtract(expiredStandards.value.lessTime.value, 'months')
        .toDate();
      let dataCollect = [];
      let query = [
        {
          $match: {
            $or: [{ status: 'ACTIVE' }, { status: 'PAUSE' }],
          },
        },
        {
          $project: {
            _id: 1,
            provinceId: 1,
            districtId: 1,
            wardId: 1,
          },
        },
        {
          $lookup: {
            from: 'ClientMeter',
            localField: '_id',
            foreignField: 'clientId',
            as: 'meters',
          },
        },
        {
          $replaceRoot: {
            newRoot: { $mergeObjects: [{ $arrayElemAt: ['$meters', 0] }, '$$ROOT'] },
          },
        },
        {
          $project: {
            setupDate: 1,
          },
        },

        {
          $group: {
            _id: 'meterCount',
            total: { $sum: 1 },
            valid: { $sum: { $cond: [{ $gte: ['$setupDate', nearExpired] }, 1, 0] } }, // trong thoi han
            expired: { $sum: { $cond: [{ $lt: ['$setupDate', expiredDate] }, 1, 0] } }, // het thoi han
          },
        },
      ];

      let geoModelChild = '';
      let keyIdGeoChild = '';
      let keyNameGeoChild = '';

      if (!time) {
        res.header('content-range', 0);
        return flgTotal === true ? total : dataCollect;
      }

      if (provinceId) {
        tmp.push({ provinceId });
        geoModelChild = 'GeoDistrict';
        keyIdGeoChild = 'districtId';
        keyNameGeoChild = 'district';
      }
      if (districtId) {
        tmp.push({ districtId });
        geoModelChild = 'GeoWard';
        keyIdGeoChild = 'wardId';
        keyNameGeoChild = 'ward';
      }
      if (wardId) {
        tmp.push({ wardId });
        geoModelChild = 'GeoWard';
        keyIdGeoChild = 'wardId';
        keyNameGeoChild = 'ward';
      }

      if (!geoModelChild) {
        res.header('content-range', 0);
        return flgTotal === true ? total : dataCollect;
      }

      let geos = [];
      if (wardId) {
        let geo = await Client.app.models[geoModelChild].findById(wardId);
        if (geo) {
          geos.push(geo);
        }
      } else {
        cdt.where = { and: tmp };
        geos = await Client.app.models[geoModelChild].find(cdt);
      }

      if (!geos || !geos.length) {
        res.header('content-range', 0);
        return flgTotal === true ? total : dataCollect;
      }

      let lenGeo = geos.length;
      for (let i = 0; i < lenGeo; i++) {
        let itemGeo = geos[i];
        query[0].$match[keyIdGeoChild] = itemGeo.id;
        let data = await aggregate(Client, query);
        let record = {};
        record.id = i;
        record[keyNameGeoChild] = itemGeo.name;
        if (data[0]) {
          record.valid = data[0].valid; // trong thoi han
          record.expired = data[0].expired; // het thoi han

          record.total = data[0].total;

          // sap het han
          record.nearExpired = data[0].total - (data[0].expired + data[0].valid);
          dataCollect.push(record);

          total.totalValid += record.valid;
          total.totalNearExpired += record.nearExpired;
          total.totalExpired += record.expired;
          total.totalAll += record.total;
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
    } catch (e) {
      throw e;
    }
  };

  Client.remoteMethod('reportClientMeter', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};

/*
code cũ Hậu:
'use strict';
const moment = require('moment');
const utilCommon = require('../../utils/common');
module.exports = function(Client) {
    Client.reportClientMeter = async function(filter, res) {
        // console.log('reportClientMeter: ', filter);
        try {
            let { districtId, provinceId, wardId, time } = filter.where;
            //   console.log(filter.where);
            let cdt = {};
            let tmp = [];
            let dataCollect = [];

            let geoModelChild = '';
            let keyIdGeoChild = '';
            let keyNameGeoChild = '';

            if (!time) {
                res.header('content-range', 0);
                return dataCollect;
            }

            if (provinceId) {
                tmp.push({ provinceId });
                geoModelChild = 'GeoDistrict';
                keyIdGeoChild = 'districtId';
                keyNameGeoChild = 'district';
            }
            if (districtId) {
                tmp.push({ districtId });
                geoModelChild = 'GeoWard';
                keyIdGeoChild = 'wardId';
                keyNameGeoChild = 'ward';
            }
            if (wardId) {
                // end level geo
                // neu la xa/phuong, thi lay chinh no
                tmp.push({ wardId });
                geoModelChild = 'GeoWard';
                keyIdGeoChild = 'wardId';
                keyNameGeoChild = 'ward';
            }

            if (!geoModelChild) {
                res.header('content-range', 0);
                return dataCollect;
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
                return dataCollect;
            }

            // lay tat ca client theo filter geo, va thuoc 3 status
            tmp.push({ status: { inq: ['ACTIVE', 'STOP', 'PAUSE'] } });

            cdt = {};
            cdt.where = { and: tmp };
            let clients = await Client.find(cdt);
            if (!clients || !clients.length) {
                res.header('content-range', 0);
                return dataCollect;
            }
            let endMonth = moment(time)
                .endOf('month')
                .toDate();

            let lenClient = clients.length;
            let lenGeo = geos.length;

            for (let i = 0; i < lenGeo; i++) {
                let itemGeo = geos[i];

                let activeClient = 0;
                let pauseClient = 0;
                let stopClient = 0;

                for (let k = 0; k < lenClient; k++) {
                    let itemClient = clients[k];
                    if (!itemClient[keyIdGeoChild] || !itemGeo.id.equals(itemClient[keyIdGeoChild])) {
                        continue;
                    }

                    // kiem tra client da co meter va truoc time?
                    cdt = {};
                    cdt.where = { and: [{ clientId: itemClient.id }, { startMeterDate: { lte: endMonth } }] };
                    let meter = await Client.app.models.ClientMeter.findOne(cdt);
                    if (!meter) {
                        continue;
                    }

                    if (
                        moment(time)
                            .subtract(4.5, 'years')
                            .isBefore(meter.setupDate)
                    ) {
                        ++activeClient;
                    } else if (
                        moment(time)
                            .subtract(5, 'years')
                            .isBefore(meter.setupDate)
                    ) {
                        ++pauseClient;
                    } else {
                        ++stopClient;
                    }
                }

                let record = {};
                record.id = i;
                record[keyNameGeoChild] = itemGeo.name;
                record.activeClient = activeClient;
                record.pauseClient = pauseClient;
                record.stopClient = stopClient;
                record.totalClient = activeClient + pauseClient + stopClient;
                dataCollect.push(record);
            }
            return utilCommon.filterData(filter, dataCollect, res);
        } catch (e) {
            throw e;
        }
    };
    // thong ke so luong khach hang theo dia ly
    Client.remoteMethod('reportClientMeter', {
        accepts: [{ arg: 'filter', type: 'object' }, { arg: 'res', type: 'object', http: { source: 'res' } }],
        http: { verb: 'get' },
        returns: { arg: 'data', type: 'object', root: true },
    });
};
*/
