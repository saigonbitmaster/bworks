'use strict';

module.exports = function(GeoCountry) {
  GeoCountry.observe('before delete', async (ctx, next) => {
    let geoCountryId = ctx.where.id;
    let GeoProvince = GeoCountry.app.models.GeoProvince;
    let province = await GeoProvince.findOne({ fields: { geoCountryId: geoCountryId } });
    if (province.id) {
      return next('error.geocountries.cantDelete');
    }

    next();
  });

  GeoCountry.observe('before save', (ctx, next) => {
    // Find the name and code
    const { name, code } = ctx.instance;

    // Build the query
    const query = [{ name }, { code }];
    if (!ctx.isNewInstance) {
      const { id } = ctx.instance;
      query.push({ id: { neq: id } });
    }

    // Check in the database whether there is any matching record, barring the record to be modified
    GeoCountry.find({ where: { and: query } }).then(duplicate => {
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
