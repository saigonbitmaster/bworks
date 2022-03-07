'use strict';
const utilCommon = require('../../utils/common');
module.exports = function(Client) {
  Client.reportRevenueLoss = async function(filter, res) {
    // console.log('reportRevenueLoss: ', filter);
    try {
      let { districtId, provinceId, wardId, time, flgTotal, flgGetFull } = filter.where;
      // let { order } = filter;
      let cdt = {};
      let tmp = [];
      let dataCollect = [];

      let total = {
        sumInvoiceLoss: 0,
        sumWaterLoss: 0,
        sumWaterUsage: 0,
        sumRateLoss: 0,
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

      let revenueLossClients = await Client.revenueLossClientDetail(true, filter, res);
      if (!revenueLossClients.length) {
        if (res) {
          res.header('content-range', 0);
        }
        return flgTotal === true ? total : dataCollect;
      }

      for (let i = 0; i < geos.length; i++) {
        let itemGeo = geos[i];

        let totalWaterUsage = 0; // luong nuoc su dung thuc te
        let totalWaterRevenueLoss = 0; // luong nuoc that thoat
        let totalInvoiceWaterRevenueLoss = 0; // so tien that thoat
        for (let k = 0; k < revenueLossClients.length; k++) {
          let itemClient = revenueLossClients[k];
          if (!itemClient.infoClient[keyIdGeoChild] || !itemGeo.id.equals(itemClient.infoClient[keyIdGeoChild])) {
            continue;
          }
          totalWaterUsage += itemClient.totalWaterUsage;
          totalWaterRevenueLoss += itemClient.totalWaterRevenueLoss;
          totalInvoiceWaterRevenueLoss += itemClient.totalInvoiceWaterRevenueLoss;
        }
        let record = {};
        record.id = itemGeo.id;
        record[keyNameGeoChild] = itemGeo.name;
        record.totalWaterRevenueLoss = totalWaterRevenueLoss;
        record.totalInvoiceWaterRevenueLoss = totalInvoiceWaterRevenueLoss;
        record.totalWaterUsage = totalWaterUsage;
        record.rateWaterRevenueLoss = totalWaterUsage ? (totalWaterRevenueLoss * 100) / totalWaterUsage : 0; // ti le that thoat
        dataCollect.push(record);

        total.sumInvoiceLoss += totalInvoiceWaterRevenueLoss;
        total.sumWaterLoss += totalWaterRevenueLoss;
        total.sumWaterUsage += totalWaterUsage;
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
        total.sumRateLoss = total.sumWaterUsage ? (total.sumWaterLoss * 100) / total.sumWaterUsage : 0;
        return total;
      } else {
        return utilCommon.filterData(filter, dataCollect, res);
      }
    } catch (error) {
      throw error;
    }
  };
  // bao cao that thu
  Client.remoteMethod('reportRevenueLoss', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
