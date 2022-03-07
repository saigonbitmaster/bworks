'use strict';
const moment = require('moment');
const set = require('lodash/set');
const get = require('lodash/get');
const compact = require('lodash/compact');
const utilCommon = require('water-api/common/utils/common');
const aggregate = require('../../utils/aggregate');
const toObjectId = require('../../utils/to-object-id');

module.exports = function(Client) {
  // * flgGeo = true:
  //    + su dung cho function reportRevenueLoss (bao cao that thu theo dia ly)
  //    => lay tat ca record

  // * flgGeo = false:
  //   + su dung cho function reportRevenueLossClient (bao cao khach hang that thu)
  //   => lay record cua 1 page
  Client.revenueLossClientDetail = async function(flgGeo, filter, res) {
    // console.log('reportRevenueLossClient: ', filter);
    try {
      let { time, flgGetFull } = filter.where;
      let dataCollect = [];

      // Get geo id
      const geoQueries = compact(
        ['provinceId', 'districtId', 'wardId'].map(geoKey => {
          const id = get(filter.where, geoKey, null);
          if (id) {
            return { $eq: [`$${geoKey}`, toObjectId(id)] };
          } else {
            return null;
          }
        }),
      );

      if (!time) {
        res.header('content-range', 0);
        return dataCollect;
      }
      // dinh muc/nguoi
      let quatoWater = await Client.app.models.QuotaWater.findById('quota-water');
      let quotaWaterPerPerson = quatoWater && quatoWater.value ? quatoWater.value : 0;

      let agrFilter = {};
      if (!flgGeo && !flgGetFull) {
        agrFilter = utilCommon.getAgrFilter(filter); // su dung cho list
      }

      let results = [];
      results = await aggregate(Client.app.models.ClientMeterNumber, queryReport(time, geoQueries, agrFilter));

      let clientMeterNumbers = [];
      if (flgGeo === true || flgGetFull === true) {
        clientMeterNumbers = results;
      } else {
        clientMeterNumbers = results[0].data;
      }

      if (!clientMeterNumbers.length) {
        if (res) {
          res.header('content-range', 0);
        }
        return dataCollect;
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
        let totalWaterRevenueLoss = 0;

        // so tien that thu
        let totalInvoiceWaterRevenueLoss = 0;

        if (totalWaterUsage > totalWaterExpected) {
          totalWaterRevenueLoss = totalWaterUsage - totalWaterExpected;

          // so tien truoc thue (du kien)
          // let totalPriceWaterExpected =
          //   totalWaterExpected > 0 ? Client.getPriceDetails(client, formula, totalWaterExpected).totalPrice : 0;

          // so tien sau thue (du kien)
          // let totalInvoiceWaterExpected = totalPriceWaterExpected + (totalPriceWaterExpected * (tax + sewageFee)) / 100;
          let totalInvoiceWaterExpected =
            totalWaterExpected > 0 ? Client.getPriceDetails(client, formula, totalWaterExpected) : 0;

          totalInvoiceWaterRevenueLoss = totalInvoiceUsage - totalInvoiceWaterExpected;
        }

        let record = {};
        record.id = client._id;
        record.code = client.code;
        record.name = client.name;
        record.formattedAddress = client.formattedAddress;
        record.totalWaterRevenueLoss = totalWaterRevenueLoss; // so nuoc that thu
        record.totalInvoiceWaterRevenueLoss = totalInvoiceWaterRevenueLoss; // tien that thu
        record.totalWaterUsage = totalWaterUsage; // so nuoc su dung thuc te
        record.infoClient = client;
        dataCollect.push(record);
      }

      if (flgGeo === true || flgGetFull === true) {
        if (res) {
          res.header('content-range', dataCollect.length);
        }
        return dataCollect;
      }

      // sort field dac biet
      let fieldSortSpec = ['totalWaterRevenueLoss', 'totalInvoiceWaterRevenueLoss'];
      let dataFinal = utilCommon.sortFieldSpec(dataCollect, fieldSortSpec, filter.order);

      res.header('content-range', results[0].info.length === 1 ? results[0].info[0].total : 0);
      return dataFinal;
    } catch (e) {
      throw e;
    }
  };
  Client.reportRevenueLossClient = async function(filter, res) {
    return Client.revenueLossClientDetail(false, filter, res);
  };
  // bao cao khach hang that thu
  Client.remoteMethod('reportRevenueLossClient', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });

  // tinh so tien
  // Client.getPriceDetails = (client, formula, totalWaterUsage) => {
  //   let { familyCount, memberCount } = client;
  //   let { unit, normGroups } = formula;
  //   let result = { totalPrice: 0, priceDetails: [] };

  //   if (!normGroups.length) {
  //     throw new Error('Invalid formula! userId=', client.id);
  //   }

  //   if (totalWaterUsage <= 0) {
  //     return result;
  //   }

  //   if (normGroups.length === 1) {
  //     let totalPrice = totalWaterUsage * normGroups[0].price;
  //     result.priceDetails = [
  //       {
  //         quota: totalWaterUsage,
  //         price: normGroups[0].price,
  //         totalPrice,
  //       },
  //     ];
  //     result.totalPrice = totalPrice;
  //     return result;
  //   }

  //   // multi norms
  //   let totalWaterUsed = totalWaterUsage;

  //   for (let i = 0; i < normGroups.length; i++) {
  //     let norm = normGroups[i];
  //     let price = 0;
  //     let waterNumber = 0;
  //     let quota = 0;
  //     if (norm.to !== -1) {
  //       quota = norm.to - norm.from;
  //       if (unit === 'PERSON') {
  //         // tính định mức theo đầu người
  //         quota *= memberCount;
  //       } else if (unit === 'FAMILY') {
  //         // tính định mức theo hộ
  //         quota *= familyCount;
  //       }
  //       if (totalWaterUsed > quota) {
  //         waterNumber = quota;
  //       } else {
  //         waterNumber = totalWaterUsed;
  //       }
  //     } else {
  //       waterNumber = totalWaterUsed;
  //     }
  //     price = waterNumber * norm.price;
  //     result.priceDetails.push({
  //       quota: waterNumber,
  //       price: norm.price,
  //       totalPrice: price,
  //     });
  //     result.totalPrice += price;
  //     totalWaterUsed -= waterNumber;
  //     if (totalWaterUsed <= 0) {
  //       return result;
  //     }
  //   }

  //   return result;
  // };

  //==================================================
  // NEW: copy va chinh sua tu ham [calculatePrice](file calculate-invoices.js)
  // tinh so tien
  Client.getPriceDetails = (client, formula, totalWaterUsage) => {
    let details = [];
    let from = 0;
    // factor value for every step in fomulas
    if (!formula || !formula.normGroups || formula.normGroups.length <= 0) {
      throw new Error('Wrong formula for client');
    }
    const factor = formula.unit === 'PERSON' ? client.memberCount || 1 : 1;
    let normGroupsIndex = 0;
    let waterFee = 0;
    while (totalWaterUsage > from) {
      const formulaStep = formula.normGroups[normGroupsIndex];
      let stepTo = formulaStep.to > 0 ? formulaStep.to : Number.MAX_SAFE_INTEGER;
      let maxWaterStep = (stepTo - formulaStep.from) * factor;

      let to = Math.min(totalWaterUsage, from + maxWaterStep);
      let waterUsed = to - from;
      let detailStep = {
        waterUsed,
        from,
        to,
        factor,
        name: (normGroupsIndex + 1).toString(),
        price: formulaStep.price,
        toFee: waterUsed * formulaStep.price,
      };
      waterFee += detailStep.toFee;
      details.push(detailStep);
      normGroupsIndex++;
      from = to;
    }
    let sewageFee = parseInt((formula.sewageFee * waterFee) / 100);
    let taxFee = parseInt((formula.tax * waterFee) / 100);
    let totalFee = waterFee + sewageFee + taxFee;
    return totalFee;
  };
  const queryReport = (time, geoQueries, agrFilter) => {
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
      {
        $facet: {
          info: [{ $count: 'total' }],
          data: [{ $skip: null }, { $limit: null }, { $sort: null }],
        },
      },
    ];
    let query = set(rawQuery, '[0].$match.toDate.$lte', endTime);
    query = set(query, '[0].$match.toDate.$gte', startTime);

    if (Object.keys(agrFilter).length > 0) {
      query = set(query, '[7].$facet.data[0].$skip', agrFilter.skip);
      query = set(query, '[7].$facet.data[1].$limit', agrFilter.limit);
      query = set(query, '[7].$facet.data[2].$sort', agrFilter.sort);
    } else {
      query.pop(); // remove object [ $facet ] => get tat ca record
    }

    let clientLookupQuery = get(query, '[3].$lookup.pipeline.[0].$match.$expr.$and');
    clientLookupQuery = clientLookupQuery.concat(geoQueries);
    query = set(query, '[3].$lookup.pipeline.[0].$match.$expr.$and', clientLookupQuery);

    return query;
  };
};
