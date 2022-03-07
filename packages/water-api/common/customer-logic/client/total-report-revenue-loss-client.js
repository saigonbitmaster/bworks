'use strict';
const moment = require('moment');
const set = require('lodash/set');
const aggregate = require('../../utils/aggregate');
module.exports = function(Client) {
  Client.totalReportRevenueLossClient = async function(filter) {
    // console.log('totalReportRevenueLossClient: ', filter);
    try {
      let { time } = filter;
      let result = {
        sumWaterRevenueLoss: 0,
        sumInvoiceWaterRevenueLoss: 0,
      };
      if (!time) {
        return result;
      }
      // dinh muc/nguoi
      let quatoWater = await Client.app.models.QuotaWater.findById('quota-water');
      let quotaWaterPerPerson = quatoWater && quatoWater.value ? quatoWater.value : 0;

      let clientMeterNumbers = [];
      clientMeterNumbers = await aggregate(Client.app.models.ClientMeterNumber, queryReport(time));

      if (!clientMeterNumbers.length) {
        return result;
      }

      for (let i = 0; i < clientMeterNumbers.length; i++) {
        let itemCMN = clientMeterNumbers[i];

        let client = itemCMN.client;
        let formula = itemCMN.formula;
        let invoiceData = itemCMN.invoiceData;

        // let tax = formula.tax ? formula.tax : 0; // thue (%)
        // let sewageFee = formula.sewageFee ? formula.sewageFee : 0; // phi nuoc thai (%)

        // so nuoc su dung thuc te
        let totalWaterUsage = invoiceData.totalWaterUsed ? invoiceData.totalWaterUsed : 0;
        // so tien sau thue (thuc te)
        let totalInvoiceUsage = invoiceData.totalFee;

        let familyCount = client.familyCount ? client.familyCount : 0; // so ho
        let memberCount = client.memberCount ? client.memberCount : 0; // so thanh vien

        let totalWaterExpected = familyCount * memberCount * quotaWaterPerPerson; // so nuoc su dung du kien

        // so nuoc that thu(m3)
        let totalWaterRevenueLoss = totalWaterUsage - totalWaterExpected;
        if (totalWaterRevenueLoss <= 0) {
          continue;
        }
        // so tien sau thue (du kien)
        let totalInvoiceWaterExpected =
          totalWaterExpected > 0 ? Client.getPriceDetails(client, formula, totalWaterExpected) : 0;

        // so tien that thu
        let totalInvoiceWaterRevenueLoss = totalInvoiceUsage - totalInvoiceWaterExpected;

        result.sumWaterRevenueLoss += totalWaterRevenueLoss; // so nuoc that thu
        result.sumInvoiceWaterRevenueLoss += totalInvoiceWaterRevenueLoss; // tien that thu
      }

      return result;
    } catch (e) {
      throw e;
    }
  };

  // bao cao khach hang that thu => tinh tong tat ca record
  Client.remoteMethod('totalReportRevenueLossClient', {
    accepts: [{ arg: 'filter', type: 'object' }],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
  const queryReport = time => {
    let startTime = moment(time)
      .startOf('month')
      .toDate();
    let endTime = moment(time)
      .endOf('month')
      .toDate();
    let rawQuery = [
      {
        $match: {
          toDate: {
            $lte: null, //replace, end time
            $gte: null, //replace, start time
          },
          invoiceData: { $exists: true },
        },
      },
      {
        $lookup: {
          from: 'QuotaWater',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', 'quota-water'] }],
                },
              },
            },
            { $project: { _id: 1, value: 1 } },
          ],
          as: 'QuotaWater',
        },
      },
      { $unwind: '$QuotaWater' },
      {
        $lookup: {
          from: 'Client',
          let: {
            clientId: '$clientId',
            quotaWater: '$QuotaWater.value',
            totalWaterUsage: '$invoiceData.totalWaterUsed',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$clientId'] },
                    { $eq: ['$type', 'RESIDENT'] },
                    { $gt: [{ $multiply: ['$familyCount', '$memberCount', '$$totalWaterUsage'] }, '$$quotaWater'] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                code: 1,
                name: 1,
                formattedAddress: 1,
                familyCount: 1,
                memberCount: 1,
                invoiceData: 1,
                formulaId: 1,
                provinceId: 1,
                districtId: 1,
                quarterId: 1,
                wardId: 1,
              },
            },
          ],

          as: 'client',
        },
      },
      { $unwind: '$client' },
      {
        $lookup: {
          from: 'Formula',
          let: { formulaId: '$client.formulaId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$formulaId'] }],
                },
              },
            },
            { $project: { sewageFee: 1, tax: 1, unit: 1, normGroups: 1 } },
          ],
          as: 'formula',
        },
      },
      { $unwind: '$formula' },
    ];
    let query = set(rawQuery, '[0].$match.toDate.$lte', endTime);
    query = set(query, '[0].$match.toDate.$gte', startTime);

    return query;
  };
};
