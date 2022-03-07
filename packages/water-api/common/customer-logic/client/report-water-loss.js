'use strict';
let _ = require('lodash');
const moment = require('moment');
const set = require('lodash/set');
const ObjectID = require('mongodb').ObjectID;
const utilCommon = require('water-api/common/utils/common');
const aggregate = require('../../utils/aggregate');

module.exports = function(Client) {
  Client.getSumSupplyDMA = async function(dmaId, startMonth, endMonth) {
    let ret = 0;
    let cdt = {};
    cdt.fields = { id: true, input: true, dmaId: true, dmaName: true };
    cdt.where = {
      and: [{ dmaId }, { logTime: { between: [startMonth, endMonth] } }],
    };

    let datas = null;
    if (Client.app.models.LogWaterLossDmaMonth) {
      datas = await Client.app.models.LogWaterLossDmaMonth.find(cdt);
    }

    if (!datas || !datas.length) {
      return ret;
    }

    // console.log('>data', datas);

    ret = _.sumBy(datas, 'input');
    return ret;
  };

  // flgReport = true : bao cao that thoat nuoc
  // flgReport = false : dashboard, thong ke khoi luong nuoc
  Client.reportWaterLossDetail = async function(flgReport, time, filter, res) {
    // console.log('reportWaterLoss: ', filter);
    try {
      let { flgTotal, flgGetFull } = filter.where;
      // su dung cho dashboard, thong ke khoi luong nuoc
      let sumSupply = 0;
      let sumWaterUsage = 0;
      let sumLoss = 0;

      let dataSum = {
        sumSupply,
        sumWaterUsage,
        sumLoss,
      };

      let dataCollect = [];

      if (!time) {
        if (flgReport) {
          res.header('content-range', 0);
          return dataCollect;
        } else {
          return dataSum;
        }
      }
      let startMonth = moment(time).startOf('month');
      let endMonth = moment(time).endOf('month');
      let dmas = await Client.app.models.Dma.find();
      if (!dmas || !dmas.length) {
        if (flgReport) {
          res.header('content-range', 0);
          return dataCollect;
        } else {
          return dataSum;
        }
      }

      for (let i = 0; i < dmas.length; i++) {
        let itemDma = dmas[i];

        // tong cung cap
        let totalSupply = await Client.getSumSupplyDMA(itemDma.id, startMonth, endMonth); // gia tri tren dong ho tong cua moi DMA

        let record = {};
        record.id = dmas[i].id;
        record.dma = dmas[i].name;
        record.totalSupply = totalSupply; // cung cap
        record.totalWaterUsage = 0; // su dung
        let data = await aggregate(Client, query('dmaId', itemDma.id, time));
        if (data && data.length === 1) {
          record.totalWaterUsage = data[0].totalWaterUsed;
        }

        record.totalLoss = totalSupply > record.totalWaterUsage ? totalSupply - record.totalWaterUsage : 0; // that thoat
        record.rateLoss = totalSupply ? (record.totalLoss * 100) / totalSupply : 0; // ti le that thoat
        dataCollect.push(record);

        sumSupply += record.totalSupply;
        sumWaterUsage += record.totalWaterUsage;
        sumLoss += record.totalLoss;
      }
      if (flgGetFull === true) {
        if (res) {
          res.header('content-range', dataCollect.length);
        }
        return dataCollect;
      } else if (flgReport && flgTotal !== true) {
        // bao cao that thoat nuoc => su dung cho list
        return utilCommon.filterData(filter, dataCollect, res);
      } else {
        // case: flgReport = false or  flgTotal === true
        //  + flgReport = false : dashboard, thong ke khoi luong nuoc
        //  + flgTotal === true:   bao cao that thoat nuoc => tinh tong tat ca recor
        dataSum.sumSupply = sumSupply;
        dataSum.sumWaterUsage = sumWaterUsage;
        dataSum.sumLoss = sumLoss;
        dataSum.sumRateLoss = sumSupply ? (sumLoss * 100) / sumSupply : 0;
        return dataSum;
      }
    } catch (error) {
      throw error;
    }
  };
  Client.reportWaterLoss = async function(filter, res) {
    let flgReport = true; // true: bao cao that thoat nuoc
    let { time } = filter.where;
    return await Client.reportWaterLossDetail(flgReport, time, filter, res);
  };
  // bao cao that thoat nuoc
  Client.remoteMethod('reportWaterLoss', {
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
            $and: [{ $eq: null }],
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
                $expr: {
                  $and: [
                    { $lte: ['$toDate', null] }, //replace, end time
                    { $gte: ['$toDate', null] }, //replace, start time
                    { $eq: ['$clientId', '$$id'] },
                  ],
                },
              },
            },
            { $project: { 'invoiceData.totalWaterUsed': 1 } },
          ],
          as: 'clientMeterNumber',
        },
      },
      { $unwind: '$clientMeterNumber' },
      //  {$limit : 2},
      {
        $group: {
          _id: null,
          totalWaterUsed: {
            $sum: '$clientMeterNumber.invoiceData.totalWaterUsed',
          },
        },
      },
    ];
    let tmp = [];
    tmp.push(`$${key}`, new ObjectID(val));

    let q = set(rawQuery, '[0].$match.$expr.$and[0].$eq', tmp);
    q = set(q, '[1].$lookup.pipeline[0].$match.$expr.$and[0].$lte[1]', endTime);
    q = set(q, '[1].$lookup.pipeline[0].$match.$expr.$and[1].$gte[1]', startTime);
    return q;
  };
};
