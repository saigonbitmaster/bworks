'use strict';
const util = require('util');
const moment = require('moment-timezone');
const eachOfLimit = util.promisify(require('async/eachOfLimit'));
const aggregate = require('../../../common/utils/aggregate');
const mongoCommon = require('../../../common/utils/mongo-common');

const getMinTime = async app => {
  let result = null;
  let minTimeLog = await app.models.LogFlowLoggerDay.findOne({
    where: { step: 'init' },
    order: 'logTime ASC',
  });

  if (minTimeLog) {
    result = minTimeLog.logTime;
    if (result) {
      result = moment(result)
        .startOf('month')
        .toDate();
      // return null if result is current month
      if (moment().isSame(result, 'month')) return null;
      return result;
    }
  }
  // null
  return result;
};

const getDmas = async app => {
  const query = [
    {
      $lookup: {
        from: 'MaterialUse',
        let: { dmaId: '$_id' },
        pipeline: [
          {
            $match: {
              type: 'FlowLogger',
              'meta.isMiddle': { $ne: true },
              $expr: { $and: [{ $eq: ['$dmaId', '$$dmaId'] }] },
            },
          },
          { $project: { _id: 1, name: 1, optionKey: 1 } },
        ],
        as: 'loggers',
      },
    },
    { $project: { _id: 1, name: 1, level: 1, parentDmaId: 1, loggers: 1 } },
    { $limit: 100 },
  ];
  const dmas = await aggregate(app.models.Dma, query);
  return dmas;
};
// eslint-disable-next-line no-unused-vars
const monthly = async ({ app, options }) => {
  try {
    // get minTime (for month to process)
    const minTime = await getMinTime(app);
    if (!minTime) return; // stop if minTime is null (unknown cases or everything completed)
    // get dma
    const dmas = await getDmas(app);
    if (!dmas || dmas.length === 0) return;

    const startMonth = moment(minTime)
      .startOf('month')
      .toDate();
    const endMonth = moment(minTime)
      .endOf('month')
      .toDate();
    // calculate
    await eachOfLimit(dmas, 1, async dma => {
      if (dma.loggers && dma.loggers.length) {
        const keys = dma.loggers.map(item => item.optionKey);
        const query = [
          {
            $match: {
              key: { $in: keys },
              logTime: {
                $gte: startMonth,
                $lte: endMonth,
              },
            },
          },
          {
            $group: {
              _id: '$key',
              minFlowRate: { $min: '$minFlowRate' },
              avgFlowRate: { $avg: '$avgFlowRate' },
              maxFlowRate: { $max: '$maxFlowRate' },
              minPressure: { $min: '$minPressure' },
              avgPressure: { $avg: '$avgPressure' },
              maxPressure: { $max: '$maxPressure' },
              preFlow: { $min: '$preFlow' },
              maxFlow: { $max: '$maxFlow' },
              minLogTime: { $min: '$minLogTime' },
              maxLogTime: { $max: '$maxLogTime' },
            },
          },
          {
            $group: {
              _id: null,
              minFlowRate: { $sum: '$minFlowRate' },
              avgFlowRate: { $sum: '$avgFlowRate' },
              maxFlowRate: { $sum: '$maxFlowRate' },
              minPressure: { $avg: '$minPressure' },
              avgPressure: { $avg: '$avgPressure' },
              maxPressure: { $avg: '$maxPressure' },
              preFlow: { $sum: '$preFlow' },
              maxFlow: { $sum: '$maxFlow' },
              minLogTime: { $min: '$minLogTime' },
              maxLogTime: { $max: '$maxLogTime' },
            },
          },
          {
            $addFields: {
              consumption: { $subtract: ['$maxFlow', '$preFlow'] },
            },
          },
        ];
        const statisticDma = await aggregate(app.models.LogFlowLoggerDay, query);
        if (statisticDma && statisticDma[0]) {
          // re calculate pre Flow
          const finalData = {
            ...statisticDma[0],
            logTime: startMonth,
            keys,
            dmaId: dma._id,
            id: `${dma._id}-${moment(startMonth).format('YYYY-MM')}`,
          };
          delete finalData._id;
          await app.models.LogStatisticDmaMonth.upsert(finalData);
          // update
          await mongoCommon.updateMany(
            app.models.LogFlowLoggerDay,
            { step: 'init', logTime: { $gte: startMonth, $lte: endMonth } },
            {
              $set: {
                step: 'dma',
              },
            },
          );
        }
      }
    });
  } catch (error) {
    console.log('error generate LogStatisticDmaMonth', error);
  }
};

module.exports = monthly;
