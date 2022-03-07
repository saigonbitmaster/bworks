'use strict';
const util = require('util');
const eachLimit = util.promisify(require('async/eachLimit'));
module.exports = function(GeoQuarter) {
  GeoQuarter.updateAllFullAddress = async () => {
    const quarters = await GeoQuarter.find();
    await eachLimit(quarters, 1, async quarter => {
      await GeoQuarter.updateFullAddress(quarter);
    });
    // eslint-disable-next-line no-console
    console.log('finish updateAllFullAddress');
  };
};
