'use strict';
const moment = require('moment');
const aggregate = require('../../utils/aggregate');

module.exports = Client => {
  Client.statisticRevenue = async (filter, res) => {
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
        let startMonth = moment(tmpDate).startOf('month');

        let record = {};
        record.id = index;
        ++index;
        record.time = moment(startMonth).format('MM/YYYY');
        record.paid = 0; // so tien da thu
        record.unPaid = 0; // so tien chua thu
        record.countClientPaid = 0; // so luong khach hang da thu
        record.countClientUnPaid = 0; // so luong khach hang chua thu

        let data = await aggregate(Client.app.models.ClientMeterNumber, queryStatistic(moment(tmpDate)));
        if (data) {
          if (data.length === 1) {
            if (data[0]._id.paymentStatus === true) {
              record.countClientPaid = data[0].countClient;
              record.paid = data[0].totalFee;
            } else {
              record.countClientUnPaid = data[0].countClient;
              record.unPaid = data[0].totalFee;
            }
          }
          if (data.length === 2) {
            // da tra
            if (data[0]._id.paymentStatus === true && data[1]._id.paymentStatus === false) {
              record.countClientPaid = data[0].countClient;
              record.paid = data[0].totalFee;

              record.countClientUnPaid = data[1].countClient;
              record.unPaid = data[1].totalFee;
            }
            if (data[0]._id.paymentStatus === false && data[1]._id.paymentStatus === true) {
              record.countClientPaid = data[1].countClient;
              record.paid = data[1].totalFee;

              record.countClientUnPaid = data[0].countClient;
              record.unPaid = data[0].totalFee;
            }
          }
        }
        record.totalRevenue = record.paid + record.unPaid; // tong doanh thu
        record.sumClient = record.countClientPaid + record.countClientUnPaid; // tong khach hang
        dataCollect.push(record);
      }

      res.header('content-range', dataCollect.length);
      return dataCollect;
    } catch (error) {
      throw error;
    }
  };
  // dashboard, thong ke doanh thu, thong ke thanh toan
  Client.remoteMethod('statisticRevenue', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });

  const queryStatistic = month => {
    let startMonth = moment(month)
      .startOf('month')
      .toDate();
    let endMonth = moment(month)
      .endOf('month')
      .toDate();

    let query = [
      {
        $addFields: {
          monthId: { $concat: [{ $convert: { input: '$clientId', to: 'string' } }, moment(month).format('-YYYY-MM')] },
        },
      },
      {
        $match: {
          $expr: {
            $and: [{ $lte: ['$toDate', endMonth] }, { $gte: ['$toDate', startMonth] }, { $eq: ['$monthId', '$_id'] }],
          },
        },
      },
      {
        $match: {
          'invoiceData.totalFee': { $exists: true },
        },
      },
      {
        $group: {
          _id: { paymentStatus: '$paymentStatus' },
          countClient: { $sum: 1 },
          totalFee: { $sum: '$invoiceData.totalFee' },
        },
      },
    ];
    return query;
  };
};
