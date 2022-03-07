'use strict';
const NodeGeoCoder = require('node-geocoder');
const RandomLocation = require('random-location');
const delay = require('delay');
const app = require('../../../server/server');

const geoCacheProcess = {};

const getGeoLocation = async (address, model, radius) => {
  const GOOGLE_API_KEY = model.app.get('googleApiKey');
  const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: GOOGLE_API_KEY,
    formatter: null,
  };

  const geoCoder = NodeGeoCoder(options);
  const fixAddress = address.toLowerCase();

  // Cache data position for performance
  let i = 0;
  while (i < 5) {
    if (geoCacheProcess[fixAddress]) {
      await delay(1000);
    }
    i++;
  }
  geoCacheProcess[fixAddress] = true;

  let cacheRecod = await app.models.CacheLocation.findById(fixAddress);
  if (!cacheRecod) {
    console.log('Location new!', address); // eslint-disable-line no-console
    let geoLocation = await geoCoder.geocode(address);
    if (geoLocation.length > 0 && geoLocation[0].latitude) {
      cacheRecod = await app.models.CacheLocation.create({
        id: fixAddress,
        location: {
          lat: geoLocation[0].latitude,
          lng: geoLocation[0].longitude,
        },
      });
    } else {
      // not found
      // cacheRecod = await app.models.CacheLocation.create({
      //   id: fixAddress,
      //   location: null,
      // });
    }
  } else {
    // console.log('Location from cache', address); // eslint-disable-line no-console
  }
  delete geoCacheProcess[fixAddress];
  if (cacheRecod && cacheRecod.location) {
    const randomPointWithinRadius = RandomLocation.randomCirclePoint(
      { latitude: cacheRecod.location.lat, longitude: cacheRecod.location.lng },
      radius,
    );
    const randomGeoLocation = {
      lat: randomPointWithinRadius.latitude,
      lng: randomPointWithinRadius.longitude,
    };

    return randomGeoLocation;
  }
  return null;
};

module.exports = getGeoLocation;
