'use strict';
const moment = require('moment-timezone');
const set = require('lodash/set');
const aggregate = require('../../utils/aggregate');

module.exports = function(Client) {
  // Client.revenue = async () => {
  //   let current = moment().startOf('month');
  //   let clientMeterNumberModel = Client.app.models.ClientMeterNumber;
  //   let times = {
  //     thisYear: current.year(),
  //     lastYear: current.year() - 1,
  //     lastMonth: current.month(), // moment: month() return 0-11, mongo: 1-12
  //   };
  //   let query = [
  //     {
  //       $match: {
  //         toDate: {
  //           $lt: current.toDate(),
  //           $gt: current
  //             .subtract(1, 'year')
  //             .startOf('year')
  //             .toDate(),
  //         },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: { year: { $year: '$toDate' }, month: { $month: '$toDate' } },
  //         fee: { $sum: '$invoiceData.waterFee' },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: true,
  //         lastYear: { $sum: { $cond: [{ $eq: ['$_id.year', times.lastYear] }, '$fee', 0] } },
  //         thisYear: { $sum: { $cond: [{ $eq: ['$_id.year', times.thisYear] }, '$fee', 0] } },
  //         lastMonth: {
  //           $sum: {
  //             $cond: [
  //               { $and: [{ $eq: ['$_id.year', times.thisYear] }, { $eq: ['$_id.month', times.lastMonth] }] },
  //               '$fee',
  //               0,
  //             ],
  //           },
  //         },
  //       },
  //     },
  //   ];
  //   let data = await aggregate(clientMeterNumberModel, query);
  //   if (data && data.length > 0) {
  //     return data[0];
  //   }
  //   return {};
  // };

  Client.widgetRevenue = async () => {
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
    res.lastMonth = tmp && tmp.length === 1 ? tmp[0].totalFee : 0;

    // nam nay
    start = thisYear.toDate();
    end = moment(thisYear)
      .endOf('year')
      .toDate();
    tmp = await aggregate(ClientMeterNumber, query(start, end));
    res.thisYear = tmp && tmp.length === 1 ? tmp[0].totalFee : 0;

    // nam truoc
    start = moment(lastYear)
      .startOf('year')
      .toDate();
    end = moment(lastYear)
      .endOf('year')
      .toDate();
    tmp = await aggregate(ClientMeterNumber, query(start, end));
    res.lastYear = tmp && tmp.length === 1 ? tmp[0].totalFee : 0;

    return res;
  };
  // widget doanh thu
  Client.remoteMethod('widgetRevenue', {
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
          'invoiceData.totalFee': { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          totalFee: { $sum: '$invoiceData.totalFee' },
        },
      },
      { $limit: 1 },
    ];
    let query = set(rawQuery, '[0].$match.toDate.$lte', endTime);
    query = set(rawQuery, '[0].$match.toDate.$gte', startTime);
    return query;
  };
};
