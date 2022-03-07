'use strict';
const moment = require('moment-timezone');
const aggregate = require('../../utils/aggregate');
const format = require('../../utils/format');
module.exports = function(Dma) {
  Dma.getDma = async () => {
    const query = [
      {
        $graphLookup: {
          from: 'Dma',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parentDmaId',
          maxDepth: 0,
          as: 'child',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          level: 1,
          boundary: 1,
          center: 1,
          parentDmaId: 1,
          'child._id': 1,
          'child.name': 1,
          'child.level': 1,
          'child.parentDmaId': 1,
        },
      },
    ];
    return await aggregate(Dma, query);
  };
  Dma.mapWaterLoss = async (month, res) => {
    let result = [];
    let dmas = await Dma.getDma();
    // console.log(dmas);

    let timeRange = {};
    timeRange.from = moment(month).startOf('month');
    timeRange.to = moment(month).startOf('month');
    timeRange.type = 'month';

    let config = await Dma.app.models.NmsConfig.findById('RateWaterLeak');
    if (!config) {
      return [];
    }
    for (let i = 0; i < dmas.length; i++) {
      let dma = dmas[i];

      if (dma.level !== 1) {
        continue;
      }
      // Dma khong co Dma con => ignore
      // if (dma.child && dma.child.length === 0) {
      //   continue;
      // }

      let data = await Dma.statisticQuantityByMonth(dma._id, timeRange);

      // 1 thang 1 record
      if (!data || data.length !== 1) {
        continue;
      }

      let waterInfo = Object.assign({}, data[0]);
      let { leak, mainConsumption, subConsumption, time } = waterInfo;
      let rateLeak = (format.formatWithDec(leak) * 100) / format.formatWithDec(mainConsumption);
      rateLeak = format.formatWithDec(rateLeak, 2);
      let status = 'ok';

      // result: rateLeak > 30
      let cdtWarning = eval(`${rateLeak} ${config.value.warning.condition} ${config.value.warning.value}`);

      // result: rateLeak > 50
      let cdtHigh = eval(`${rateLeak} ${config.value.high.condition} ${config.value.high.value}`);

      // rateLeak > 50
      if (cdtHigh) {
        status = 'high';
      } else if (cdtWarning) {
        status = 'low';
      } else status = 'ok';

      let item = Object.assign({}, dma);
      item.mainConsumption = format.formatWithDec(mainConsumption);
      item.subConsumption = format.formatWithDec(subConsumption);
      item.leak = format.formatWithDec(leak);
      item.rateLeak = rateLeak;
      item.status = status;
      item.time = time;

      item.id = item._id;
      delete item._id;
      // item.waterInfo = waterInfo;
      result.push(item);
      // console.log('resonce: ', waterInfo);
    }
    res.header('content-range', result.length);
    return result;
  };
  Dma.remoteMethod('mapWaterLoss', {
    accepts: [
      { arg: 'month', type: 'date' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
