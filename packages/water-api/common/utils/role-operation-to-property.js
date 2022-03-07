module.exports = (model, method, operationId) => {
  if (operationId.indexOf('replaceById__put_') === 0) {
    return 'replaceById';
  }
  if (operationId.indexOf('exists__head_') === 0) {
    return 'exists';
  }
  if (operationId.indexOf('exists__get_') === 0) {
    return 'exists';
  }
  if (operationId.indexOf('replaceOrCreate__put_') === 0) {
    return 'upsert';
  }
  return operationId;
};
