'use strict';
const aggregate = require('../../utils/aggregate');
module.exports = function(Materialdetailtype) {
  Materialdetailtype.tree = async () => {
    let query = [
      { $group: { _id: '$type', detailTypes: { $push: { name: '$name', slug: '$slug', id: '$_id' } } } },
      { $replaceRoot: { newRoot: { id: '$_id', detailTypes: '$detailTypes' } } },
    ];
    return aggregate(Materialdetailtype, query);
  };
  Materialdetailtype.remoteMethod('tree', {
    accepts: [],
    returns: { root: true, type: ['object'] },
    http: { verb: 'get' },
  });
};
