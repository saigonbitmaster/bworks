'use strict';
const util = require('util');
const lodash = require('lodash');
const eachLimit = util.promisify(require('async/eachLimit'));

module.exports = GeoWard => {
  GeoWard.importGeo = async filterValues => {
    const RefCountry = GeoWard.app.models.RefCountry;
    const RefProvince = GeoWard.app.models.RefProvince;
    const RefDistrict = GeoWard.app.models.RefDistrict;
    const RefWard = GeoWard.app.models.RefWard;

    // Get provs
    const provinceFilter = filterValues.provinceId ? { where: { id: filterValues.provinceId } } : {};
    const displayedProvinceData = await RefProvince.find(provinceFilter);

    // Get dists
    const districtFilter = filterValues.provinceId
      ? filterValues.districtId
        ? { where: { and: [{ id: filterValues.districtId }, { provinceId: filterValues.provinceId }] } }
        : { where: { provinceId: filterValues.provinceId } }
      : {};
    const displayedDistrictData = await RefDistrict.find(districtFilter);

    // Get wards
    const wardFilter = {
      where: { _id: filterValues._id, districtId: filterValues.districtId, provinceId: filterValues.provinceId },
    };

    const displayedWardData = await RefWard.find(wardFilter);

    // Get country IDs from all geodata
    const countryData = lodash.uniq(
      lodash.flatten(
        [displayedProvinceData, displayedDistrictData, displayedWardData]
          .filter(coll => coll.length > 0)
          .map(coll => lodash.uniq(coll.map(geodatum => geodatum['countryId'].toString()))),
      ),
    );
    let countryFilter = null;
    if (countryData.length === 1) {
      countryFilter = { where: { id: countryData[0] } };
    } else if (countryData.length > 1) {
      countryFilter = { where: { and: countryData.map(countryId => ({ id: countryId })) } };
    }
    const displayedCountryData = await RefCountry.find(countryFilter);

    const GeoCountry = RefWard.app.models.GeoCountry;
    const GeoProvince = RefWard.app.models.GeoProvince;
    const GeoDistrict = RefWard.app.models.GeoDistrict;

    // Insert them all
    const countryModels = displayedCountryData.map(ctr => new GeoCountry(ctr));
    const provinceModels = displayedProvinceData.map(prov => new GeoProvince(prov));
    const districtModels = displayedDistrictData.map(distr => new GeoDistrict(distr));
    const wardModels = displayedWardData.map(ward => new GeoWard(ward));

    try {
      await eachLimit(countryModels, 10, async country => {
        GeoCountry.findOrCreate({ where: { code: country.code } }, country);
      });
      await eachLimit(provinceModels, 10, async province => {
        GeoProvince.findOrCreate({ where: { code: province.code } }, province);
      });
      await eachLimit(districtModels, 10, async district => {
        GeoDistrict.findOrCreate({ where: { code: district.code } }, district);
      });
      await eachLimit(wardModels, 10, async ward => {
        GeoWard.findOrCreate({ where: { code: ward.code } }, ward);
      });
      return { err: null };
    } catch (err) {
      return { err };
    }
  };

  GeoWard.remoteMethod('importGeo', {
    accepts: { arg: 'filterValues', type: 'object' },
    http: { verb: 'POST' },
    returns: { arg: 'result', type: 'object', source: true },
  });
};
