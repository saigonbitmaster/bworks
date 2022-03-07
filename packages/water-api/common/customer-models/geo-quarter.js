'use strict';
const intersection = require('lodash/intersection');
const set = require('lodash/set');
const get = require('lodash/get');

const validateExistenceOfGeoGroupSchema = require('../logic/geo/validate-existence-of-geo-group-schema-quarter');
// eslint-disable-next-line no-unused-vars
module.exports = function(Geoquarter) {
  validateExistenceOfGeoGroupSchema(Geoquarter)
  Geoquarter.observe('before delete', async ctx => {
    if (ctx.instance) {
      ctx.instance.fullAddress = Geoquarter.genFullAddress(ctx.instance);
    }
  });

  // Limit results returned API invocation only to those the client is in charged of
  Geoquarter.beforeRemote('find', async ctx => {
    const user = await ctx.req.accessToken.user.get();
    if (!user) {
      return Promise.reject('Invalid user');
    }

    if (user.username === 'master') {
      return;
    }

    const quarterInChargeIds = (user.quarterInChargeIds || []).map(i => i.toString());

    // Only assigned quarters can be retrieved
    // Master account is the only exception
    const filter = ctx.args.filter;
    const requestedQuarters = get(filter, 'where.id.inq', []);
    if (requestedQuarters.length > 0) {
      const allowedQuarters = intersection(quarterInChargeIds, requestedQuarters);
      set(ctx, 'args.filter.where.id.inq', allowedQuarters);
    } else {
      set(ctx, 'args.filter.where.id.inq', quarterInChargeIds);
    }

    return;
  });

  Geoquarter.observe('before save', (ctx, next) => {
    // Find the name and code
    if (ctx && ctx.instance) {
      const { name, code } = ctx.instance;
      // Build the query
      const query = [{ name }, { code }];
      if (!ctx.isNewInstance) {
        const { id } = ctx.instance;
        query.push({ id: { neq: id } });
      }

      // Check in the database whether there is any matching record, barring the record to be modified
      Geoquarter.find({ where: { and: query } }).then(duplicate => {
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
