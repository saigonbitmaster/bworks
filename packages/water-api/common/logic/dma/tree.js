'use strict';
const aggregate = require('../../utils/aggregate');

module.exports = Dma => {
  const buildQuery = (parentDmaId, fields) => {
    const selectFields = {};
    fields.map(item => (typeof item === 'string' ? (selectFields[item] = true) : ''));
    return [
      { $match: { level: 1 } },
      {
        $lookup: {
          from: 'Dma',
          //   localField: "_id",
          //   foreignField: "parentDmaId",
          let: { parentId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$parentDmaId', '$$parentId'],
                },
                level: 2,
              },
            },
            {
              $project: {
                id: '$_id',
                _id: false,
                ...selectFields,
              },
            },
          ],
          as: 'dmas',
        },
      },
      {
        $project: {
          id: '$_id',
          _id: false,
          ...selectFields,
        },
      },
      { $limit: 1000 },
    ];
  };
  Dma.tree = async (parentDmaId = '', fields = ['name', 'level', 'parentDmaId', 'dmas']) => {
    const query = buildQuery(parentDmaId, fields);
    const result = await aggregate(Dma, query);
    return result;
  };
  Dma.remoteMethod('tree', {
    accepts: [
      { arg: 'parentDmaId', type: 'string' },
      { arg: 'fields', type: ['string'] },
    ],
    http: { verb: 'GET' },
    returns: { root: true, type: ['object'] },
  });
};
