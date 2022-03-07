const moment = require('moment');
const set = require('lodash/set');
const aggregate = require('../../utils/aggregate');

module.exports = function(Client) {
  Client.widgetWaterQuantity = async () => {
    let res = {};
    let tmp = [];
    let ClientMeterNumber = Client.app.models.ClientMeterNumber;

    let thisMonth = moment().startOf('month');
    let lastMonth = moment(thisMonth).subtract(1, 'months');

    let thisYear = moment().startOf('year');
    let lastYear = moment(thisYear).subtract(1, 'years');

    // thang truoc
    let start = moment(lastMonth)
      .startOf('month')
      .toDate();
    let end = moment(lastMonth)
      .endOf('month')
      .toDate();
    tmp = await aggregate(ClientMeterNumber, query(start, end));
    res.lastMonth = tmp && tmp.length === 1 ? tmp[0].totalWaterUsed : 0;

    // nam nay
    start = thisYear.toDate();
    end = moment(thisYear)
      .endOf('year')
      .toDate();
    tmp = await aggregate(ClientMeterNumber, query(start, end));
    res.thisYear = tmp && tmp.length === 1 ? tmp[0].totalWaterUsed : 0;

    // nam truoc
    start = moment(lastYear)
      .startOf('year')
      .toDate();
    end = moment(lastYear)
      .endOf('year')
      .toDate();
    tmp = await aggregate(ClientMeterNumber, query(start, end));
    res.lastYear = tmp && tmp.length === 1 ? tmp[0].totalWaterUsed : 0;
    return res;
  };
  // widge san luong
  Client.remoteMethod('widgetWaterQuantity', {
    accepts: [],
    http: { verb: 'get' },
    returns: { root: true, type: Array },
  });
  const query = (startTime, endTime) => {
    let rawQuery = [
      {
        $match: {
          toDate: {
            $lte: null, //replace, end time
            $gte: null, //replace, start time
          },
          'invoiceData.totalWaterUsed': { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          totalWaterUsed: { $sum: '$invoiceData.totalWaterUsed' },
        },
      },
      { $limit: 1 },
    ];
    let query = set(rawQuery, '[0].$match.toDate.$lte', endTime);
    query = set(rawQuery, '[0].$match.toDate.$gte', startTime);
    return query;
  };
};
