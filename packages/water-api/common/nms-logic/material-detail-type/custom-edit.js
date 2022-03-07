let slug = require('slug');
const createError = require('http-errors');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
module.exports = function(Materialdetailtype) {
  Materialdetailtype.customEdit = async (id, { data }, options) => {
    if (!id || !data.type || !data.name) {
      throw createError(400, 'error.DATA_INVALID');
    }
    let record = await Materialdetailtype.findOne({ where: { id } });
    if (!record) {
      throw createError(400, 'error.DATA_NOT_EXIST');
    }
    data.slug = slug(data.name);
    delete data.id;
    const fullData = await operationMeta({ data, options, isNew: false });
    return record.updateAttributes(fullData);
  };
  Materialdetailtype.remoteMethod('customEdit', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'data', type: 'object', http: { source: 'body' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
    http: { path: '/customEdit/:id', verb: 'put' },
  });
};
