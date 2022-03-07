'use strict';

module.exports = GeoWard => {
  GeoWard.validateExistenceOfGeoGroupSchema = async () => {
    const allWards = await GeoWard.find({});
   
    for (let ward of allWards) {
      if (ward.geoGroupId) {
        return true;
      }
    }
    return false;
  };
  GeoWard.remoteMethod('validateExistenceOfGeoGroupSchema', {
    http: { verb: 'get' },
    returns: { arg: 'result', type: 'boolean' },
  });
};