'use strict';
const moment = require('moment-timezone');
const capitalize = require('lodash/capitalize');
const lowerCase = require('lodash/lowerCase');
const aggregate = require('../../utils/aggregate');
const toObjectId = require('../../utils/to-object-id');

module.exports = ClientMeterNumber => {
  const createTreemapQuery = (motherGeo, childGeo) => {
    const lowercasedMotherGeo = lowerCase(motherGeo);
    const capitalizedMotherGeo = capitalize(motherGeo);
    const lowercasedChildGeo = lowerCase(childGeo);
    const capitalizedChildGeo = capitalize(childGeo);

    return [
      {
        $project: {
          _id: 0,
          [`${lowercasedMotherGeo}Id`]: `$client.${lowercasedMotherGeo}Id`,
          [`${lowercasedChildGeo}Id`]: `$client.${lowercasedChildGeo}Id`,
          fee: '$fee',
        },
      },
      {
        $group: {
          _id: { [lowercasedMotherGeo]: `$${lowercasedMotherGeo}Id`, [lowercasedChildGeo]: `$${lowercasedChildGeo}Id` },
          size: { $sum: '$fee' },
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

  ClientMeterNumber.getIncomeGroupedByGeo = async (provinceId, districtId, wardId, month) => {
    // Create filter stages
    let geoFilterStage = null;
    let query = [];
    let motherGeo = 'province';
    let childGeo = 'district';

    // Filter meter numbers
    const current = moment(month)
      .startOf('month')
      .toDate();
    query = query.concat([
      {
        $match: {
          'invoiceData.totalFee': { $exists: true },
          $expr: {
            $and: [{ $gte: [current, '$fromDate'] }, { $lt: [current, '$toDate'] }],
          },
        },
      },
      {
        $project: {
          _id: 0,
          clientId: '$clientId',
          fee: '$invoiceData.totalFee',
        },
      },
      {
        $lookup: {
          from: 'Client',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client',
        },
      },
      { $unwind: '$client' },
    ]);

    if (provinceId) {
      geoFilterStage = { $match: { 'client.provinceId': toObjectId(provinceId) } };
      motherGeo = 'district';
      childGeo = 'ward';
    }
    if (districtId) {
      geoFilterStage = { $match: { 'client.districtId': toObjectId(districtId) } };
      motherGeo = 'ward';
      childGeo = 'quarter';
    }
    if (wardId) {
      geoFilterStage = { $match: { 'client.wardId': toObjectId(wardId) } };
      motherGeo = 'ward';
      childGeo = 'quarter';
    }

    const treemapQuery = createTreemapQuery(motherGeo, childGeo);
    if (geoFilterStage) {
      query = query.concat(geoFilterStage, treemapQuery);
    } else {
      query = query.concat(treemapQuery);
    }

    const incomeGroupedByGeo = await aggregate(ClientMeterNumber, query);
    return incomeGroupedByGeo;
  };

  ClientMeterNumber.remoteMethod('getIncomeGroupedByGeo', {
    accepts: [
      { arg: 'provinceId', type: 'string' },
      { arg: 'districtId', type: 'string' },
      { arg: 'wardId', type: 'string' },
      { arg: 'month', type: 'date' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
