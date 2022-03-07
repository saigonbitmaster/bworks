'use strict';
const NodeGeoCoder = require('node-geocoder');
const httpError = require('http-errors');

const getGeoLocation = async (formattedAddress, model) => {
  const geocoder = NodeGeoCoder({
    provider: 'google',
    httpAdapter: 'https',
    apiKey: model.app.get('googleApiKey'),
    formatter: null,
  });

  const result = await geocoder.geocode(formattedAddress);

  if (result.length > 0 && result[0].latitude && result[0].longitude) {
    return { lat: result[0].latitude, lng: result[0].longitude };
  }

  return {};
};

const EARTH_RADIUS = 6371;
const degreeToRadian = degree => Math.tan(degree * (Math.PI / 180));
const isWithinRadius = (point, interest, radius) => {
  const dLat = degreeToRadian(interest.lat - point.lat);
  const dLong = degreeToRadian(interest.lng - point.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreeToRadian(point.lat)) *
      Math.cos(degreeToRadian(interest.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.asin(Math.sqrt(a));
  const d = EARTH_RADIUS * c;

  return d <= radius;
};

module.exports = async Client => {
  Client.validateWithinRadius = async (position, formattedAdress, wardId, quarterId) => {
    const formattedPosition = {
      lat: parseFloat(position.lat),
      lng: parseFloat(position.lng),
    };

    if (!formattedPosition) {
      throw httpError(400, 'error.UNRECOGNIZED_GEO_DATA');
    }

    let clientGeoData = null;
    if (!quarterId) {
      clientGeoData = await Client.app.models.GeoWard.findById(wardId);
    } else if (quarterId) {
      clientGeoData = await Client.app.models.GeoQuarter.findById(quarterId);
    } else {
      clientGeoData = await getGeoLocation(formattedAdress, Client);
    }

    const clientPosition =
      clientGeoData && clientGeoData.type === 'Point'
        ? { lat: clientGeoData.coordinates[1], lng: clientGeoData.coordinates[0] }
        : clientGeoData.position;
    const clientRadius = clientGeoData.radius || 600;

    // Compute distances between 2 point
    const result = isWithinRadius(clientPosition, formattedPosition, clientRadius);

    if (!result) {
      throw httpError(400, 'error.NOT_WITHIN_RADIUS');
    }
  };

  Client.remoteMethod('validateWithinRadius', {
    accepts: [
      { arg: 'position', type: 'object' },
      { arg: 'formattedAddress', type: 'string' },
      { arg: 'wardId', type: 'string' },
      { arg: 'quarterId', type: 'string' },
    ],
    http: { verb: 'get' },
  });
};
