module.exports = SourceTemplate => {
  SourceTemplate.remoteMethod('getId', {
    http: { verb: 'get' },
    accepts: [],
    returns: [{ arg: 'data', type: 'array', root: true }],
  });
  SourceTemplate.getId = async () => {
    let enumId = SourceTemplate.definition.properties.id.enum;
    let existedId = await SourceTemplate.find({ fields: { id: true } });
    existedId = existedId.map(item => item.id);
    let validEnum = [];
    if (!existedId || existedId.length < 1) return enumId;
    enumId.map(item => !existedId.includes(item) && validEnum.push(item));
    return validEnum;
  };
};
