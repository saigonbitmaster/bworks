const createError = require('http-errors');
module.exports = function(Dma) {
  Dma.deleteDma = async function(ids) {
    try {
      let count = 0;
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];

        let dmas = await Dma.find({ where: { parentDmaId: id } });
        if (dmas && dmas.length > 0) {
          throw createError(400, 'error.CAN_NOT_DELETE_DMA');
        }

        let matUses = await Dma.app.models.MaterialUse.find({ where: { dmaId: id } });
        if (matUses && matUses.length > 0) {
          throw createError(400, 'error.CAN_NOT_DELETE_DMA');
        }

        let logs = await Dma.app.models.LogStatisticDmaMonth.find({ where: { dmaId: id } });
        if (logs && logs.length > 0) {
          throw createError(400, 'error.CAN_NOT_DELETE_DMA');
        }
      }
      // ok => delete
      count = await Dma.destroyAll({ id: { inq: ids } });
      return count;
    } catch (e) {
      throw e;
    }
  };
  Dma.remoteMethod('deleteDma', {
    accepts: [{ arg: 'ids', type: 'array' }],
    http: { verb: 'GET' },
    returns: { arg: 'count', type: 'number', root: true },
  });
};
