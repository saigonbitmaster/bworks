'use strict';
module.exports = Dma => {
  /**
   * Get Dma List for map
   * @param {*} parentId
   * @param {*} excludeIds
   * @param {*} deep
   */
  Dma.list = async (parentDmaId, excludeIds, deep) => {
    let result = [];
    let fields = {
      id: true,
      name: true,
      center: true,
      boundary: true,
      parentDmaId: true,
      designPressure: true,
      level: true,
    };
    let order = ['createdDate DESC'];
    let hasParent = true;
    excludeIds.map(id => {
      if (id === parentDmaId) {
        hasParent = false;
      }
    });
    const getDeep = async (dmas, currentDeep) => {
      if (currentDeep <= 0 || dmas.length == 0) return;
      let ids = dmas.map(dma => dma.id);
      let condition = { fields, order, where: { parentDmaId: { inq: ids } } };
      if (excludeIds && excludeIds.length > 0) {
        condition.where.id = { nin: excludeIds };
      }
      let subDmas = await Dma.find(condition);
      result = result.concat(subDmas);
      await getDeep(subDmas, currentDeep - 1);
    };
    // get parent dma
    if (hasParent) {
      let dma = await Dma.findOne({ fields, order, where: { id: parentDmaId } });
      if (dma) {
        result.push(dma);
      }
    }
    // get list
    let condition = { fields, order, where: parentDmaId ? { parentDmaId } : { level: 1 } };
    if (excludeIds && excludeIds.length > 0) {
      condition.where.id = { nin: excludeIds };
    }
    let dmas = await Dma.find(condition);
    result = result.concat(dmas);
    await getDeep(dmas, deep - 1);
    return result;
  };
  Dma.remoteMethod('list', {
    accepts: [
      { arg: 'parentDmaId', type: 'string', default: '' },
      { arg: 'excludeIds', type: ['string'], default: [] },
      { arg: 'deep', type: 'number', default: 1 },
    ],
    returns: { root: true, type: ['object'] },
  });
};
