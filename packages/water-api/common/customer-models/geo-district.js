'use strict';

module.exports = function(GeoDistrict) {
  GeoDistrict.validatesUniquenessOf('code');
  GeoDistrict.observe('before delete', async (ctx, next) => {
    let geoDistrictId = ctx.where.id;
    let GeoWard = GeoDistrict.app.models.GeoWard;
    let ward = await GeoWard.findOne({ fields: { geoDistrictId: geoDistrictId } });
    if (ward.id) {
      return next('error.geodistricts.cantDelete');
    }

    next();
  });

  GeoDistrict.observe('before save', (ctx, next) => {
    // Find the name and code
    const { name, code } = ctx.instance || ctx.data;

    // Build the query
    const query = [{ name }, { code }];
    if (!ctx.isNewInstance) {
      const { id } = ctx.instance || ctx.data;
      query.push({ id: { neq: id } });
    }

    // Check in the database whether there is any matching record, barring the record to be modified
    GeoDistrict.find({ where: { and: query } }).then(duplicate => {
      // If yes, a duplication is found, return error
      if ((!Array.isArray(duplicate) && duplicate) || (Array.isArray(duplicate) && duplicate.length > 0)) {
        next('error.DUPLICATE_DATA');
      } else {
        // Else, proceed as usual
        next();
      }
    });
  });
};
