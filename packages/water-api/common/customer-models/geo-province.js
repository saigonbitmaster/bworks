'use strict';

module.exports = function(GeoProvince) {
  GeoProvince.validatesUniquenessOf('code');
  GeoProvince.observe('before delete', async (ctx, next) => {
    let geoProvinceId = ctx.where.id;
    let GeoDistrict = GeoProvince.app.models.GeoDistrict;
    let district = await GeoDistrict.findOne({ fields: { geoProvinceId: geoProvinceId } });
    if (district.id) {
      return next('error.geoprovinces.cantDelete');
    }

    next();
  });

  GeoProvince.observe('before save', (ctx, next) => {
    // Find the name and code
    const { name, code } = ctx.instance || ctx.data;

    // Build the query
    const query = [{ name }, { code }];
    if (!ctx.isNewInstance) {
      const { id } = ctx.instance || ctx.data;
      query.push({ id: { neq: id } });
    }

    // Check in the database whether there is any matching record, barring the record to be modified
    GeoProvince.find({ where: { and: query } }).then(duplicate => {
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
