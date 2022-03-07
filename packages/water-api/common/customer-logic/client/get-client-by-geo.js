'use strict';
const set = require('lodash/set');
const ObjectID = require('mongodb').ObjectID;
const aggregate = require('../../utils/aggregate');

module.exports = function(Client) {
  Client.getClientByGeo = async function(provinceId, districtId, wardId, centerPoint, maxDistance) {
    // console.log('getClientByGeo', provinceId, districtId, wardId, JSON.parse(centerPoint));
    let pt;
    if (centerPoint) {
      pt = JSON.parse(centerPoint);
    }
    let res = await aggregate(Client, queryNew(provinceId, districtId, wardId, pt, maxDistance));
    return res;
  };

  // get client hien thi tren map
  Client.remoteMethod('getClientByGeo', {
    accepts: [
      { arg: 'provinceId', type: 'string' },
      { arg: 'districtId', type: 'string' },
      { arg: 'wardId', type: 'string' },
      { arg: 'centerPoint', type: 'string' },
      { arg: 'maxDistance', type: 'number' },
    ],
    http: { verb: 'get' },
    returns: { root: true, type: Array },
  });

  // centerPoint: array
  const queryNew = (provinceId, districtId, wardId, centerPoint, maxDistance) => {
    let rawQuery = [
      {
        $geoNear: {
          near: { type: 'Point', coordinates: null }, //replace, array, format: [lng, lat]
          key: 'position',
          distanceField: 'dist.calculated',
          maxDistance: null, // replace
          includeLocs: 'dist.position',
          spherical: true,
          limit: 9999999999,
          query: null, // replace, ex: { provinceId: ObjectId('5bb58a51d1c950171e3c7aa1'), districtId: ObjectId('5bb58a52d1c950171e3c7b92'),  wardId: ObjectId('5bb58a52d1c950171e3c7b92') }
        },
      },
      { $project: { _id: 1, name: 1, formattedAddress: 1, position: 1, status: 1 } },
      // { $limit: 500 },
    ];

    let coordinates = [];
    coordinates.push(centerPoint.lng);
    coordinates.push(centerPoint.lat);

    let q = {};
    if (provinceId) {
      q.provinceId = new ObjectID(provinceId);
    }
    if (districtId) {
      q.districtId = new ObjectID(districtId);
    }
    if (wardId) {
      q.wardId = new ObjectID(wardId);
    }
    let query = set(rawQuery, '[0].$geoNear.near.coordinates', coordinates);
    query = set(query, '[0].$geoNear.maxDistance', maxDistance);
    query = set(query, '[0].$geoNear.query', q);
    return query;
  };
};
