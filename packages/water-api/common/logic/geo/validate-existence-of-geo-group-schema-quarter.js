'use strict';

module.exports = GeoQuarter => {
  GeoQuarter.validateExistenceOfGeoGroupSchema = async () => {
    const allQuarters = await GeoQuarter.find({});
    for (let quarter of allQuarters) {
      if (quarter.geoGroupId) {
        return true;
      }
    }
    return false;
  };
  GeoQuarter.remoteMethod('validateExistenceOfGeoGroupSchema', {
    http: { verb: 'get' },
    returns: { arg: 'result', type: 'boolean' },
  });
};
