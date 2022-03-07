'use strict';
const moment = require('moment');
const utilCommon = require('../../utils/common');
const aggregate = require('../../utils/aggregate');
module.exports = function(Client) {
  Client.reportQuantityClientByGeo = async function(filter, res) {
    try {
      let { districtId, provinceId, wardId, time, flgTotal, flgGetFull } = filter.where;

      let total = {
        totalClient: 0,
      };

      let cdt = {};
      let tmp = [];
      let dataCollect = [];
      let endMonth = moment(time)
        .endOf('month')
        .toDate();

      let query = [
        {
          $match: {
            startMeterDate: { $lte: endMonth },
          },
        },
        {
          $project: {
            status: 1,
          },
        },
        { $sortByCount: '$status' },
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

        let record = {
          activeClient: 0,
          pauseClient: 0,
          stopClient: 0,
        };
        record.id = i;
        record[keyNameGeoChild] = itemGeo.name;
        query[0].$match[keyIdGeoChild] = itemGeo.id;
        let data = await aggregate(Client, query);
        data.find(function(item) {
          switch (item._id) {
            case 'ACTIVE':
              record.activeClient = item.count;
              break;
            case 'STOP':
              record.stopClient = item.count;
              break;
            case 'PAUSE':
              record.pauseClient = item.count;
              break;
            default:
              break;
          }
        });

        record.totalClient = record.activeClient + record.stopClient + record.pauseClient;
        dataCollect.push(record);

        total.totalClient += record.totalClient;
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

  Client.remoteMethod('reportQuantityClientByGeo', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};

/*
//code cũ
'use strict';
const moment = require('moment');
const utilCommon = require('../../utils/common');
module.exports = function(Client) {
    Client.reportQuantityClientByGeo = async function(filter, res) {
        // console.log('reportQuantityClientByGeo: ', filter);
        try {
            let { districtId, provinceId, wardId, time } = filter.where;

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
            // console.log('clients', clients);
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

                    if (itemClient.status === 'ACTIVE') {
                        ++activeClient;
                    } else if (itemClient.status === 'PAUSE') {
                        ++pauseClient;
                    } else if (itemClient.status === 'STOP') {
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
    Client.remoteMethod('reportQuantityClientByGeo', {
        accepts: [{ arg: 'filter', type: 'object' }, { arg: 'res', type: 'object', http: { source: 'res' } }],
        http: { verb: 'get' },
        returns: { arg: 'data', type: 'object', root: true },
    });
};
*/
