'use strict';
const set = require('lodash/set');
const ObjectID = require('mongodb').ObjectID;
const aggregate = require('../../utils/aggregate');

module.exports = function(Client) {
  Client.countClientStatusByGeo = async function(provinceId, districtId, wardId) {
    // console.log('countClientStatusByGeo', provinceId, districtId, wardId);
    let res = await aggregate(Client, queryNew(provinceId, districtId, wardId));
    return res;
  };

  // count tat ca client co status: ['ACTIVE', 'STOP', 'PAUSE']
  Client.remoteMethod('countClientStatusByGeo', {
    accepts: [
      { arg: 'provinceId', type: 'string' },
      { arg: 'districtId', type: 'string' },
      { arg: 'wardId', type: 'string' },
    ],
    http: { verb: 'get' },
    returns: { root: true, type: Array },
  });

  const queryNew = (provinceId, districtId, wardId) => {
    let rawQuery = [
      { $match: null }, //replace
      {
        $group: {
          _id: { status: '$status' },
          countClient: { $sum: 1 },
        },
      },
    ];

    let q = {};
    q.status = { $in: ['ACTIVE', 'STOP', 'PAUSE'] };
    if (provinceId) {
      q.provinceId = new ObjectID(provinceId);
    }
    if (districtId) {
      q.districtId = new ObjectID(districtId);
    }
    if (wardId) {
      q.wardId = new ObjectID(wardId);
    }
    let query = set(rawQuery, '[0].$match', q);
    return query;
  };
};
