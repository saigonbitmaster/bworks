const moment = require('moment-timezone');
const slug = require('slug');
const aggregate = require('../../utils/aggregate');

module.exports = Dma => {
  const getRawDmaQualityWaterDaily = async (loggerId, from, to, domesticWaterStandards) => {
    if (!loggerId || !from || !to || !domesticWaterStandards) {
      return [];
    }
    const domesticWaterStandardsNames = domesticWaterStandards.map(std => slug(std.name.toLowerCase()));
    const projectedQualityFields = domesticWaterStandardsNames.reduce(
      (acc, val) => ({ ...acc, [val]: [`$min.${val}`, `$max.${val}`] }),
      {},
    );
    // get logger data
    const logger = await Dma.app.models.MaterialUse.findById(loggerId);
    if (!logger) return [];
    const startDay = moment(from)
      .startOf('day')
      .toDate();
    const endDay = moment(to)
      .endOf('day')
      .toDate();
    const averageQuery = {};
    domesticWaterStandardsNames.forEach(name => {
      averageQuery[`${name}`] = { $avg: `$avg.${name}` };
    });
    const query = [
      { $match: { key: logger.optionKey, logTime: { $gte: startDay, $lte: endDay } } },
      {
        $facet: {
          average: [{ $group: { _id: null, ...averageQuery } }],
          data: [{ $project: { logTime: { $convert: { input: '$logTime', to: 'long' } }, ...projectedQualityFields } }],
        },
      },
    ];
    const result = await aggregate(Dma.app.models.DmaQualityWaterHourly, query);

    return result;
  };

  Dma.getDmaQualityWaterDaily = async (dmaId, from, to) => {
    const loggerByDma = await Dma.getLoggerByDma(dmaId);

    if (loggerByDma && loggerByDma.length > 0) {
      // Get domestic water standards
      const domesticWaterStandards = await Dma.app.models.NmsConfig.findById('DomesticWaterStandard').then(standard =>
        standard ? standard.value : [],
      );

      // Compute the water quality data for each DMA
      for (const dma of loggerByDma) {
        if (dma.loggers && dma.loggers.length > 0) {
          for (const logger of dma.loggers) {
            logger.data = await getRawDmaQualityWaterDaily(logger._id, from, to, domesticWaterStandards);
            if (domesticWaterStandards) {
              logger.meta = { quality: domesticWaterStandards };
            }
          }
        }
      }
    }

    return loggerByDma;
  };

  Dma.remoteMethod('getDmaQualityWaterDaily', {
    accepts: [
      { arg: 'dmaId', type: 'string' },
      { arg: 'from', type: 'date', required: true },
      { arg: 'to', type: 'date', required: true },
    ],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { verb: 'get' },
  });
};
