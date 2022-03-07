'use strict';
const util = require('util');
const { mapSeries } = require('async');
const moment = require('moment-timezone');
const status = require('../../utils/status');
// eslint-disable-next-line no-unused-vars
module.exports = Logwaterlossdmamonth => {
  Logwaterlossdmamonth.mapWaterLossAsync = async month => {
    let data = await Logwaterlossdmamonth.find({
      where: {
        logTime: moment(month)
          .startOf('month')
          .toDate(),
      },
    });
    if (data && data.length > 0) {
      let dataObj = {};
      let ids = data.map(item => {
        dataObj[item.dmaId.toString()] = item.__data;
        return item.dmaId;
      });
      let dmas = await Logwaterlossdmamonth.app.models.Dma.find({ id: { in: ids } });
      if (dmas && dmas.length > 0) {
        await util.promisify(mapSeries)(dmas, async dma => {
          let key = dma.id.toString();
          if (!dataObj[key]) {
            dataObj[key] = {};
          }
          dataObj[key].status = await status.waterLossDma(dma, dataObj[dma.id].input, dataObj[dma.id].fullLeak);
          dataObj[key].boundary = dma.boundary;
          dataObj[key].name = dma.name;
          dataObj[key].id = dma.id;
          dataObj[key].level = dma.level;
          // append status
        });
        return Object.keys(dataObj)
          .map(key => dataObj[key])
          .filter(item => !!item.boundary);
      }
    }
    return [];
  };
  Logwaterlossdmamonth.mapWaterLoss = (month, cb) => {
    Logwaterlossdmamonth.mapWaterLossAsync(month)
      .then(data => {
        if (data && data) {
          cb(null, data, data.length);
        }
      })
      .catch(err => cb(err));
  };
  Logwaterlossdmamonth.remoteMethod('mapWaterLoss', {
    accepts: [{ arg: 'month', type: 'date', default: '' }],
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'array', root: true },
      { arg: 'content-range', type: 'string', http: { target: 'header' } },
    ],
  });
};
