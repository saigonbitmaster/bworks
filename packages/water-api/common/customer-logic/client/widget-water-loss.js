module.exports = function(Client) {
  Client.widgetWaterLoss = async () => {
    let res = {};
    return res;
  };
  // widget that thoat /  PENDING
  Client.remoteMethod('widgetWaterLoss', {
    accepts: [],
    http: { verb: 'get' },
    returns: { root: true, type: Array },
  });
};
