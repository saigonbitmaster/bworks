'use strict';
const moment = require('moment-timezone');
const isFunction = require('lodash/isFunction');
const intersectionBy = require('lodash/intersectionBy');
const get = require('lodash/get');
const has = require('lodash/has');
const compact = require('lodash/compact');
const aggregate = require('../../utils/aggregate');
const toObjectId = require('../../utils/to-object-id');

module.exports = Client => {
  Client.joinWithMeterNumber = async (filter, res = null, session = false) => {
    const month = moment(filter.where.termInvoice.gte || filter.where.termInvoice);
    const { skip = 0, limit = 25 } = filter;
    const cleanedFilter = {
      $and: [{ termInvoice: { $gte: moment(month).toDate() } }, { startMeterDate: { $lt: moment(month).toDate() } }],
    };

    let user = { username: '', quarterInChargeIds: [], wardInChargeIds: [] };
    if (res) {
      // Check if the `res` object is either response object from HTTP or from internal calling, which is already
      // processed to AppUser object
      if (has(res, 'req')) {
        user = await res.req.accessToken.user.get();
      } else {
        user = res;
      }
      if (!user) {
        return [];
      }
    }

    // Ensure the user is permitted to access to these quarters
    if (user.username === 'master') {
      if (filter.where.quarterId) {
        cleanedFilter.$and.push({ quarterId: toObjectId(filter.where.quarterId) });
      }

      // Ensure the user is permitted to access to these wards
      if (filter.where.wardId) {
        cleanedFilter.$and.push({ wardId: toObjectId(filter.where.wardId) });
      }
    } else {
      const quarterInChargedIds = (user.quarterInChargeIds || []).map(i => toObjectId(i));
      const wardInChargedIds = (user.wardInChargeIds || []).map(i => toObjectId(i));
      if (filter.where.quarterId) {
        cleanedFilter.$and.push({
          quarterId: {
            $in: intersectionBy([toObjectId(filter.where.quarterId)], quarterInChargedIds, id => id.toString()),
          },
        });
      } else {
        cleanedFilter.$and.push({ quarterId: { $in: quarterInChargedIds } });
      }
      if (filter.where.wardId) {
        cleanedFilter.$and.push({
          wardId: {
            $in: intersectionBy([toObjectId(filter.where.wardId)], wardInChargedIds, id => id.toString()),
          },
        });
      } else {
        cleanedFilter.$and.push({ wardId: { $in: wardInChargedIds } });
      }
    }

    if (filter.where.districtId) {
      cleanedFilter.$and.push({ districtId: toObjectId(filter.where.districtId) });
    }
    if (filter.where.$text) {
      const text = filter.where.$text.search;
      cleanedFilter.$and.push({ $text: { $search: text } });
    }

    let paymentStatusQuery = filter.where.paymentStatus;
    let notUsedQuery = false;
    if (filter.where.paymentStatus) {
      const paymentStatus = filter.where.paymentStatus;
      if (paymentStatus === 'paid') {
        paymentStatusQuery = true;
      } else if (paymentStatus === 'notPaid') {
        paymentStatusQuery = false;
      } else if (paymentStatus === 'notUsed') {
        paymentStatusQuery = true;
        notUsedQuery = true;
      }
    }

    let query = [];
    if (filter.where.paymentStatus || filter.where.einvoice) {
      query = compact([
        { $match: cleanedFilter },
        {
          $addFields: {
            monthId: {
              $concat: [{ $convert: { input: '$_id', to: 'string' } }, moment(month).format('-YYYY-MM')],
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
                  invoiceData: { $exists: true },
                  $expr: {
                    $and: compact([
                      { $eq: ['$_id', '$$monthId'] },
                      has(filter, 'where.paymentStatus') ? { $eq: ['$paymentStatus', paymentStatusQuery] } : null,
                      notUsedQuery
                        ? { $eq: ['$invoiceData.totalWaterUsed', 0] }
                        : { $gt: ['$invoiceData.totalWaterUsed', 0] },
                    ]),
                  },
                },
              },
              {
                $project: {
                  totalWaterUsed: '$invoiceData.totalWaterUsed',
                  totalFee: '$invoiceData.totalFee',
                  paymentStatus: 1,
                },
              },
            ],
            as: 'clientMeterNumber',
          },
        },
        { $unwind: '$clientMeterNumber' },
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
        filter.where.einvoice === 'isExported' || filter.where.einvoice === 'isNotExported'
          ? {
              $match: {
                'einvoice.0': {
                  $exists: filter.where.einvoice === 'isExported' ? true : false,
                },
              },
            }
          : null,
        { $unwind: { path: '$einvoice', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            code: 1,
            name: 1,
            formattedAddress: 1,
            status: 1,
            clientMeterNumber: 1,
            einvoice: 1,
          },
        },
        {
          $facet: filter.noSkipOrLimit
            ? {
                info: [{ $count: 'total' }],
                data: [{ $skip: 0 }],
              }
            : {
                info: [{ $count: 'total' }],
                data: [
                  { $skip: skip },
                  { $limit: limit }, //15
                ],
              },
        },
      ]);
    } else {
      query = [
        { $match: cleanedFilter },
        {
          $facet: {
            info: [{ $count: 'total' }], //30
            data: [
              { $skip: skip },
              { $limit: limit }, //15
              {
                $addFields: {
                  monthId: {
                    $concat: [{ $convert: { input: '$_id', to: 'string' } }, moment(month).format('-YYYY-MM')],
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
                        invoiceData: { $exists: true },
                        $expr: {
                          $eq: ['$_id', '$$monthId'],
                        },
                      },
                    },
                    { $limit: 1 },
                    {
                      $project: {
                        totalWaterUsed: '$invoiceData.totalWaterUsed',
                        totalFee: '$invoiceData.totalFee',
                        paymentStatus: 1,
                      },
                    },
                  ],
                  as: 'clientMeterNumber',
                },
              },
              { $unwind: '$clientMeterNumber' },
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
                        scrappedEinvoice: {
                          $map: {
                            input: '$scrappedEinvoice',
                            as: 'scrappedEinvoice',
                            in: '$$scrappedEinvoice.eInvoiceNo',
                          },
                        },
                      },
                    },
                  ],
                  as: 'einvoice',
                },
              },
              {
                $unwind: {
                  path: '$einvoice',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  code: 1,
                  name: 1,
                  formattedAddress: 1,
                  status: 1,
                  clientMeterNumber: 1,
                  einvoice: 1,
                },
              },
            ],
          },
        },
      ];
    }

    if (filter.fetchOne) {
      query = [
        { $match: cleanedFilter },
        { $limit: 1 },
        {
          $addFields: {
            monthId: {
              $concat: [{ $convert: { input: '$_id', to: 'string' } }, moment(month).format('-YYYY-MM')],
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
                  invoiceData: { $exists: true },
                  $expr: {
                    $and: [{ $eq: ['$_id', '$$monthId'] }],
                  },
                },
              },
            ],
            as: 'clientMeterNumber',
          },
        },
        { $unwind: '$clientMeterNumber' },
        { $replaceRoot: { newRoot: '$clientMeterNumber' } },
      ];
    } else if (filter.fetchAll) {
      query = [
        { $match: cleanedFilter },
        {
          $addFields: {
            monthId: {
              $concat: [{ $convert: { input: '$_id', to: 'string' } }, moment(month).format('-YYYY-MM')],
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
                  invoiceData: { $exists: true },
                  $expr: {
                    $and: [{ $eq: ['$_id', '$$monthId'] }, { $eq: ['$paymentStatus', false] }],
                  },
                },
              },
            ],
            as: 'clientMeterNumber',
          },
        },
        { $unwind: '$clientMeterNumber' },
        { $replaceRoot: { newRoot: '$clientMeterNumber' } },
      ];
    } else if (filter.fetchAllEinvoice) {
      query = [
        { $match: cleanedFilter },
        {
          $addFields: {
            monthId: {
              $concat: [{ $convert: { input: '$_id', to: 'string' } }, moment(month).format('-YYYY-MM')],
            },
          },
        },
        {
          $lookup: {
            from: 'EInvoiceData',
            let: { monthId: `$monthId` },
            pipeline: [
              {
                $match: {
                  eInvoiceNo: { $exists: true },
                  tax: { $exists: true },
                  templateCode: { $exists: true },
                  $expr: { $eq: ['$_id', '$$monthId'] },
                },
              },
            ],
            as: 'einvoiceData',
          },
        },
        { $unwind: '$einvoiceData' },
        { $replaceRoot: { newRoot: '$einvoiceData' } },
      ];
    }
    // Avoid default callback to be interpreted as Session object
    if (isFunction(session)) {
      session = false;
    }
    // console.log(JSON.stringify(query));
    const { data, total } = await aggregate(Client, query, session).then(data => {
      if (filter.fetchAll || filter.fetchOne || filter.fetchAllEinvoice) {
        return { data };
      }
      let total = get(data, '[0].info[0].total', 0);
      let results = get(data, '[0]data', []);
      return {
        data: results.map(record => {
          record.id = record._id;
          delete record._id;
          return record;
        }),
        total,
      };
    });
    if (res && has(res, 'req')) {
      res.header('Content-Range', data.length ? total : data.length);
    }
    return data;
  };

  Client.remoteMethod('joinWithMeterNumber', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
