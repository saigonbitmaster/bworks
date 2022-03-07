'use strict';
const moment = require('moment-timezone');
const aggregate = require('../../utils/aggregate');
const ObjectID = require('mongodb').ObjectID;
const { get, set } = require('lodash');
const createError = require('http-errors');

module.exports = Client => {
  Client.getClientApp = async (filter, res = null, options) => {
    let termData = [];
    const filterQuery = filter.where ? { ...filter.where, ...filter } : filter;
    // check search
    if (get(filterQuery, '$text.$search', '') === '""') {
      delete filterQuery.$text;
    }
    if (options.accessToken) {
      let user = await options.accessToken.user.get();
      const { wardInChargeIds: tempWICIArray = [], quarterInChargeIds: tempQICIArray = [] } = user;
      const wardInChargeIds = tempWICIArray.map(wardId => new ObjectID(wardId));
      const quarterInChargeIds = tempQICIArray.map(quarterId => new ObjectID(quarterId));
      if (wardInChargeIds && wardInChargeIds.length) {
        let query = await buildQuery(filterQuery, wardInChargeIds);
        if (quarterInChargeIds && quarterInChargeIds.length > 0) {
          query = await buildQuery(filterQuery, wardInChargeIds, quarterInChargeIds);
        }
        termData = await aggregate(Client, query);
      } else if ((options.authorizedRoles && options.authorizedRoles.master) || options.authorizedRoles.admin) {
        const query = await buildQuery(filterQuery);
        termData = await aggregate(Client, query);
      }
    }
    const { type } = filterQuery;
    switch (type) {
      case 'list': {
        const { data = [], info = [] } = termData[0] || {};
        res.header('Content-Range', data.length ? get(info, '[0].total', 0) : data.length);
        return data;
      }
      case 'map':
      case 'qrscan': {
        return termData;
      }
    }
  };

  Client.remoteMethod('getClientApp', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });

  const buildQuery = async (filter, wardInChargeIds, quarterInChargeIds) => {
    const { termMonth, position, districtId, wardId, quarterId, $text, skip, limit, type } = filter;
    const selectedMonth = moment(termMonth).startOf('month');
    // <----------------Khai báo object filter xài chung--------------->
    const filterQuery = {
      startMeterDate: { $lt: selectedMonth.toDate() },
      status: 'ACTIVE',
    };
    if (wardInChargeIds) {
      set(filterQuery, 'wardId', { $in: wardInChargeIds });
    }
    if (quarterInChargeIds) {
      set(filterQuery, 'quarterId', { $in: quarterInChargeIds });
    }
    if ($text) set(filterQuery, '$text', { $search: $text.$search || $text.search, $language: 'fr' });
    if (districtId && typeof districtId === 'string') set(filterQuery, 'districtId', new ObjectID(districtId));
    if (wardId && typeof wardId === 'string') set(filterQuery, 'wardId', new ObjectID(wardId));
    if (quarterId && typeof quarterId === 'string') set(filterQuery, 'quarterId', new ObjectID(quarterId));
    //<------------------Khai báo mongodb aggregate xài chung--------------------------->
    const lookupMeter = [
      {
        $lookup: {
          from: 'ClientMeter',
          let: {
            clientId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$clientId', '$$clientId'],
                    },
                  ],
                },
              },
            },
            {
              $limit: 1,
            },
            {
              $project: {
                qrCode: 1,
                serial: 1,
              },
            },
          ],
          as: 'clientMeter',
        },
      },
      {
        $unwind: { path: '$clientMeter', preserveNullAndEmptyArrays: true },
      },
    ];

    let query = [];
    switch (type) {
      case 'list': {
        query = [
          {
            $match: filterQuery,
          },
          ...lookupMeter,
          {
            $facet: {
              info: [{ $count: 'total' }],
              data: [
                { $skip: skip },
                { $limit: limit },
                {
                  $project: {
                    id: '$_id',
                    code: 1,
                    name: 1,
                    formattedAddress: 1,
                    qrCode: '$clientMeter.qrCode',
                    serial: '$clientMeter.serial',
                  },
                },
              ],
            },
          },
        ];
        break;
      }
      case 'map': {
        const { coordinates, maxDistance } = position;
        const { $text, ...geoQuery } = filterQuery; // $text doesn't working with $geoNear
        query = [
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates,
              },
              includeLocs: 'position',
              distanceField: 'distanceToCurrentPosition',
              maxDistance,
              query: geoQuery,
              limit: limit || 1000,
            },
          },
          {
            $project: {
              id: '$_id',
              position: 1,
              distanceToCurrentPosition: 1,
              name: 1,
              address: 1,
              formattedAddress: 1,
              debt: 1,
              termMeterNumber: 1,
              lastMeterNumber: 1,
              code: 1,
            },
          },
        ];
        break;
      }
      case 'qrscan': {
        const { qrCode } = filter;
        let meter = await Client.app.models.ClientMeter.findOne({ where: { qrCode } });
        if (!meter) throw createError(400, 'error.UNRECOGNIZED_QRCODE');
        const { clientId } = meter;
        const { $text, ...qrQuery } = filterQuery; // ignore text search when scanning QR
        query = [
          {
            $match: {
              ...qrQuery,
              _id: new ObjectID(clientId),
            },
          },
          ...lookupMeter,
          {
            $project: {
              id: '$_id',
            },
          },
        ];
        break;
      }
    }
    // console.log(JSON.stringify(query));
    return query;
  };
};
