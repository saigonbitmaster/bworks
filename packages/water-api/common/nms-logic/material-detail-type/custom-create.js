let slug = require('slug');
const createError = require('http-errors');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
module.exports = function(Materialdetailtype) {
  Materialdetailtype.customCreate = async (data, options) => {
    if (!data.type || !data.name) {
      throw createError(400, 'error.DATA_INVALID');
    }
    let start = data.type;
    let end = slug(data.name);
    data.id = `${start}-${end}`;
    data.slug = end;
    const fullData = await operationMeta({ data, options, isNew: true });
    let record = await Materialdetailtype.create(fullData);
    return record;
  };
  Materialdetailtype.remoteMethod('customCreate', {
    accepts: [
      { arg: 'data', type: 'object' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
