'use strict';
const ObjectID = require('mongodb').ObjectID;
const { get } = require('lodash');
const aggregate = require('../../utils/aggregate');

module.exports = Client => {
  Client.offlineDownload = async (quarterId, page = 1, perPage = 500) => {
    let termData = {};
    let query = queryGetData({ quarterId, page, perPage });
    termData = await aggregate(Client, query);
    termData = termData && termData.length == 1 ? termData[0] : {};
    const { data = [], info = [] } = termData || {};
    return { data, page, perPage, total: get(info, '[0].total') || 0 };
  };

  Client.remoteMethod('offlineDownload', {
    accepts: [
      { arg: 'quarterId', type: 'string', required: true },
      { arg: 'page', type: 'number' },
      { arg: 'perPage', type: 'number' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });

  const queryGetData = ({ quarterId, page, perPage }) => {
    const query = [
      {
        $match: {
          quarterId: new ObjectID(quarterId),
          status: 'ACTIVE',
        },
      },
      {
        $project: {
          code: 1,
          name: 1,
          serial: 1,
          wardId: 1,
          quarterId: 1,
          formattedAddress: 1,
          position: 1,
        },
      },
      {
        $limit: 10000,
      },
      {
        $facet: {
          info: [
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
                ],
                as: 'clientMeter',
              },
            },
            {
              $unwind: {
                path: '$clientMeter',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $addFields: { id: '$_id', qrCode: '$clientMeter.qrCode' },
            },
            {
              $project: {
                clientMeter: 0,
              },
            },
          ],
        },
      },
    ];
    return query;
  };
};
