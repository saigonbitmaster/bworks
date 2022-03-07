'use strict';
const intersection = require('lodash/intersection');
const get = require('lodash/get');
const set = require('lodash/set');
const importGeo = require('../logic/geo/import-geo');
const validateExistenceOfGeoGroupSchema = require('../logic/geo/validate-existence-of-geo-group-schema');

module.exports = function(Geoward) {
  Geoward.validatesUniquenessOf('code');
  importGeo(Geoward);
  validateExistenceOfGeoGroupSchema(Geoward);

  // Limit results returned API invocation only to those the client is in charged of
  Geoward.beforeRemote('find', async ctx => {
    const user = await ctx.req.accessToken.user.get();
    if (!user) {
      return Promise.reject('Invalid user');
    }
    if (user.username === 'master') {
      return;
    }

    // Only assigned wards can be retrieved
    // Master account is the only exception
    const wardInChargeIds = (user.wardInChargeIds || []).map(i => i.toString());
    const filter = ctx.args.filter;
    const requestedWards = get(filter, 'where.id.inq', []);
    if (requestedWards.length > 0) {
      const allowedWards = intersection(wardInChargeIds, requestedWards);
      set(ctx, 'args.filter.where.id.inq', allowedWards);
    } else {
      set(ctx, 'args.filter.where.id.inq', wardInChargeIds);
    }

    return;
  });

  Geoward.observe('before delete', async (ctx, next) => {
    let geoWardId = ctx.where.id;
    let GeoQuarter = Geoward.app.models.GeoQuarter;
    let quarter = await GeoQuarter.findOne({ fields: { geoWardId: geoWardId } });
    if (quarter.id) {
      return next('error.geowards.cantDelete');
    }

    next();
  });

  Geoward.observe('before save', (ctx, next) => {
    // Find the name and code
    if (ctx.instance) {
      const { name, code } = ctx.instance;

      // Build the query
      const query = [{ name }, { code }];
      if (!ctx.isNewInstance) {
        const { id } = ctx.instance;
        query.push({ id: { neq: id } });
      }

      // Check in the database whether there is any matching record, barring the record to be modified
      Geoward.find({ where: { and: query } }).then(duplicate => {
        // If yes, a duplication is found, return error
        if ((!Array.isArray(duplicate) && duplicate) || (Array.isArray(duplicate) && duplicate.length > 0)) {
          next('error.DUPLICATE_DATA');
        } else {
          // Else, proceed as usual
          next();
        }
      });
    } else {
      next();
    }
  });
};
