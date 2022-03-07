'use strict';
// const util = require('util');
// const eachLimit = util.promisify(require('async/eachLimit'));
module.exports = function(GeoQuarter) {
  GeoQuarter.offlineDownload = async (page = 1, perPage = 500, options) => {
    let data = [],
      total = 0;
    if (options.accessToken) {
      const condition = {
        limit: perPage,
        skip: (page - 1) * perPage || 0,
      };
      data = await GeoQuarter.find(condition);
      total = await GeoQuarter.count();
    }
    return { data, page, perPage, total };
  };

  GeoQuarter.remoteMethod('offlineDownload', {
    accepts: [
      { arg: 'page', type: 'number', required: true },
      { arg: 'perPage', type: 'number', required: true },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
