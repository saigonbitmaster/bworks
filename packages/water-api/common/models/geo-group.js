'use strict';
// eslint-disable-next-line
module.exports = GeoGroup => {
  GeoGroup.observe('before delete', async ctx => {
    const geoGroupId = ctx.where.id;
    const GeoWard = GeoGroup.app.models.GeoWard;
    let associatedGeoWards = await GeoWard.find({ where: { geoGroupId: geoGroupId } });
    if (associatedGeoWards) {
      for (let associatedGeoWard of associatedGeoWards) {
        await associatedGeoWard.updateAttributes({ geoGroupId: null, assignedToGeoGroup: false });
      }
    }
    return;
  });
};
