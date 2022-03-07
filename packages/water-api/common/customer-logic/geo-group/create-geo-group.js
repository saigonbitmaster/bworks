const util = require('util');
const eachLimit = util.promisify(require('async/eachLimit'));
const createError = require('http-errors');

module.exports = GeoGroup => {
  GeoGroup.createGeoGroup = async (geoGroupName, geoQuarterIds) => {
    const GeoQuarter = GeoGroup.app.models.GeoQuarter;

    // Create new instance of GeoGroup if it has not created before
    let persistedWaterStation = await GeoGroup.findOne({ where: { name: geoGroupName } });
    if (persistedWaterStation) {
      throw createError(400, 'error.DUPLICATE_DATA');
    } else {
      persistedWaterStation = await GeoGroup.create({ name: geoGroupName });
    }

    // Assign the newly created instance's ID as foreign key to associated GeoWards
    const persistedWaterStationID = persistedWaterStation.id.toString();
    await eachLimit(geoQuarterIds, geoQuarterIds.length, async geoQuarterId => {
      const geoQuarter = await GeoQuarter.findById(geoQuarterId);
      if (geoQuarter) {
        await geoQuarter.updateAttributes({ geoGroupId: persistedWaterStationID, assignedToGeoGroup: true });
      }
    });
  };

  GeoGroup.remoteMethod('createGeoGroup', {
    accepts: [
      { arg: 'geoGroupName', type: 'string' },
      { arg: 'geoQuarterIds', type: ['string'] },
    ],
    http: { verb: 'get' },
  });
};
