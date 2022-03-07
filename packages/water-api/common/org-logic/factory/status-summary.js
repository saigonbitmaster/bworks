// const createError = require('http-errors');
module.exports = function(Factory) {
  Factory.statusSummary = async () => {
    // return record;
    const factories = await Factory.find({ where: { status: 'OK', currentCapacityDay: { gt: 1 } } });
    const result = {
      count: 0,
      currentCapacityDay: 0,
      powerConsumption: 0,
      avgPH: 0,
      avgTurbidity: 0,
      currentLossRate: 0,
    };
    factories.map(factory => {
      result.count++;
      result.currentCapacityDay += factory.currentCapacityDay;
      result.powerConsumption += factory.powerConsumption;
      result.avgPH += factory.avgPH;
      result.avgTurbidity += factory.avgTurbidity;
      result.currentLossRate = 45; // factory.currentLossRate;
    });
    if (result.count) {
      result.avgPH /= result.count;
      result.avgTurbidity /= result.count;
    }

    return result;
  };
  Factory.remoteMethod('statusSummary', {
    accepts: [],
    returns: { arg: 'data', type: 'object', root: true },
    http: { verb: 'get' },
  });
};
