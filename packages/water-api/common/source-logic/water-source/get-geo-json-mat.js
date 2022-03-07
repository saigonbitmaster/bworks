'use strict';
// const aggregate = require('../../utils/aggregate');
const get = require('lodash/get');
module.exports = function(WaterSource) {
  WaterSource.getGeoJsonMat = async filter => {
    let { type } = filter;
    if (!type) {
      return {};
    }
    let model = '';
    switch (type) {
      case 'Pipe': {
        model = 'Pipe';
        break;
      }
      case 'Factory': {
        model = 'Factory';
        break;
      }
      case 'WaterSource': {
        model = 'WaterSource';
        break;
      }
      case 'Pump': {
        model = 'Pump';
        break;
      }
      case 'Sensor': {
        model = 'Sensor';
        break;
      }
      case 'DataLogger': {
        model = 'DataLogger';
        break;
      }
      case 'Meter': {
        model = 'Meter';
        break;
      }
      default:
        return {};
    }
    let data = {
      type: 'FeatureCollection',
      features: [],
    };
    let items = await WaterSource.app.models[model].find({
      fields: { id: true, name: true, polyline: true, position: true, location: true },
    });
    if (!items || !items.length) {
      return {};
    }
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (type === 'Pipe') {
        let polyline = item.polyline;
        let points = [];
        for (let k = 0; k < polyline.length; k++) {
          let poly = polyline[k];
          if (!poly) continue;
          points.push([poly.lng, poly.lat]);
        }
        if (!points.length) continue;
        let tmp = {
          type: 'Feature',
          properties: {
            type,
            health: 'normal',
          },
          geometry: {
            type: 'LineString',
            coordinates: points,
          },
        };
        data.features.push(tmp);
      } else {
        let lng;
        let lat;
        let position = get(item, 'position', '');
        if (!position) {
          position = get(item, 'location', '');
        }
        lng = get(position, 'lng', '');
        lat = get(position, 'lat', '');
        if (!lng || !lat) {
          let coordinates = get(position, 'coordinates');
          if (Array.isArray(coordinates) && coordinates.length === 2) {
            lng = coordinates[0];
            lat = coordinates[1];
          }
        }
        if (!lng || !lat) {
          continue;
        }
        let tmp = {
          type: 'Feature',
          properties: {
            type,
          },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        };
        data.features.push(tmp);
      }
    }
    return data;
  };
  WaterSource.remoteMethod('getGeoJsonMat', {
    accepts: [{ arg: 'filter', type: 'object' }],
    returns: { root: true, type: ['object'] },
    http: { verb: 'get' },
  });
};
