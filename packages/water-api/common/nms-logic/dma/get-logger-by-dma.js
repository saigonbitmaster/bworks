'use strict';
const ObjectID = require('mongodb').ObjectID;
const aggregate = require('../../utils/aggregate');

module.exports = function(Dma) {
  Dma.getLoggerByDma = dmaId => {
    const dmaCondition = {};
    if (!dmaId || dmaId === 'AllDma') {
      dmaCondition.level = 1;
    } else {
      dmaCondition._id = new ObjectID(dmaId);
    }
    return aggregate(Dma, [
      {
        $match: dmaCondition,
      },
      {
        $lookup: {
          from: 'MaterialUse',
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                type: 'FlowLogger',
                $expr: {
                  $eq: ['$dmaId', '$$id'],
                },
              },
            },
            { $project: { name: 1, optionKey: 1 } },
          ],
          as: 'loggers',
        },
      },
      { $project: { name: 1, loggers: 1, level: 1, designPressure: 1, avgDemandDay: 1 } },
    ]);
  };
};
