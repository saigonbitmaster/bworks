'use strict';
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-timezone');
const createError = require('http-errors');
const { get, set } = require('lodash');
const aggregate = require('../../utils/aggregate');
const { utc } = require('../../../server/config.json');

module.exports = Client => {
  Client.getClientMeterNumberApp = async (filter, res, options) => {
    const filterQuery = filter.where ? { ...filter.where, ...filter } : filter;
    // check search
    if (get(filterQuery, '$text.$search', '') === '""') {
      delete filterQuery.$text;
    }
    let termData = [];
    if (options.accessToken) {
      let user = await options.accessToken.user.get();
      const { wardInChargeIds: tempWICIArray = [], quarterInChargeIds: tempQICIArray = [] } = user;
      const wardInChargeIds = tempWICIArray.map(wardId => new ObjectID(wardId));
      const quarterInChargeIds = tempQICIArray.map(quarterId => new ObjectID(quarterId));
      if (wardInChargeIds && wardInChargeIds.length) {
        let query = await queryGetData(filterQuery, wardInChargeIds);
        if (quarterInChargeIds && quarterInChargeIds.length > 0) {
          query = await queryGetData(filterQuery, wardInChargeIds, quarterInChargeIds);
        }
        termData = await aggregate(Client, query);
        // termData = termData && termData.length == 1 ? termData[0] : {};
      } else if ((options.authorizedRoles && options.authorizedRoles.master) || options.authorizedRoles.admin) {
        const query = await queryGetData(filterQuery);
        termData = await aggregate(Client, query);
      }
    }
    const { termMonth, type } = filterQuery;
    switch (type) {
      case 'list': {
        const { data = [], info = [] } = termData[0] || {};
        data.map(item => {
          if (!item.fromDate) {
            item.fromDate = moment(termMonth)
              .subtract(1, 'month')
              .startOf('month')
              .add(15, 'day')
              .toDate();
          }
          if (!item.toDate) {
            item.toDate = moment(item.fromDate)
              .add(1, 'month')
              .startOf('day')
              .toDate();
          }
        });
        res.header('Content-Range', get(info, '[0].total', 0));
        return data;
      }
      case 'map':
        return termData.filter(item => !!item.geometry);
      case 'qrscan': {
        return termData;
      }
    }
  };

  Client.remoteMethod('getClientMeterNumberApp', {
    accepts: [
      { arg: 'filter', type: 'object', required: true },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'array', root: true },
  });

  const queryGetData = async (filter, wardInChargeIds, quarterInChargeIds) => {
    const {
      $text,
      termMonth,
      type,
      clientMeterNumber,
      quarterId,
      showAll,
      districtId,
      wardId,
      skip,
      limit,
      position,
      needPositon,
    } = filter;
    // <--------------- Khai báo ngày tháng -------------------->
    // const limitTo = moment(termMonth).endOf('month');
    const startMonth = moment(termMonth)
      .startOf('month')
      .toDate();
    const selectedMonth = moment(termMonth);
    const currentMonth = moment().startOf('month');
    // <----------------Khai báo object filter xài chung--------------->
    const filterQuery = {
      status: 'ACTIVE',
      startMeterDate: { $lt: startMonth },
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
    if (!showAll) {
      set(filterQuery, '$and', [
        {
          termMeterNumber: {
            $gte: moment(termMonth)
              .subtract(1, 'month')
              .startOf('month')
              .toDate(),
          },
        },
        {
          termMeterNumber: {
            $lt: moment(termMonth)
              .endOf('month')
              .toDate(),
          },
        },
      ]);
    }
    //<------------------Khai báo mongodb aggregate xài chung--------------------------->

    const lookupMeterNumber = [
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
                  $eq: ['$_id', '$$monthId'],
                },
              },
            },
            {
              $project: {
                paymentStatus: 1,
                previousNumber: 1,
                currentNumber: 1,
                fromDate: 1,
                updatedDate: 1,
                toDate: 1,
                id: '$_id',
              },
            },
          ],
          as: 'clientMeterNumber',
        },
      },
    ];

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
    const addCommonFields = [
      {
        $addFields: {
          id: '$_id',
          termMonth,
          previousNumber: {
            $switch: {
              branches: [
                {
                  case: { $not: ['$clientMeterNumber'] },
                  then: '$lastMeterNumber',
                },
                {
                  case: { $lt: ['$clientMeterNumber.toDate', startMonth] },
                  then: '$clientMeterNumber.currentNumber',
                },
                {
                  case: { $gte: ['$clientMeterNumber.toDate', startMonth] },
                  then: '$clientMeterNumber.previousNumber',
                },
              ],
              default: '$lastMeterNumber',
            },
          },
          fromDate: {
            $switch: {
              branches: [
                {
                  case: { $not: ['$clientMeterNumber'] },
                  then: '$lastTimeMeterNumberUpdate',
                },
                {
                  case: { $lt: ['$clientMeterNumber.toDate', startMonth] },
                  then: '$clientMeterNumber.toDate',
                },
                {
                  case: { $gte: ['$clientMeterNumber.toDate', startMonth] },
                  then: '$clientMeterNumber.fromDate',
                },
              ],
              default: '$lastTimeMeterNumberUpdate',
            },
          },
          toDate: {
            $switch: {
              branches: [
                {
                  case: { $not: ['$clientMeterNumber'] },
                  then: null,
                },
                {
                  case: { $lt: ['$clientMeterNumber.toDate', startMonth] },
                  then: null,
                },
                {
                  case: { $gte: ['$clientMeterNumber.toDate', startMonth] },
                  then: '$clientMeterNumber.toDate',
                },
              ],
              default: null,
            },
          },
          currentNumber: {
            $switch: {
              branches: [
                {
                  case: { $lt: ['$clientMeterNumber.toDate', startMonth] },
                  then: null,
                },
                {
                  case: { $gte: ['$clientMeterNumber.toDate', startMonth] },
                  then: '$clientMeterNumber.currentNumber',
                },
              ],
              default: null,
            },
          },
          qrCode: '$clientMeter.qrCode',
        },
      },
    ];

    const disabled = currentMonth.diff(selectedMonth, 'month') < 0 ? true : false;
    const addDisabledFields = [
      {
        $addFields: {
          disabled: disabled || {
            $or: [
              {
                $eq: ['$startMeterDate', null],
              },
              {
                $eq: ['$clientMeterNumber.paymentStatus', true],
              },
              {
                $lt: [
                  moment(termMonth)
                    .endOf('month')
                    .toDate(),
                  '$startMeterDate',
                ],
              },
              {
                $and: [
                  {
                    $ne: [
                      { $month: { date: selectedMonth.toDate(), timezone: utc } },
                      { $month: { date: '$lastTimeMeterNumberUpdate', timezone: utc } },
                    ],
                  }, // edit
                  {
                    $ne: [
                      { $month: { date: selectedMonth.toDate(), timezone: utc } },
                      {
                        $month: {
                          date: { $add: ['$lastTimeMeterNumberUpdate', 1000 * 60 * 60 * 24 * 30] },
                          timezone: utc,
                        },
                      }, // write new
                    ],
                  },
                ],
              },
              {
                $lt: [
                  moment(termMonth)
                    .startOf('month')
                    .toDate(),
                  '$termInvoice',
                ],
              },
            ],
          },
        },
      },
    ];
    let query = [];
    //<---------------------------Xử lý riêng cho từng loại query-------------------------->
    switch (type) {
      case 'list': {
        const listMatch = [
          {
            $match: {
              // wardId: {
              //   $in: wardInChargeIds,
              // },
              status: 'ACTIVE',
              startMeterDate: { $lt: startMonth },
              ...filterQuery,
            },
          },
        ];
        if (wardInChargeIds) {
          set(listMatch, '[0].$match.wardId.$in', wardInChargeIds);
        }
        const listProject = [
          {
            $project: {
              id: '$_id',
              name: 1,
              serial: 1,
              status: 1,
              wardId: 1,
              quarterId: 1,
              code: 1,
              termInvoice: 1,
              lastTimeMeterNumberUpdate: 1,
              startMeterDate: 1,
              lastMeterNumber: 1,
              termMeterNumber: 1,
              formattedAddress: 1,
              toDate: 1,
              fromDate: 1,
              previousNumber: 1,
              currentNumber: 1,
              qrCode: 1,
              clientId: 1,
              clientMeterNumber: 1,
              termMonth: 1,
              disabled: 1,
            },
          },
        ];
        if (needPositon) set(listProject, '0.$project.position', 1);
        const limitData = [
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ];
        const unwindLookupMeterNumber = [
          {
            $unwind: { path: '$clientMeterNumber', preserveNullAndEmptyArrays: !clientMeterNumber },
          },
        ];
        switch (clientMeterNumber) {
          case undefined:
          case null: {
            query = [
              ...listMatch,
              {
                $facet: {
                  info: [{ $count: 'total' }],
                  data: [
                    ...limitData,
                    ...lookupMeterNumber,
                    ...unwindLookupMeterNumber,
                    ...lookupMeter,
                    ...addCommonFields,
                    ...addDisabledFields,
                    ...listProject,
                  ],
                },
              },
            ];
            break;
          }
          case true: {
            query = [
              ...listMatch,
              ...lookupMeterNumber,
              ...unwindLookupMeterNumber,
              {
                $facet: {
                  info: [{ $count: 'total' }],
                  data: [...limitData, ...lookupMeter, ...addCommonFields, ...addDisabledFields, ...listProject],
                },
              },
            ];
            break;
          }
          case false: {
            query = [
              ...listMatch,
              ...lookupMeterNumber,
              {
                $match: {
                  clientMeterNumber: { $size: 0 },
                },
              },
              {
                $unwind: {
                  path: '$clientMeterNumber',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $facet: {
                  info: [{ $count: 'total' }],
                  data: [...limitData, ...lookupMeter, ...addCommonFields, ...listProject],
                },
              },
            ];
            break;
          }
        }
        break;
      }
      case 'map': {
        const { coordinates, maxDistance } = position;
        const { $text, ...geoQuery } = filterQuery; // $text doesn't working with $geoNear
        const geoMatch = [
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates,
              },
              distanceField: 'distanceToInit',
              includeLocs: 'geometry',
              maxDistance,
              query: geoQuery,
              limit,
            },
          },
        ];
        const mapProject = [
          {
            $project: {
              currentNumber: 1,
              previousNumber: 1,
              termMonth: 1,
              disabled: 1,
              updatedDate: 1,
              fromDate: 1,
              toDate: 1,
              clientMeterNumber: 1,
              distanceToInit: 1,
              geometry: 1,
              id: '$_id',
              name: 1,
              formattedAddress: 1,
              termMeterNumber: 1,
              lastMeterNumber: 1,
              code: 1,
              serial: 1,
              position: 1,
              status: 1,
              startMeterDate: 1,
              lastTimeMeterNumberUpdate: 1,
              termInvoice: 1,
            },
          },
        ];

        switch (clientMeterNumber) {
          case undefined:
          case null: {
            query = [
              ...geoMatch,
              ...lookupMeterNumber,
              {
                $unwind: { path: '$clientMeterNumber', preserveNullAndEmptyArrays: true },
              },
              ...addCommonFields,
              ...addDisabledFields,
              ...mapProject,
            ];
            break;
          } // tat ca
          case true: {
            query = [
              ...geoMatch,
              ...lookupMeterNumber,
              {
                $unwind: { path: '$clientMeterNumber', preserveNullAndEmptyArrays: false },
              },
              ...addCommonFields,
              ...addDisabledFields,
              ...mapProject,
            ];
            break;
          } // da ghi
          case false: {
            query = [
              ...geoMatch,
              ...lookupMeterNumber,
              {
                $match: {
                  clientMeterNumber: { $size: 0 },
                },
              },
              {
                $unwind: {
                  path: '$clientMeterNumber',
                  preserveNullAndEmptyArrays: true,
                },
              },
              ...addCommonFields,
              ...addDisabledFields,
              ...mapProject,
            ];
            break;
          } // chua ghi
        }
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
              // wardId: {
              //   $in: wardInChargeIds,
              // },
              status: 'ACTIVE',
              startMeterDate: { $lt: startMonth },
              _id: new ObjectID(clientId),
              ...qrQuery,
            },
          },
          ...lookupMeterNumber,
          {
            $unwind: { path: '$clientMeterNumber', preserveNullAndEmptyArrays: true },
          },
          ...addDisabledFields,
          {
            $project: {
              id: '$_id',
              clientMeterNumber: 1,
              disabled: 1,
            },
          },
        ];
        if (wardInChargeIds) {
          set(query, '[0].$match.wardId.$in', wardInChargeIds);
        }
        break;
      }
    }
    // console.log(JSON.stringify(query));
    return query;
  };
};
