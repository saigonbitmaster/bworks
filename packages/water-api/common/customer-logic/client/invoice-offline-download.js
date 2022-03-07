'use strict';
const ObjectID = require('mongodb').ObjectID;
const { get } = require('lodash');
const aggregate = require('../../utils/aggregate');
const moment = require('moment-timezone');

module.exports = Client => {
  Client.invoiceOfflineDownload = async (termMonth, quarterId, page = 1, perPage = 500) => {
    let termData = {};
    let query = queryGetData({ termMonth, quarterId, page, perPage });
    termData = await aggregate(Client, query);
    termData = termData && termData.length == 1 ? termData[0] : {};
    const { data = [], total = [] } = termData || {};
    return { data, page, perPage, total: get(total, '[0].total') || 0 };
  };

  Client.remoteMethod('invoiceOfflineDownload', {
    accepts: [
      { arg: 'termMonth', type: 'string', required: true },
      { arg: 'quarterId', type: 'string', required: true },
      { arg: 'page', type: 'number' },
      { arg: 'perPage', type: 'number' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });

  const queryGetData = ({ termMonth, quarterId, page = 1, perPage = 500 }) => {
    const selectedMonth = moment(termMonth);
    const query = [
      {
        $match: {
          status: 'ACTIVE',
          termInvoice: {
            $gte: selectedMonth.toDate(),
          },
          startMeterDate: {
            $lt: selectedMonth.toDate(),
          },
          quarterId: new ObjectID(quarterId),
        },
      },
      {
        $addFields: {
          monthId: {
            $concat: [{ $convert: { input: '$_id', to: 'string' } }, selectedMonth.format('-YYYY-MM')],
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
            {
              $project: {
                totalWaterUsed: '$invoiceData.totalWaterUsed',
                totalFee: '$invoiceData.totalFee',
                paymentStatus: 1,
                previousNumber: 1,
                currentNumber: 1,
                invoiceData: 1,
                id: '$_id',
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
      { $unwind: { path: '$einvoice' } },
      {
        $facet: {
          total: [
            {
              $count: 'total',
            },
          ],
          data: [
            {
              $skip: (page - 1) * perPage,
            },
            {
              $limit: perPage,
            },
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
                    $project: {
                      qrCode: 1,
                    },
                  },
                  {
                    $limit: 1,
                  },
                ],
                as: 'clientMeter',
              },
            },
            {
              $unwind: { path: '$clientMeter', preserveNullAndEmptyArrays: true },
            },
            {
              $project: {
                id: '$_id',
                clientId: 1,
                name: 1,
                quarterId: 1,
                code: 1,
                termInvoice: 1,
                formattedAddress: 1,
                qrCode: '$clientMeter.qrCode',
                clientMeterNumber: 1,
                clientMeterNumberId: '$clientMeterNumber._id',
                paymentStatus: {
                  $convert: {
                    input: '$clientMeterNumber.paymentStatus',
                    to: 'int',
                    onError: 0,
                    onNull: 0,
                  },
                },
                geometry: '$position',
              },
            },
          ],
        },
      },
    ];
    // console.log(JSON.stringify(query));
    return query;
  };
};
