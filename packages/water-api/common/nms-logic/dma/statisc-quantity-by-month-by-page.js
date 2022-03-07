'use strict';
const utilCommon = require('../../utils/common');
module.exports = function(Dma) {
  // co phan trang
  Dma.statisticQuantityByMonthByPage = async (filter, res) => {
    try {
      let { dmaId, time } = filter.where;
      let dataCollect = [];
      dataCollect = await Dma.statisticQuantityByMonth(dmaId, time);
      let result = utilCommon.filterData(filter, dataCollect, res);
      if (res) {
        res.header('content-range', dataCollect.length);
      }
      return result;
    } catch (e) {
      throw e;
    }
  };
  // bao cao san luong/that thoat(chart) co phan trang
  Dma.remoteMethod('statisticQuantityByMonthByPage', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
