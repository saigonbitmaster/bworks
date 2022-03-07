'use strict';
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-timezone');
const createError = require('http-errors');
const aggregate = require('../../utils/aggregate');
const common = require('../../utils/common');
module.exports = function(Dma) {
  const getDmaGroupLevel = async dmaId => {
    const matchCondition = {};
    if (dmaId && dmaId !== 'AllDma') {
      matchCondition._id = new ObjectID(dmaId);
    } else {
      matchCondition.parentDmaId = null;
    }
    return await aggregate(Dma, [
      { $match: matchCondition },
      {
        $lookup: {
          from: 'Dma',
          localField: '_id',
          foreignField: 'parentDmaId',
          as: 'child',
        },
      },
      { $unwind: { path: '$child', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          mainLevel: { $first: '$level' },
          main: { $addToSet: '$_id' },
          subLevel: { $first: '$child.level' },
          sub: { $addToSet: '$child._id' },
        },
      },
    ]);
  };

  // lay thong tin suc sa tren dma tu model WaterMaintenance
  // output:
  // {
  //   "id" : {
  //     "month" : 2,
  //     "year" : 2019,
  //   },
  //   "mainternance" : 1122, // gia tri suc sa
  //   "time" : ISODate("2019-02-01T07:00:00.000+07:00") // thang suc sa
  // }
  const statisticMaintance = async (mainIds, subIds, timeRange, flgIncludeChild) => {
    const timeFrom = moment(timeRange.from)
      .startOf('month')
      .toDate();
    const timeTo = moment(timeRange.to)
      .endOf('month')
      .toDate();
    if (flgIncludeChild) {
      for (let i = 0; i < subIds.length; i++) {
        mainIds.push(subIds[i]);
      }
    }
    const pipeline = [
      {
        $facet: {
          main: [
            {
              $match: {
                dmaId: { $in: mainIds },
                date: {
                  $gte: timeFrom,
                  $lte: timeTo,
                },
              },
            },
            {
              $group: {
                _id: { month: { $month: '$date' }, year: { $year: '$date' } },
                mainternance: { $sum: '$value' },
              },
            },
          ],
        },
      },

      { $unwind: '$main' },
      {
        $addFields: {
          month: { $convert: { input: '$main._id.month', to: 'string' } },
          year: { $convert: { input: '$main._id.year', to: 'string' } },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$main._id',
          mainternance: '$main.mainternance',
          date: { $concat: ['$year', '-', '$month', '-', '1'] },
        },
      },
      {
        $addFields: {
          time: { $convert: { input: '$date', to: 'date' } },
        },
      },
      {
        $project: {
          date: 0,
        },
      },
    ];
    let result = await aggregate(Dma.app.models.WaterMaintenance, pipeline);
    return result;
  };
  const statisticLocalDma = async (mainIds, subIds, timeRange, flgIncludeChild) => {
    const timeFrom = moment(timeRange.from)
      .startOf('month')
      .toDate();
    const timeTo = moment(timeRange.to)
      .endOf('month')
      .toDate();
    const pipeline = [
      {
        $facet: {
          main: [
            {
              $match: {
                dmaId: { $in: mainIds },
                logTime: {
                  $gte: timeFrom,
                  $lte: timeTo,
                },
              },
            },
            {
              $group: {
                _id: '$logTime',
                mainConsumption: { $sum: '$consumption' },
              },
            },
            { $addFields: { mainLevel: 1 } },
          ],
          sub: [
            {
              $match: {
                dmaId: { $in: subIds },
                logTime: {
                  $gte: timeFrom,
                  $lte: timeTo,
                },
              },
            },
            {
              $group: {
                _id: '$logTime',
                subConsumption: { $sum: '$consumption' },
              },
            },
            { $addFields: { subLevel: 2 } },
          ],
        },
      },
      {
        $addFields: {
          statistic: { $concatArrays: ['$main', '$sub'] },
        },
      },
      { $project: { main: 0, sub: 0 } },
      { $unwind: '$statistic' },
      {
        $group: {
          _id: '$statistic._id',
          mainConsumption: { $sum: '$statistic.mainConsumption' },
          subConsumption: { $sum: '$statistic.subConsumption' },
        },
      },
      {
        $addFields: {
          leak: {
            $cond: {
              if: { $gt: ['$subConsumption', 0] },
              then: { $subtract: ['$mainConsumption', '$subConsumption'] },
              else: 0,
            },
          },
          mainternance: 0, //{ $subtract: ['$mainConsumption', '$subConsumption'] },
          time: '$_id',
          id: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      { $sort: { time: 1 } },
    ];
    let logs = await aggregate(Dma.app.models.LogStatisticDmaMonth, pipeline);

    // suc sa
    let maintances = await statisticMaintance(mainIds, subIds, timeRange, flgIncludeChild);
    /// console.log(maintances);

    // join log & maintance
    for (let i = 0; i < logs.length; i++) {
      let itemLog = logs[i];
      for (let k = 0; k < maintances.length; k++) {
        let itemMaintance = maintances[k];
        if (
          moment(itemLog.time).month() === moment(itemMaintance.time).month() &&
          moment(itemLog.time).year() === moment(itemMaintance.time).year()
        ) {
          // console.log('itemLog', itemLog);
          // console.log('itemMaintance', itemMaintance);
          logs[i].mainternance = itemMaintance.mainternance;

          //update leak again
          logs[i].leak = logs[i].leak - logs[i].mainternance;
          break;
        }
      }
    }
    return logs;
  };

  // Not use
  // eslint-disable-next-line
  const queryClient = (idDmas, from, to) => {
    // console.log('iddmas0', idDmas);
    const query = [
      {
        $match: {
          dmaId: { $in: idDmas },
        },
      },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          let: { clientId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$clientId', '$$clientId'] },
                    { $gte: ['$toDate', moment(from).toDate()] },
                    { $lte: ['$toDate', moment(to).toDate()] },
                  ],
                },
              },
            },
            { $replaceRoot: { newRoot: { $ifNull: ['$invoiceData', {}] } } },
            {
              $project: {
                oldMeterNumber: 1,
                newMeterNumber: 1,
                totalWaterUsed: 1,
              },
            },
          ],
          as: 'term',
        },
      },
      { $unwind: '$term' },
      {
        $project: {
          _id: 1,
          oldMeterNumber: '$term.oldMeterNumber',
          newMeterNumber: '$term.newMeterNumber',
          totalWaterUse: '$term.totalWaterUsed',
        },
      },
      {
        $group: {
          _id: null,
          totalWaterUsed: { $sum: '$totalWaterUse' },
        },
      },
      { $addFields: { time: moment(from).toDate() } },
    ];
    return query;
  };
  const queryClientMeterNumber = (idDmas, from, to) => {
    const query = [
      {
        $match: {
          $expr: {
            $and: [
              { $gte: ['$toDate', moment(from).toDate()] },
              { $lte: ['$toDate', moment(to).toDate()] },
              { $in: ['$invoiceData.client.dmaId', idDmas] },
            ],
          },
        },
      },
      { $replaceRoot: { newRoot: { $ifNull: ['$invoiceData', {}] } } },
      {
        $project: {
          oldMeterNumber: 1,
          newMeterNumber: 1,
          totalWaterUsed: 1,
        },
      },

      {
        $group: {
          _id: null,
          totalWaterUsed: { $sum: '$totalWaterUsed' },
        },
      },
    ];
    return query;
  };

  // lay thong tin su dung nuoc cua khach hang
  const getClient = async (idDmas, timeRange) => {
    const timeFrom = moment(timeRange.from)
      .startOf('month')
      .toDate();
    const timeTo = moment(timeRange.to)
      .endOf('month')
      .toDate();

    let result = [];

    for (
      let tmpDate = moment(timeFrom).startOf('month');
      tmpDate <= moment(timeTo).startOf('month');
      tmpDate = moment(tmpDate).add(1, 'M')
    ) {
      let start = moment(tmpDate).startOf('month');
      let end = moment(tmpDate).endOf('month');
      let query = queryClientMeterNumber(idDmas, start, end);
      let clients = await aggregate(Dma.app.models.ClientMeterNumber, query);
      let tmp = {
        time: tmpDate,
        totalWaterUsed: clients && clients.length === 1 ? clients[0].totalWaterUsed : 0,
      };
      result.push(tmp);
    }
    return result;
  };
  const calculateWaterClient = async (result, idDmas, timeRange) => {
    let clients = await getClient(idDmas, timeRange);
    for (let i = 0; i < result.length; i++) {
      let itemResult = result[i];
      for (let k = 0; k < clients.length; k++) {
        let itemClient = clients[k];
        if (
          moment(itemResult.time).month() === moment(itemClient.time).month() &&
          moment(itemResult.time).year() === moment(itemClient.time).year()
        ) {
          result[i].subConsumption = itemClient.totalWaterUsed;
          result[i].leak = result[i].mainConsumption - result[i].subConsumption - result[i].mainternance;
          break;
        }
      }
    }
  };
  // Note: CO su dung chung cho API mapWaterLoss
  Dma.statisticQuantityByMonth = async (dmaId, timeRange, flgIncludeChild = false) => {
    // console.log('======start: ', moment().format('DD/MM/YYYY HH:mm:ss'));
    if (!timeRange || !timeRange.from || !timeRange.to) {
      throw createError(400, 'error.INVALID_PARAMS');
    } else {
      timeRange = {
        from: moment(timeRange.from).toDate(),
        to: moment(timeRange.to).toDate(),
      };
    }
    try {
      let dmaGroupLevel = await getDmaGroupLevel(dmaId);
      let result = [];
      if (dmaGroupLevel && dmaGroupLevel[0]) {
        dmaGroupLevel = dmaGroupLevel[0];
        result = await statisticLocalDma(dmaGroupLevel.main, dmaGroupLevel.sub, timeRange, flgIncludeChild);
      }

      // case: bao gom vung con
      if (flgIncludeChild) {
        let idDmas = [];

        // cap cuoi cung
        if (dmaGroupLevel.subLevel === null) {
          idDmas = common.convertObjectId(dmaGroupLevel.main);
        } else {
          // cap cha
          idDmas = common.convertObjectId(dmaGroupLevel.sub);
        }
        await calculateWaterClient(result, idDmas, timeRange);
        // console.log('======end: ', moment().format('DD/MM/YYYY HH:mm:ss'));
        return result;
      } else {
        // case: khong bao gom vung con

        // cap cuoi cung
        if (dmaGroupLevel.subLevel === null) {
          let idDmas = common.convertObjectId(dmaGroupLevel.main);
          await calculateWaterClient(result, idDmas, timeRange);
          return result;
        } else {
          return result;
        }
      }
    } catch (error) {
      // console.log(error);
    }
  };
  // bao cao san luong/that thoat(chart)
  Dma.remoteMethod('statisticQuantityByMonth', {
    accepts: [
      { arg: 'dmaId', type: 'string' },
      { arg: 'timeRange', type: 'object' },
      { arg: 'flgIncludeChild', type: 'boolean' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', root: 'true', type: 'object' },
  });
};
