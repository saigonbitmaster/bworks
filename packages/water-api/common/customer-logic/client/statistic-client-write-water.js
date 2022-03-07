'use strict';
const moment = require('moment-timezone');
const aggregate = require('../../utils/aggregate');

module.exports = Client => {
  Client.statisticClientWriteWater = async (filter, res) => {
    try {
      let dataCollect = [];
      let { fromTime, toTime } = filter.where;
      if (!fromTime || !toTime) {
        return dataCollect;
      }
      let index = 0;
      for (
        let tmpDate = moment(fromTime).startOf('month');
        tmpDate <= moment(toTime).startOf('month');
        tmpDate = moment(tmpDate).add(1, 'M')
      ) {
        let record = {};
        record.id = index;
        ++index;
        record.time = moment(tmpDate)
          .startOf('month')
          .format('MM/YYYY');
        record.countWriteWater = 0;
        record.countUnWriteWater = 0;
        record.sumClient = 0;

        // tong khach hang
        let dataSumClient = await aggregate(Client, querySumClient(moment(tmpDate)));

        // cac khac hang da ghi nuoc
        let dataWriteMeter = await aggregate(Client.app.models.ClientMeterNumber, queryWriteMeter(moment(tmpDate)));

        if (dataWriteMeter) {
          const a = dataWriteMeter.filter(
            ({ _id: { month, year } }) => moment(tmpDate).month() + 1 === month && moment(tmpDate).year() === year,
          )[0];
          record.countWriteWater = a && a.count ? a.count : 0;
        }

        if (dataSumClient && dataSumClient.length === 1) {
          const sumClient = dataSumClient[0].count || 0;
          record.sumClient = sumClient;
          let tmp = sumClient - record.countWriteWater;
          record.countUnWriteWater = tmp < 0 ? 0 : tmp;
        }

        dataCollect.push(record);
      }

      res.header('content-range', dataCollect.length);
      return dataCollect;
    } catch (error) {
      throw error;
    }
  };

  // dashboard, thong ke so lieu dong ho
  Client.remoteMethod('statisticClientWriteWater', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });

  const queryWriteMeter = month => {
    let startMonth = moment(month)
      .startOf('month')
      .toDate();
    let startMeterMonth = moment(month)
      .startOf('month')
      .toDate();
    let endMonth = moment(month)
      .endOf('month')
      .toDate();

    let rawQuery = [
      {
        $match: {
          $expr: {
            $and: [
              { $gte: ['$toDate', startMonth] }, // must be replace // startMonth
              { $lte: ['$toDate', endMonth] }, // must be replace // endMonth
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'Client',
          let: { clientId: '$clientId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$clientId'] },
                    { $lte: ['$startMeterDate', startMeterMonth] }, // must be replace // startMeterMonth
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
            { $limit: 1 },
          ],
          as: 'client',
        },
      },
      { $unwind: '$client' },
      {
        $group: {
          _id: { year: { $year: '$toDate' }, month: { $month: '$toDate' } },
          count: { $sum: 1 },
        },
      },
    ];

    return rawQuery;
  };

  const querySumClient = month => {
    const startMonth = moment(month)
      .startOf('month')
      .toDate();

    let rawQuery = [
      {
        $match: {
          status: { $in: ['ACTIVE', 'STOP', 'PAUSE'] },
          startMeterDate: { $lte: startMonth }, // must be replace // startMeonth
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
    ];
    return rawQuery;
  };
};
