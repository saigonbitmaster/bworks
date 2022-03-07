module.exports = CtmTemplate => {
  CtmTemplate.remoteMethod('getId', {
    http: { verb: 'get' },
    accepts: [],
    returns: [{ arg: 'data', type: 'array', root: true }],
  });
  CtmTemplate.getId = async () => {
    let enumId = CtmTemplate.definition.properties.id.enum;
    let existedId = await CtmTemplate.find({ fields: { id: true } });
    existedId = existedId.map(item => item.id);
    let validEnum = [];
    if (!existedId || existedId.length < 1) return enumId;
    enumId.map(item => !existedId.includes(item) && validEnum.push(item));
    return validEnum;
  };
};
