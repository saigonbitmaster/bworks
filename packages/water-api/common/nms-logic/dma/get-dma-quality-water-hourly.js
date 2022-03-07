'use strict';
const moment = require('moment-timezone');
const slug = require('slug');
const aggregate = require('../../utils/aggregate');

module.exports = Dma => {
  const getRawDmaQualityWaterHourly = async (loggerId, day, isTimestamp, domesticWaterStandards) => {
    const projectedQualityFields = domesticWaterStandards
      .map(std => slug(std.name.toLowerCase()))
      .reduce((acc, val) => ({ ...acc, [val]: `$data.${val}` }), {});

    if (!loggerId || !day) {
      return [];
    }
    // get logger data
    const logger = await Dma.app.models.MaterialUse.findById(loggerId);
    if (!logger) return [];
    const startDay = moment(day)
      .startOf('day')
      .toDate();
    const endDay = moment(day)
      .endOf('day')
      .toDate();
    const query = [
      {
        $match: {
          key: logger.optionKey,
          logTime: {
            $gte: startDay,
            $lte: endDay,
          },
        },
      },
      { $sort: { logTime: 1 } },
      {
        $project: {
          hourTime: '$logTime',
          data: '$rawData',
        },
      },
      { $unwind: '$data' },
      { $addFields: { minute: { $minute: '$data.logTime' } } },
      {
        $project: {
          _id: 0,
          ...projectedQualityFields,
          logTime: isTimestamp
            ? { $convert: { input: { $add: ['$hourTime', { $multiply: ['$minute', 60000] }] }, to: 'long' } }
            : { $add: ['$hourTime', { $multiply: ['$minute', 60000] }] },
        },
      },
    ];
    console.log('query: ', JSON.stringify(query));
    const result = await aggregate(Dma.app.models.DmaQualityWaterHourly, query);

    return result;
  };

  Dma.getDmaQualityWaterHourly = async (dmaId, day) => {
    const loggerByDma = await Dma.getLoggerByDma(dmaId);

    if (loggerByDma && loggerByDma.length > 0) {
      // Get domestic water standards
      const domesticWaterStandards = await Dma.app.models.NmsConfig.findById('DomesticWaterStandard').then(standard =>
        standard ? standard.value : [],
      );

      // Compute the water quality data for each DMA
      for (let dma of loggerByDma) {
        if (dma.loggers && dma.loggers.length > 0) {
          for (let logger of dma.loggers) {
            logger.data = await getRawDmaQualityWaterHourly(logger._id, day, true, domesticWaterStandards);
            if (domesticWaterStandards) {
              logger.meta = { quality: domesticWaterStandards };
            }
          }
        }
      }
    }

    return loggerByDma;
  };

  Dma.remoteMethod('getDmaQualityWaterHourly', {
    accepts: [
      { arg: 'dmaId', type: 'string' },
      { arg: 'day', type: 'date', required: true },
    ],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { verb: 'get' },
  });
};
