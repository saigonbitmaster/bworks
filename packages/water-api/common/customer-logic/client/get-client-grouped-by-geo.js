'use strict';
const capitalize = require('lodash/capitalize');
const lowerCase = require('lodash/lowerCase');
const aggregate = require('../../utils/aggregate');
const toObjectId = require('../../utils/to-object-id');

module.exports = Client => {
  const createTreemapQuery = (motherGeo, childGeo) => {
    const lowercasedMotherGeo = lowerCase(motherGeo);
    const capitalizedMotherGeo = capitalize(motherGeo);
    const lowercasedChildGeo = lowerCase(childGeo);
    const capitalizedChildGeo = capitalize(childGeo);

    return [
      {
        $group: {
          _id: { [lowercasedMotherGeo]: `$${lowercasedMotherGeo}Id`, [lowercasedChildGeo]: `$${lowercasedChildGeo}Id` },
          size: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: `Geo${capitalizedMotherGeo}`,
          let: { geoId: `$_id.${lowercasedMotherGeo}` },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$_id', '$$geoId'] }] } } },
            { $project: { _id: 0, fullName: '$fullName' } },
          ],
          as: lowercasedMotherGeo,
        },
      },
      { $unwind: `$${lowercasedMotherGeo}` },
      {
        $lookup: {
          from: `Geo${capitalizedChildGeo}`,
          let: { geoId: `$_id.${lowercasedChildGeo}` },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$_id', '$$geoId'] }] } } },
            { $project: { _id: 0, fullName: '$fullName' } },
          ],
          as: lowercasedChildGeo,
        },
      },
      { $unwind: `$${lowercasedChildGeo}` },
      {
        $group: {
          _id: `$${lowercasedMotherGeo}.fullName`,
          children: { $push: { name: `$${lowercasedChildGeo}.fullName`, size: '$size' } },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          children: '$children',
        },
      },
    ];
  };

  Client.getClientGroupedByGeo = async (provinceId, districtId, wardId) => {
    // Create filter stages
    let query = [];
    let motherGeo = 'province';
    let childGeo = 'district';

    if (provinceId) {
      query.push({ $match: { provinceId: toObjectId(provinceId) } });
      motherGeo = 'district';
      childGeo = 'ward';
    }
    if (districtId) {
      query.push({ $match: { districtId: toObjectId(districtId) } });
      motherGeo = 'ward';
      childGeo = 'quarter';
    }
    if (wardId) {
      query.push({ $match: { wardId: toObjectId(wardId) } });
      motherGeo = 'ward';
      childGeo = 'quarter';
    }

    // Create remaining stages
    const treemapQuery = createTreemapQuery(motherGeo, childGeo);
    query = query.concat(treemapQuery);

    // Use aggregation to get client counts grouped by geo
    const clientCountGroupedByGeo = await aggregate(Client, query);
    return clientCountGroupedByGeo;
  };

  Client.remoteMethod('getClientGroupedByGeo', {
    accepts: [
      { arg: 'provinceId', type: 'string' },
      { arg: 'districtId', type: 'string' },
      { arg: 'wardId', type: 'string' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
