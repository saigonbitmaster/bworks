const createError = require('http-errors');
module.exports = GeoGroup => {
  GeoGroup.updateGeoGroupAndGeoQuarters = async (newGeoGroupName, newSelectedGeoQuarters, geoGroupId) => {
    const GeoQuarter = GeoGroup.app.models.GeoQuarter;

    // Find the GeoGroup instance matching with `geoGroupId` ID
    const matchedGeoGroup = await GeoGroup.findById(geoGroupId);
    if (!matchedGeoGroup) {
      throw createError(500, 'error.NON_EXISTENT_DATA');
    }
    // Replace its old name with newer name
    matchedGeoGroup.name = newGeoGroupName;
    await matchedGeoGroup.save();

    // Extract associated geoQuarters from the matched GeoGroup instance
    const oldAssociatedGeoQuarters = await matchedGeoGroup.geoQuarters.find();

    // Remove their `geoGroupId` attributes
    for (let oldGeoQuarter of oldAssociatedGeoQuarters) {
      await oldGeoQuarter.updateAttributes({ geoGroupId: null, assignedToGeoGroup: false });
    }

    // Fetch newly associated GeoQuarters
    const newAssociatedGeoQuarters = await GeoQuarter.find({ where: { _id: { inq: newSelectedGeoQuarters } } });

    // Update their `geoGroupId` attributes with the GeoGroupId
    for (let newGeoQuarter of newAssociatedGeoQuarters) {
      newGeoQuarter.geoGroupId = geoGroupId;
      newGeoQuarter.assignedToGeoGroup = true;
      await newGeoQuarter.save();
    }

    return { newGeoGroupName: newGeoGroupName, newGeoQuarterIds: newAssociatedGeoQuarters.map(({ id }) => id.toString()) };
  };

  GeoGroup.remoteMethod('updateGeoGroupAndGeoQuarters', {
    accepts: [
      { arg: 'newGeoGroupName', type: 'string' },
      { arg: 'newSelectedGeoQuarters', type: ['string'] },
      { arg: 'geoGroupId', type: 'string' },
    ],
    http: { verb: 'post' },
    returns: { arg: 'updatedGeoQuarters', type: 'object', root: true },
  });
};
