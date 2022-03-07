'use strict';
// const aggregate = require('../../utils/aggregate');

module.exports = function(Materialuse) {
  Materialuse.getGeoJsonMat = async filter => {
    let { type } = filter;
    if (!type) {
      return {};
    }
    let data = {
      type: 'FeatureCollection',
      features: [],
    };
    let materials = await Materialuse.find({
      where: { type },
      fields: { node: true, id: true, name: true, optionKey: true, polyline: true, health: true },
    });
    if (!materials || !materials.length) {
      return {};
    }
    for (let i = 0; i < materials.length; i++) {
      if (type === 'Pipe') {
        let polyline = materials[i].polyline;
        let points = [];
        for (let k = 0; k < polyline.length; k++) {
          let item = polyline[k];
          if (!item) continue;
          points.push([item.lng, item.lat]);
        }
        if (!points.length) continue;
        let tmp = {
          type: 'Feature',
          properties: {
            type,
            health: materials[i].health,
          },
          geometry: {
            type: 'LineString',
            coordinates: points,
          },
        };
        data.features.push(tmp);
      } else {
        let node = materials[i].node;
        if (!node) {
          continue;
        }
        let tmp = {
          type: 'Feature',
          properties: {
            type,
          },
          geometry: {
            type: 'Point',
            coordinates: [node.lng, node.lat],
          },
        };
        data.features.push(tmp);
      }
    }
    return data;
  };
  Materialuse.remoteMethod('getGeoJsonMat', {
    accepts: [{ arg: 'filter', type: 'object' }],
    returns: { root: true, type: ['object'] },
    http: { verb: 'get' },
  });
};
