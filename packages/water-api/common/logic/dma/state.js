'use strict';
// const aggregate = require('../../utils/aggregate');

module.exports = Dma => {
  // const buildQuery = id => {};
  Dma.state = async id => {
    const reported = {};
    // flow logger
    const flowLoggers = await Dma.app.models.MaterialUse.find({
      where: { dmaId: id, type: 'FlowLogger', isMiddle: { neq: true } },
      fields: { id: true, optionKey: true },
    });
    // quality logger
    const qualityLoggers = await Dma.app.models.MaterialUse.find({
      where: { dmaId: id, type: 'QualityLogger', isMiddle: { neq: true } },
      fields: { id: true, optionKey: true, waterParameter: true },
    });
    if (flowLoggers.length > 0) {
      // todo
    }
    if (qualityLoggers.length > 0) {
      // todo
    }
    return { reported };
  };
  Dma.remoteMethod('state', {
    accepts: [{ arg: 'id', type: 'string' }],
    http: { verb: 'GET' },
    returns: { root: true, type: ['object'] },
  });
};
