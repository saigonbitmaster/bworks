const getGeoLocation = require('../../common/logic/geo/import-geolocation');

module.exports = async app => {
  if (process.env.NODE_MOD) {
    const allWards = await app.models.GeoWard.find();
    const allQuarters = await app.models.GeoQuarter.find();
    // Add countryId to all Wards and Quarters
    const countryId = await app.models.GeoCountry.findOne().then(country => country.id);
    // Get full address of all Wards and Quarters
    // Ask Google Map API to get their geopoints
    // Cache with id as signature
    for (let ward of allWards) {
      if (!ward.countryId) {
        ward.countryId = countryId;
      }
      if (!ward.position) {
        const cache = await app.models.CacheLocation.findById(ward.id);
        if (!cache) {
          const countryName = await new Promise((resolve, reject) =>
            ward.geoCountry((err, country) => (err ? reject(err) : resolve(country.name))),
          );
          const province = await new Promise((resolve, reject) =>
            ward.geoProvince((err, province) => (err ? reject(err) : resolve(province.fullName))),
          );
          const district = await new Promise((resolve, reject) =>
            ward.geoDistrict((err, district) => (err ? reject(err) : resolve(district.fullName))),
          );
          const position = await getGeoLocation([district, province, countryName].join(','), app.models.Client, 0);
          await app.models.CacheLocation.findOrCreate({ where: { id: ward.id } }, { id: ward.id, position });
          ward.position = position;
        } else {
          ward.position = cache.postion;
        }
      }
      await ward.save();
    }
    for (let quarter of allQuarters) {
      if (!quarter.countryId) {
        quarter.countryId = countryId;
      }
      if (!quarter.position) {
        const cache = await app.models.CacheLocation.findById(quarter.id);
        if (!cache) {
          const countryName = await new Promise((resolve, reject) =>
            quarter.geoCountry((err, country) => (err ? reject(err) : resolve(country.name))),
          );
          const province = await new Promise((resolve, reject) =>
            quarter.geoProvince((err, province) => (err ? reject(err) : resolve(province.fullName))),
          );
          const district = await new Promise((resolve, reject) =>
            quarter.geoDistrict((err, district) => (err ? reject(err) : resolve(district.fullName))),
          );
          const ward = await new Promise((resolve, reject) =>
            quarter.geoWard((err, ward) => (err ? reject(err) : resolve(ward.fullName))),
          );
          const position = await getGeoLocation(
            [ward, district, province, countryName].join(','),
            app.models.Client,
            0,
          );
          await app.models.CacheLocation.findOrCreate({ where: { id: quarter.id } }, { id: quarter.id, position });
          quarter.position = position;
        } else {
          quarter.position = cache.position;
        }
        await quarter.save();
      }
    }
  }
  // eslint-disable-next-line no-console
  // console.log('Finish updating location data for Wards and Quarters');
};
