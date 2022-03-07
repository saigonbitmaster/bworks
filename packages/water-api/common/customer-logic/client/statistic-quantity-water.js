'use strict';
const moment = require('moment');
const set = require('lodash/set');
const aggregate = require('../../utils/aggregate');
module.exports = function(Client) {
  Client.statisticQuantityWater = async function(filter, res) {
    // console.log('statisticQuantityWater', filter);
    try {
      let dataCollect = [];
      let { fromTime, toTime } = filter.where;
      if (!fromTime || !toTime) {
        return dataCollect;
      }
      let index = 0;
      for (
        let tmpDate = moment(fromTime).startOf('month');
        tmpDate <= moment(toTime).startOf('month');
        tmpDate = moment(tmpDate).add(1, 'M')
      ) {
        let record = {};
        // neu ap dung cho khu vuc co DMA thi su dung function:
        // let record = await Client.reportWaterLossDetail(false, tmpDate, filter, res);

        // hien tai ap dung cho khu vuc khong co DMA nen:
        // default: tong cung cap: 0 / tong that thoat: 0 / tong su dung: lay tu tong nuoc khach hang su dung

        record.sumSupply = 0;
        record.sumLoss = 0;
        record.sumWaterUsage = 0;

        let data = await aggregate(Client.app.models.ClientMeterNumber, query(tmpDate));
        if (data && data.length === 1) {
          record.sumWaterUsage = data[0].totalWaterUsed; // tong su dung, lay so lieu thuc te
        }

        record.id = index;
        ++index;
        record.time = moment(tmpDate).format('MM/YYYY');
        dataCollect.push(record);
      }

      res.header('content-range', dataCollect.length);
      return dataCollect;
    } catch (error) {
      throw error;
    }
  };
  const query = time => {
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
              { $lte: ['$toDate', null] }, //replace, end time
              { $gte: ['$toDate', null] }, //replace, start time
            ],
          },
        },
      },
      { $project: { 'invoiceData.totalWaterUsed': 1 } },
      {
        $group: {
          _id: null,
          totalWaterUsed: {
            $sum: '$invoiceData.totalWaterUsed',
          },
        },
      },
    ];
    let q = set(rawQuery, '[0].$match.$expr.$and[0].$lte[1]', endTime);
    q = set(q, '[0].$match.$expr.$and[1].$gte[1]', startTime);
    return q;
  };

  // dashboard, thong ke khoi luong nuoc
  Client.remoteMethod('statisticQuantityWater', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
