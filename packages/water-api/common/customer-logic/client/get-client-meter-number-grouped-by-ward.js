'use strict';
const lodash = require('lodash');
const moment = require('moment-timezone');
const aggregate = require('../../utils/aggregate');

module.exports = Client => {
  const queryWaterConsumptionAndClientInvoiceByMonth = async date => {
    const query = [
      {
        $match: {
          // status: 'ACTIVE',
          startMeterDate: { $lte: date.toDate() },
        },
      },
      {
        $lookup: {
          from: 'GeoWard',
          localField: 'wardId',
          foreignField: '_id',
          as: 'ward',
        },
      },
      { $unwind: '$ward' },
      {
        $project: {
          _id: '$ward.name',
          name: '$name',
          monthId: { $concat: [{ $convert: { input: '$_id', to: 'string' } }, moment(date).format('-YYYY-MM')] },
        },
      },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          localField: 'monthId',
          foreignField: '_id',
          as: 'meterNumbers',
        },
      },
      { $unwind: '$meterNumbers' },
      {
        $project: {
          _id: 1,
          name: '$name',
          usage: { $ifNull: ['$meterNumbers.invoiceData.totalWaterUsed', 0] },
        },
      },
      {
        $group: {
          _id: '$_id',
          consumption: { $sum: '$usage' },
          registeredClients: { $sum: 1 },
          invoices: { $sum: { $cond: [{ $ne: ['$usage', 0] }, 1, 0] } },
        },
      },
    ];

    return await aggregate(Client, query);
  };


  const queryWaterConsumptionAndClientInvoiceByMonthQuarter = async date => {
    const query = [
      {
        $match: {
          // status: 'ACTIVE',
          startMeterDate: { $lte: date.toDate() },
        },
      },
      {
        $lookup: {
          from: 'GeoQuarter',
          localField: 'quarterId',
          foreignField: '_id',
          as: 'quarter',
        },
      },
      { $unwind: '$quarter' },
      {
        $project: {
          _id: '$quarter.name',
          name: '$name',
          monthId: { $concat: [{ $convert: { input: '$_id', to: 'string' } }, moment(date).format('-YYYY-MM')] },
        },
      },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          localField: 'monthId',
          foreignField: '_id',
          as: 'meterNumbers',
        },
      },
      { $unwind: '$meterNumbers' },
      {
        $project: {
          _id: 1,
          name: '$name',
          usage: { $ifNull: ['$meterNumbers.invoiceData.totalWaterUsed', 0] },
        },
      },
      {
        $group: {
          _id: '$_id',
          consumption: { $sum: '$usage' },
          registeredClients: { $sum: 1 },
          invoices: { $sum: { $cond: [{ $ne: ['$usage', 0] }, 1, 0] } },
        },
      },
    ];

    return await aggregate(Client, query);
  };



  // const queryRegisteredClientByMonth = async date => {
  //   const query = [
  //     {
  //       $match: {
  //         status: 'ACTIVE',
  //         startMeterDate: { $lte: date.startOf('month').toDate() },
  //       },
  //     },
  //     { $lookup: { from: 'GeoWard', localField: 'wardId', foreignField: '_id', as: 'wards' } },
  //     { $unwind: { path: '$wards' } },
  //     { $project: { _id: '$wards.name' } },
  //     { $group: { _id: '$_id', registeredClients: { $sum: 1 } } },
  //   ];

  //   return await aggregate(Client, query);
  // };

  Client.getClientMeterNumberGroupedByWard = async date => {
    const thisMonth = moment(date).endOf('month');
    const lastMonth = moment(date)
      .subtract(1, 'months')
      .endOf('month');

    let endGameObject = {};

    const lastMonthWaterConsumptionAndClientInvoice = await queryWaterConsumptionAndClientInvoiceByMonth(lastMonth);

    for (let datum of lastMonthWaterConsumptionAndClientInvoice) {
      const ward = lodash.get(datum, '_id');
      if (!lodash.has(endGameObject, ward)) {
        lodash.set(endGameObject, ward, {});
      }
      const previousMeterNumber = lodash.get(datum, 'consumption', 0);
      const totalLastMonthWaterUsedClient = lodash.get(datum, 'invoices', 0);
      lodash.set(endGameObject, `${ward}.previousMeterNumber`, previousMeterNumber);
      lodash.set(endGameObject, `${ward}.totalLastMonthWaterUsedClient`, totalLastMonthWaterUsedClient);

      const totalLastMonthClient = lodash.get(datum, 'registeredClients', 0);
      lodash.set(endGameObject, `${ward}.totalLastMonthClient`, totalLastMonthClient);
    }

    const thisMonthWaterConsumptionAndClientInvoice = await queryWaterConsumptionAndClientInvoiceByMonth(thisMonth);

    for (let datum of thisMonthWaterConsumptionAndClientInvoice) {
      const ward = lodash.get(datum, '_id');
      if (!lodash.has(endGameObject, ward)) {
        lodash.set(endGameObject, ward, {});
      }
      const currentMeterNumber = lodash.get(datum, 'consumption', 0);
      const totalWaterUsedClient = lodash.get(datum, 'invoices', 0);
      lodash.set(endGameObject, `${ward}.currentMeterNumber`, currentMeterNumber);
      lodash.set(endGameObject, `${ward}.totalWaterUsedClient`, totalWaterUsedClient);

      const totalClient = lodash.get(datum, 'registeredClients', 0);
      lodash.set(endGameObject, `${ward}.totalClient`, totalClient);
    }

    // const lastMonthRegisteredClient = await queryRegisteredClientByMonth(lastMonth);
    // for (let datum of lastMonthRegisteredClient) {
    //   const ward = lodash.get(datum, '_id');
    //   if (!lodash.has(endGameObject, ward)) {
    //     lodash.set(endGameObject, ward, {});
    //   }
    // }

    // let thisMonthRegisteredClient = await queryRegisteredClientByMonth(thisMonth);
    // for (let datum of thisMonthRegisteredClient) {
    //   const ward = lodash.get(datum, '_id');
    //   if (!lodash.has(endGameObject, ward)) {
    //     lodash.set(endGameObject, ward, {});
    //   }
    // }

    endGameObject = lodash.mapValues(endGameObject, value => {
      if (!lodash.has(value, 'previousMeterNumber')) {
        lodash.set(value, 'previousMeterNumber', 0);
      }
      if (!lodash.has(value, 'totalLastMonthWaterUsedClient')) {
        lodash.set(value, 'totalLastMonthWaterUsedClient', 0);
      }
      if (!lodash.has(value, 'currentMeterNumber')) {
        lodash.set(value, 'currentMeterNumber', 0);
      }
      if (!lodash.has(value, 'totalLastMonthClient')) {
        lodash.set(value, 'totalLastMonthClient', 0);
      }
      if (!lodash.has(value, 'totalClient')) {
        lodash.set(value, 'totalClient', 0);
      }
      if (!lodash.has(value, 'totalWaterUsedClient')) {
        lodash.set(value, 'totalWaterUsedClient', 0);
      }
      return value;
    });

    return endGameObject;
  };


  Client.getClientMeterNumberGroupedByQuarter = async date => {
    const thisMonth = moment(date).endOf('month');
    const lastMonth = moment(date)
      .subtract(1, 'months')
      .endOf('month');

    let endGameObject = {};

    const lastMonthWaterConsumptionAndClientInvoice = await queryWaterConsumptionAndClientInvoiceByMonthQuarter(lastMonth);

    for (let datum of lastMonthWaterConsumptionAndClientInvoice) {
      const ward = lodash.get(datum, '_id');
      if (!lodash.has(endGameObject, ward)) {
        lodash.set(endGameObject, ward, {});
      }
      const previousMeterNumber = lodash.get(datum, 'consumption', 0);
      const totalLastMonthWaterUsedClient = lodash.get(datum, 'invoices', 0);
      lodash.set(endGameObject, `${ward}.previousMeterNumber`, previousMeterNumber);
      lodash.set(endGameObject, `${ward}.totalLastMonthWaterUsedClient`, totalLastMonthWaterUsedClient);

      const totalLastMonthClient = lodash.get(datum, 'registeredClients', 0);
      lodash.set(endGameObject, `${ward}.totalLastMonthClient`, totalLastMonthClient);
    }

    const thisMonthWaterConsumptionAndClientInvoice = await queryWaterConsumptionAndClientInvoiceByMonth(thisMonth);

    for (let datum of thisMonthWaterConsumptionAndClientInvoice) {
      const ward = lodash.get(datum, '_id');
      if (!lodash.has(endGameObject, ward)) {
        lodash.set(endGameObject, ward, {});
      }
      const currentMeterNumber = lodash.get(datum, 'consumption', 0);
      const totalWaterUsedClient = lodash.get(datum, 'invoices', 0);
      lodash.set(endGameObject, `${ward}.currentMeterNumber`, currentMeterNumber);
      lodash.set(endGameObject, `${ward}.totalWaterUsedClient`, totalWaterUsedClient);

      const totalClient = lodash.get(datum, 'registeredClients', 0);
      lodash.set(endGameObject, `${ward}.totalClient`, totalClient);
    }

    // const lastMonthRegisteredClient = await queryRegisteredClientByMonth(lastMonth);
    // for (let datum of lastMonthRegisteredClient) {
    //   const ward = lodash.get(datum, '_id');
    //   if (!lodash.has(endGameObject, ward)) {
    //     lodash.set(endGameObject, ward, {});
    //   }
    // }

    // let thisMonthRegisteredClient = await queryRegisteredClientByMonth(thisMonth);
    // for (let datum of thisMonthRegisteredClient) {
    //   const ward = lodash.get(datum, '_id');
    //   if (!lodash.has(endGameObject, ward)) {
    //     lodash.set(endGameObject, ward, {});
    //   }
    // }

    endGameObject = lodash.mapValues(endGameObject, value => {
      if (!lodash.has(value, 'previousMeterNumber')) {
        lodash.set(value, 'previousMeterNumber', 0);
      }
      if (!lodash.has(value, 'totalLastMonthWaterUsedClient')) {
        lodash.set(value, 'totalLastMonthWaterUsedClient', 0);
      }
      if (!lodash.has(value, 'currentMeterNumber')) {
        lodash.set(value, 'currentMeterNumber', 0);
      }
      if (!lodash.has(value, 'totalLastMonthClient')) {
        lodash.set(value, 'totalLastMonthClient', 0);
      }
      if (!lodash.has(value, 'totalClient')) {
        lodash.set(value, 'totalClient', 0);
      }
      if (!lodash.has(value, 'totalWaterUsedClient')) {
        lodash.set(value, 'totalWaterUsedClient', 0);
      }
      return value;
    });

    return endGameObject;
  };

  Client.remoteMethod('getClientMeterNumberGroupedByWard', {
    accepts: { arg: 'date', type: 'date' },
    http: { verb: 'get' },
    returns: { arg: 'grouped', type: 'object', root: true },
  });
  Client.remoteMethod('getClientMeterNumberGroupedByQuarter', {
    accepts: { arg: 'date', type: 'date' },
    http: { verb: 'get' },
    returns: { arg: 'grouped', type: 'object', root: true },
  });
};
