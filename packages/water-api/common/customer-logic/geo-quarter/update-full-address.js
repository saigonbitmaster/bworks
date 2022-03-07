'use strict';
const util = require('util');
const get = require('lodash/get');
module.exports = function(GeoQuarter) {
  GeoQuarter.genFullAddress = async idOrQuater => {
    const quarter = typeof idOrQuater === 'string' ? await GeoQuarter.findById(idOrQuater) : idOrQuater;
    const ward = await util.promisify(quarter.geoWard)();
    const district = await util.promisify(quarter.geoDistrict)();
    if (quarter && ward && district) {
      return `${get(quarter, 'name')}, ${get(ward, 'name')}, ${get(district, 'name')}`;
    }
    return '';
  };
  GeoQuarter.updateFullAddress = async idOrQuater => {
    const quarter = typeof idOrQuater === 'string' ? await GeoQuarter.findById(idOrQuater) : idOrQuater;
    const fullAddress = GeoQuarter.genFullAddress(quarter);
    quarter.fullAddress = fullAddress;
    await quarter.save();
  };
};
