'use strict';
const moment = require('moment-timezone');
const aggregate = require('../../utils/aggregate');
const ObjectID = require('mongodb').ObjectID;
const { get, set } = require('lodash');
const createError = require('http-errors');

module.exports = Client => {
  Client.getClientInvoiceApp = async (filter, res = null, options) => {
    let termData = [];
    const filterQuery = filter.where ? { ...filter.where, ...filter } : filter;
    if (get(filterQuery, '$text.$search', '') === '""') {
      delete filterQuery.$text; // remove empty search
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

  Client.remoteMethod('getClientInvoiceApp', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });

  const buildQuery = async (filter, wardInChargeIds, quarterInChargeIds) => {
    const {
      termMonth,
      paymentStatus,
      position,
      districtId,
      wardId,
      quarterId,
      $text,
      skip,
      limit,
      type,
      needPositon,
    } = filter;
    const selectedMonth = moment(termMonth).startOf('month');
    // <----------------Khai báo object filter xài chung--------------->
    const filterQuery = {
      // wardId: { $in: wardInChargeIds },
      termInvoice: { $gte: selectedMonth.toDate() },
      startMeterDate: { $lt: selectedMonth.toDate() },
    };
    if (wardInChargeIds && wardInChargeIds.length > 0) {
      set(filterQuery, 'wardId', { $in: wardInChargeIds });
    }
    if (quarterInChargeIds) {
      set(filterQuery, 'quarterId', { $in: quarterInChargeIds });
    }
    if ($text) set(filterQuery, '$text', { $search: $text.$search || $text.search, $language: 'fr' });
    if (districtId && typeof districtId === 'string') set(filterQuery, 'districtId', new ObjectID(districtId));
    if (wardId && typeof wardId === 'string') set(filterQuery, 'wardId', new ObjectID(wardId));
    if (quarterId && typeof quarterId === 'string') set(filterQuery, 'quarterId', new ObjectID(quarterId));
    const paymentStatusQuery =
      typeof paymentStatus === 'boolean' ? [{ $eq: ['$paymentStatus', filter.paymentStatus] }] : [];
    //<------------------Khai báo mongodb aggregate xài chung--------------------------->
    const lookupClientMeterNumber = [
      {
        $addFields: {
          monthId: {
            $concat: [{ $convert: { input: '$_id', to: 'string' } }, moment(termMonth).format('-YYYY-MM')],
          },
        },
      },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          let: { monthId: `$monthId` },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$monthId'] }, ...paymentStatusQuery],
                },
              },
            },
            {
              $project: {
                totalWaterUsed: '$invoiceData.totalWaterUsed',
                totalFee: '$invoiceData.totalFee',
                paymentStatus: 1,
                id: '$_id',
              },
            },
          ],
          as: 'clientMeterNumber',
        },
      },
      { $unwind: '$clientMeterNumber' },
    ];
    const lookupEinvoice = [
      {
        $lookup: {
          from: 'EInvoiceData',
          let: { monthId: '$monthId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$monthId'] } } },
            {
              $project: {
                eInvoiceNo: 1,
                canceled: 1,
                replacedEinvoice: {
                  $map: {
                    input: '$replacedEinvoice',
                    as: 'replacedEinvoice',
                    in: '$$replacedEinvoice.eInvoiceNo',
                  },
                },
              },
            },
          ],
          as: 'einvoice',
        },
      },
      { $unwind: { path: '$einvoice' } },
    ];
    let query = [];
    switch (type) {
      case 'list': {
        const listproject = {
          $project: {
            id: '$_id',
            code: 1,
            name: 1,
            formattedAddress: 1,
            status: 1,
            clientMeterNumber: 1,
            einvoice: 1,
          },
        };
        if (needPositon) set(listproject, '$project.position', 1);
        query = [
          {
            $match: filterQuery,
          },
          ...lookupClientMeterNumber,
          ...lookupEinvoice,
          {
            $facet: {
              info: [{ $count: 'total' }],
              data: [{ $skip: skip }, { $limit: limit }, { ...listproject }],
            },
          },
        ];
        break;
      }
      case 'map': {
        const { coordinates, maxDistance } = position;
        const { $text, ...geoQuery } = filterQuery; // $text doesn't work with $geoNear
        query = [
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates,
              },
              includeLocs: 'geometry',
              distanceField: 'distanceToInit',
              maxDistance,
              query: geoQuery,
              limit: limit || 1000,
            },
          },
          ...lookupClientMeterNumber,
          ...lookupEinvoice,
          {
            $project: {
              id: '$_id',
              clientMeterNumber: 1,
              geometry: 1,
              name: 1,
              code: 1,
              distanceToInit: 1,
              formattedAddress: 1,
              einvoice: 1,
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
          ...lookupClientMeterNumber,
          ...lookupEinvoice,
          {
            $project: {
              clientMeterNumber: 1,
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
