'use strict';
const crypto = require('crypto');
const path = require('path');
const util = require('util');
const excel = require('xlsx');
const delay = require('delay');
const mapSeries = util.promisify(require('async/mapSeries'));
const mapLimit = util.promisify(require('async/mapLimit'));
const lodash = require('lodash');
const getGeoLocation = require('../../common/logic/geo/import-geolocation');

const LIMIT_PARALLEL = 30;

const getGeo = (sheetJSON, countryId) => {
  const bsons = new Array();
  for (let json of sheetJSON) {
    if (json.hasOwnProperty('Tỉnh Thành Phố') && json['Tỉnh Thành Phố']) {
      const geo = { province: { code: json['Mã TP'], countryId } };
      const province = geo['province'];
      const provinceWords = json['Tỉnh Thành Phố'].split(' ');
      if (provinceWords[0] === 'Tỉnh') {
        province['prefix'] = 'Tỉnh';
        province['name'] = provinceWords.slice(1).join(' ');
      } else if (provinceWords[0] === 'Thành' && provinceWords[1].toLowerCase() === 'phố') {
        province['prefix'] = 'Thành phố';
        province['name'] = provinceWords.slice(2).join(' ');
      }
      province['fullName'] = province['prefix'].concat(' ').concat(province['name']);
      if (json.hasOwnProperty('Quận Huyện') && json['Quận Huyện']) {
        geo['district'] = { code: json['Mã QH'] };
        const district = geo['district'];
        const districtWords = json['Quận Huyện'].split(' ');
        if (districtWords[0] === 'Quận' || districtWords[0] === 'Huyện') {
          if (districtWords[0] === 'Huyện') {
            district['prefix'] = 'Huyện';
          } else {
            district['prefix'] = 'Quận';
          }
          district['name'] = districtWords.slice(1).join(' ');
        } else if (
          (districtWords[0] === 'Thị' && districtWords[1].toLowerCase() === 'xã') ||
          (districtWords[0] === 'Thành' && districtWords[1].toLowerCase() === 'phố')
        ) {
          if (districtWords[0] === 'Thị') {
            district['prefix'] = 'Thị xã';
          } else {
            district['prefix'] = 'Thành phố';
          }
          district['name'] = districtWords.slice(2).join(' ');
        }
        district['fullName'] = district['prefix'].concat(' ').concat(district['name']);
      }
      if (json.hasOwnProperty('Phường Xã') && json['Phường Xã']) {
        geo['ward'] = { code: json['Mã PX'] };
        const ward = geo['ward'];
        const wardWords = json['Phường Xã'].split(' ');
        const wardPrefix = json['Cấp'];
        if (wardWords[0] === 'Phường' || wardWords[0] === wardPrefix) {
          if (wardWords[0] === 'Phường' && wardWords[0] === wardPrefix) {
            ward['prefix'] = 'Phường';
          } else if (wardWords[0] === 'Xã' && wardWords[0] === wardPrefix) {
            ward['prefix'] = 'Xã';
          }
          ward['name'] = wardWords.slice(1).join(' ');
        } else if (
          wardWords[0] === 'Thị' &&
          wardWords[1].toLowerCase() === 'trấn' &&
          wardWords[0].concat(' ').concat(wardWords[1].toLowerCase()) === wardPrefix
        ) {
          ward['prefix'] = 'Thị trấn';
          ward['name'] = wardWords.slice(2).join(' ');
        }
        ward['fullName'] = ward['prefix'].concat(' ').concat(ward['name']);
      }
      bsons.push(geo);
    }
  }
  return bsons;
};

// Get unique cities/provinces
const getUniqueGeo = (geoJSON, geoLocation, compareKey, foreignKeys) => {
  const uniqueProvinces = new Map();
  for (let json of geoJSON) {
    const provinceHash = crypto
      .createHash('md5')
      .update(json[geoLocation][compareKey])
      .digest('hex')
      .toString();
    if (!uniqueProvinces.has(provinceHash)) {
      if (foreignKeys) {
        uniqueProvinces.set(provinceHash, {
          ...foreignKeys.map(key => ({ [key]: json[key][compareKey] })).reduce((acc, val) => ({ ...acc, ...val }), {}),
          ...json[geoLocation],
        });
      } else {
        uniqueProvinces.set(provinceHash, { ...json[geoLocation] });
      }
    }
  }
  return Array.from(uniqueProvinces.values());
};

module.exports = async app => {
  if (!process.env.NODE_IMPORT_REF_GEO) {
    return;
  }

  // Destroy old reference geodata
  const RefCountry = app.models.RefCountry;
  const RefProvince = app.models.RefProvince;
  const RefDistrict = app.models.RefDistrict;
  const RefWard = app.models.RefWard;

  const GeoCountry = app.models.GeoCountry;
  const GeoProvince = app.models.GeoProvince;
  const GeoDistrict = app.models.GeoDistrict;
  const GeoWard = app.models.GeoWard;

  await RefCountry.destroyAll({});
  await RefProvince.destroyAll({});
  await RefDistrict.destroyAll({});
  await RefWard.destroyAll({});

  const existingCountry = await GeoCountry.find({}).then(countries =>
    countries.reduce((acc, country) => {
      const countryId = country.id.toString();
      const countryCode = country.code;
      return { ...acc, [countryCode]: { code: countryCode, id: countryId } };
    }, {}),
  );
  const existingProvince = await GeoProvince.find({}).then(provinces =>
    provinces.reduce((acc, province) => {
      const provinceId = province.id.toString();
      const provinceCode = province.code;
      return { ...acc, [provinceCode]: { code: provinceCode, id: provinceId } };
    }, {}),
  );
  const existingDistrict = await GeoDistrict.find({}).then(districts =>
    districts.reduce((acc, district) => {
      const districtId = district.id.toString();
      const districtCode = district.code;
      return { ...acc, [districtCode]: { code: districtCode, id: districtId } };
    }, {}),
  );
  const existingWard = await GeoWard.find({}).then(wards =>
    wards.reduce((acc, ward) => {
      const wardId = ward.id.toString();
      const wardCode = ward.code;
      return { ...acc, [wardCode]: { code: wardCode, id: wardId } };
    }, {}),
  );

  // COUNTRY
  const countryTemplate = {
    name: 'Việt Nam',
    prefix: 'Cộng hoà Xã hội Chủ nghĩa',
    fullName: 'Cộng hoà Xã hội Chủ nghĩa Việt Nam',
    code: 'VN',
  };
  // Get country geolocation
  const countryGeoLocation = await getGeoLocation(countryTemplate.name, RefCountry, 0);
  countryTemplate['position'] = countryGeoLocation;

  // Insert country
  let countryInstance = new RefCountry({ ...countryTemplate });
  if (existingCountry[countryTemplate.code]) {
    countryInstance.id = existingCountry[countryTemplate.code].id;
  }

  if (countryInstance.isValid()) {
    await countryInstance.save();
  }

  const countryId = countryInstance.id.toString();
  const countryName = countryInstance.name;

  // Load the geo Excel
  const workbook = excel.readFile(path.join(__dirname, 'geo.xls'));

  // Get first sheet
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // Get the array of rows
  const sheetJSON = excel.utils.sheet_to_json(worksheet);

  // Organize achieved data into JSONs
  const geoJSON = getGeo(sheetJSON, countryId);

  // PROVINCE
  // Extract the 'Province' section
  const provinces = getUniqueGeo(geoJSON, 'province', 'fullName');

  // Insert geolocations for each province object
  const provincesWithGeoLocation = [];
  await mapLimit(provinces, LIMIT_PARALLEL, async prov => {
    const provinceFullName = [prov.fullName, countryName].join(', ');
    const provinceGeoLocation = await getGeoLocation(provinceFullName, RefProvince, 0);
    if (provinceGeoLocation) {
      prov['position'] = provinceGeoLocation;
    }
    return provincesWithGeoLocation.push(prov);
  });

  // Map them to 'GeoProvince' model and attemp to validate them
  const provinceModels = provincesWithGeoLocation.map(province => {
    if (lodash.has(existingProvince, province.code)) {
      lodash.set(province, 'id', lodash.get(existingProvince, `${province.code}.id`));
    }
    return new RefProvince(province);
  });
  if (provinceModels.every(pm => pm.isValid())) {
    await RefProvince.create(provinceModels);
    console.log('Finished importing reference provinces'); // eslint-disable-line no-console
  }

  // DISTRICT
  const districts = getUniqueGeo(geoJSON, 'district', 'fullName', ['province']);

  // Get IDs from newly-inserted models of GeoProvince
  const provinceIDs = await RefProvince.find({ fields: { fullName: 1, id: 1 } });
  const reducedProvinceIDs = new Map(
    Object.entries(
      provinceIDs.reduce(
        (acc, val) => ({
          ...acc,
          [val['fullName']]: val['id'].toString(),
        }),
        Object.create(null),
      ),
    ),
  );

  const districtsWithID = districts.map(district => {
    if (reducedProvinceIDs.has(district['province'])) {
      district['provinceId'] = reducedProvinceIDs.get(district['province']);
    }
    return district;
  });

  const specDistricts = districtsWithID.map(dwi => ({ ...dwi, countryId }));

  await delay(1000);

  const specChunkedDistrictWithGeoLocation = await mapSeries(lodash.chunk(specDistricts, 50), async districtChunk => {
    const districtChunkWithGeoLocation = [];
    await mapLimit(districtChunk, LIMIT_PARALLEL, async distr => {
      const districtFullName = [distr.fullName, distr.province, countryName].join(', ');
      delete distr['province'];
      const districtGeoLocation = await getGeoLocation(districtFullName, RefDistrict, 0);
      if (districtGeoLocation) {
        distr['position'] = districtGeoLocation;
      }
      return districtChunkWithGeoLocation.push(distr);
    });
    await delay(1000);
    return districtChunkWithGeoLocation;
  });

  const specDistrictsWithGeoLocation = lodash.flatten(specChunkedDistrictWithGeoLocation);

  // Map them to 'GeoDistrict' model and attemp to validate them
  const districtModels = specDistrictsWithGeoLocation.map(district => {
    if (lodash.has(existingDistrict, district.code)) {
      lodash.set(district, 'id', lodash.get(existingDistrict, `${district.code}.id`));
    }
    return new RefDistrict(district);
  });

  if (districtModels.every(dm => dm.isValid())) {
    await RefDistrict.create(districtModels);
    console.log('Finished importing reference districts'); // eslint-disable-line no-console
  }

  // WARD
  const wards = getUniqueGeo(geoJSON, 'ward', 'fullName', ['district', 'province']);

  const districtIDs = await RefDistrict.find({ fields: { fullName: 1, id: 1 } });
  const reducedDistrictIDs = new Map(
    Object.entries(
      districtIDs.reduce(
        (acc, val) => ({
          ...acc,
          [val['fullName']]: val['id'].toString(),
        }),
        Object.create(null),
      ),
    ),
  );

  const wardsWithIDs = wards.map(ward => {
    if (reducedProvinceIDs.has(ward['province'])) {
      ward['provinceId'] = reducedProvinceIDs.get(ward['province']);
    }
    if (reducedDistrictIDs.has(ward['district'])) {
      ward['districtId'] = reducedDistrictIDs.get(ward['district']);
    }
    return ward;
  });

  const specWards = wardsWithIDs.map(dwi => ({ ...dwi, countryId }));

  await delay(1000);

  const specChunkedWardWithGeoLocation = await mapSeries(lodash.chunk(specWards, 50), async wardChunk => {
    const wardChunkWithGeoLocation = [];
    await mapLimit(wardChunk, LIMIT_PARALLEL, async ward => {
      const wardFullName = [ward.fullName, ward.district, ward.province, countryName].join(', ');
      delete ward['province'];
      delete ward['district'];
      let wardGeoLocation = null;
      try {
        wardGeoLocation = await getGeoLocation(wardFullName, RefDistrict, 0);
      } catch (err) {
        throw err;
      }
      if (wardGeoLocation) {
        ward['position'] = wardGeoLocation;
      }
      return wardChunkWithGeoLocation.push(ward);
    });
    await delay(1000);
    return wardChunkWithGeoLocation;
  });

  const specWardsWithGeoLocation = lodash.flatten(specChunkedWardWithGeoLocation);

  // Map them to 'GeoDistrict' model and attemp to validate them
  const wardModels = specWardsWithGeoLocation.map(ward => {
    if (lodash.has(existingWard, ward.code)) {
      lodash.set(ward, 'id', lodash.get(existingWard, `${ward.code}.id`));
    }
    return new RefWard(ward);
  });
  if (wardModels.every(wm => wm.isValid())) {
    await RefWard.create(wardModels);
    console.log('Finished importing reference wards'); // eslint-disable-line no-console
  }
};
