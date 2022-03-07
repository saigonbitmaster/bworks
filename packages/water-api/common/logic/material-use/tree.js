'use strict';
const aggregate = require('../../utils/aggregate');
module.exports = function(Materialuse) {
  Materialuse.tree = async () => {
    let query = [
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: '$detailTypeId',
          value: { $sum: { $cond: [{ $eq: ['$type', 'Pipe'] }, '$length', 1] } },
          type: { $first: '$type' },
        },
      },
      {
        $lookup: {
          from: 'MaterialDetailType',
          let: { detailTypeId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$_id', '$$detailTypeId'] }] } } },
            { $project: { name: 1, _id: 0 } },
          ],
          as: 'detailType',
        },
      },
      { $unwind: { path: '$detailType', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$type',
          type: { $first: '$type' },
          value: { $sum: '$value' },
          details: { $push: { value: '$value', detailTypeId: '$_id', detailTypeName: '$detailType.name' } },
        },
      },
    ];
    return aggregate(Materialuse, query);
  };
  Materialuse.remoteMethod('tree', {
    accepts: [],
    returns: { root: true, type: ['object'] },
    http: { verb: 'get' },
  });
};
