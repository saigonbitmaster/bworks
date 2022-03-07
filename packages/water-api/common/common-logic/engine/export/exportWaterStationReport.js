'use strict';
const path = require('path');
const util = require('util');
const lodash = require('lodash');
const mapLimit = util.promisify(require('async/mapLimit'));
const moment = require('moment');
const createError = require('http-errors');
const createWaterStationReport = require('./createWaterStationReport');

const fillUntilReachLimit = (array, placeholder, limit) => {
  const arrayLength = array.length;
  if (arrayLength >= limit) {
    return array;
  } else {
    const newArray = [...array];
    const sizeDifference = Math.abs(arrayLength - limit);
    for (let step = 0; step < sizeDifference; step++) {
      newArray.push(placeholder);
    }
    return newArray;
  }
};

module.exports = ExcelUtils => {
  ExcelUtils.getWaterStationData = async date => {
    // Get the models
    const GeoGroup = ExcelUtils.app.models.GeoGroup;
    const Client = ExcelUtils.app.models.Client;

    const geoGroups = await GeoGroup.find();
    if (!geoGroups || geoGroups.length === 0) {
      throw createError(500, 'error.NON_EXISTENT_DATA');
    }
    // Get associated wards
    let [statistics, geoGroupsWithWards] = await Promise.all([
      Client.getClientMeterNumberGroupedByQuarter(date),
      mapLimit(geoGroups, 10, async geoGroup => {
        const quarters = await util.promisify(geoGroup.geoQuarters)();
        return { name: geoGroup.toJSON().name, wards: quarters.map(ward => ward.toJSON()) };
      }),
    ]);

    let rowIndex = 0;

    const waterStationData = geoGroupsWithWards
      .map(({ name, wards }) => {
        let controlledWards = wards
          .filter(ward => lodash.has(statistics, ward.name))
          .map(ward => ({ name: ward.name, code: ward.code, ...lodash.get(statistics, ward.name) }));
        let geoGroupData = [];
        if (controlledWards.length > 0) {
          const geoGroupAggregationData = controlledWards.reduce(
            (acc, val) => {
              const {
                previousMeterNumber,
                currentMeterNumber,
                totalLastMonthClient,
                totalClient,
                totalLastMonthWaterUsedClient,
                totalWaterUsedClient,
              } = val;
              acc.previousMeterNumber += previousMeterNumber;
              acc.currentMeterNumber += currentMeterNumber;
              acc.totalLastMonthClient += totalLastMonthClient;
              acc.totalClient += totalClient;
              acc.totalLastMonthWaterUsedClient += totalLastMonthWaterUsedClient;
              acc.totalWaterUsedClient += totalWaterUsedClient;
              return acc;
            },
            {
              previousMeterNumber: 0,
              currentMeterNumber: 0,
              ratioMeterNumber: '',
              totalLastMonthClient: 0,
              totalClient: 0,
              ratioClient: '',
              totalLastMonthWaterUsedClient: 0,
              totalWaterUsedClient: 0,
              ratioWaterUsedClient: '',
            },
          );

          geoGroupAggregationData.ratioMeterNumber =
            geoGroupAggregationData.previousMeterNumber !== 0
              ? parseFloat(
                  (geoGroupAggregationData.currentMeterNumber / geoGroupAggregationData.previousMeterNumber) * 100,
                ).toFixed(2)
              : geoGroupAggregationData.ratioMeterNumber;
          geoGroupAggregationData.ratioClient =
            geoGroupAggregationData.totalLastMonthClient !== 0
              ? parseFloat(
                  (geoGroupAggregationData.totalClient / geoGroupAggregationData.totalLastMonthClient) * 100,
                ).toFixed(2)
              : geoGroupAggregationData.ratioClient;
          geoGroupAggregationData.ratioWaterUsedClient =
            geoGroupAggregationData.totalLastMonthWaterUsedClient !== 0
              ? parseFloat(
                  (geoGroupAggregationData.totalWaterUsedClient /
                    geoGroupAggregationData.totalLastMonthWaterUsedClient) *
                    100,
                ).toFixed(2)
              : geoGroupAggregationData.ratioWaterUsedClient;

          geoGroupData.push(++rowIndex);
          geoGroupData.push(name);
          geoGroupData = geoGroupData.concat(lodash.values(geoGroupAggregationData));
          controlledWards = controlledWards.map((controlledWard, subIndex) => {
            const {
              previousMeterNumber,
              currentMeterNumber,
              totalLastMonthClient,
              totalClient,
              totalLastMonthWaterUsedClient,
              totalWaterUsedClient,
            } = controlledWard;
            return [
              `${rowIndex}.${subIndex + 1}`,
              controlledWard.code,
              controlledWard.name,
              previousMeterNumber,
              currentMeterNumber,
              previousMeterNumber === 0 ? '' : parseFloat((currentMeterNumber / previousMeterNumber) * 100).toFixed(2),
              totalLastMonthClient,
              totalClient,
              totalLastMonthClient === 0 ? '' : parseFloat((totalClient / totalLastMonthClient) * 100).toFixed(2),
              totalLastMonthWaterUsedClient,
              totalWaterUsedClient,
              totalLastMonthWaterUsedClient === 0
                ? ''
                : parseFloat((totalWaterUsedClient / totalLastMonthWaterUsedClient) * 100).toFixed(2),
            ];
          });
        }
        return lodash.concat([geoGroupData], [...controlledWards]);
      })
      .reduce((acc, val) => [...acc, ...val], [])
      .filter(row => !lodash.isEmpty(row))
      .map(datum => {
        // Insert a blank cell for ward row
        // Insert two blank cells at index 2 and 3
        if (datum[0].toString().lastIndexOf('.') !== -1) {
          datum = [datum[0], '', ...datum.slice(1)];
        } else {
          datum = [...datum.slice(0, 2), '', '', ...datum.slice(2)];
        }
        // Fill empty cells
        return fillUntilReachLimit(datum, ' ', 13);
      });

    // Compute sum of data in all water stations
    const totalSum = waterStationData
      .filter(([index]) => index.toString().lastIndexOf('.') !== -1)
      .reduce(
        (acc, val) => {
          const [
            previousMeterNumber = 0,
            currentMeterNumber = 0,
            totalLastMonthClient = 0,
            totalClient = 0,
            totalLastMonthWaterUsedClient = 0,
            totalWaterUsedClient = 0,
          ] = [val[4], val[5], val[7], val[8], val[10], val[11]];
          acc.previousMeterNumber += Number.isInteger(previousMeterNumber) ? previousMeterNumber : 0;
          acc.currentMeterNumber += Number.isInteger(currentMeterNumber) ? currentMeterNumber : 0;
          acc.totalLastMonthClient += Number.isInteger(totalLastMonthClient) ? totalLastMonthClient : 0;
          acc.totalClient += Number.isInteger(totalClient) ? totalClient : 0;
          acc.totalLastMonthWaterUsedClient += Number.isInteger(totalLastMonthWaterUsedClient)
            ? totalLastMonthWaterUsedClient
            : 0;
          acc.totalWaterUsedClient += Number.isInteger(totalWaterUsedClient) ? totalWaterUsedClient : 0;
          return acc;
        },
        {
          previousMeterNumber: 0,
          currentMeterNumber: 0,
          ratioMeterNumber: '',
          totalLastMonthClient: 0,
          totalClient: 0,
          ratioClient: '',
          totalLastMonthWaterUsedClient: 0,
          totalWaterUsedClient: 0,
          ratioWaterUsedClient: '',
        },
      );

    if (totalSum.previousMeterNumber !== 0) {
      totalSum.ratioMeterNumber = (
        parseFloat(totalSum.currentMeterNumber / totalSum.previousMeterNumber) * 100
      ).toFixed(2);
    }

    if (totalSum.totalLastMonthClient !== 0) {
      totalSum.ratioClient = (parseFloat(totalSum.totalClient / totalSum.totalLastMonthClient) * 100).toFixed(2);
    }
    if (totalSum.totalLastMonthWaterUsedClient !== 0) {
      totalSum.ratioWaterUsedClient = (
        parseFloat(totalSum.totalWaterUsedClient / totalSum.totalLastMonthWaterUsedClient) * 100
      ).toFixed(2);
    }

    return lodash.concat(waterStationData, totalSum);
  };

  ExcelUtils.remoteMethod('getWaterStationData', {
    accepts: { arg: 'date', type: 'string' },
    http: { verb: 'get' },
    returns: { arg: 'waterStationData', type: 'array' },
  });

  ExcelUtils.exportWaterStationReport = (date, callback) => {
    // Get the template's path
    const generatedDirectoryPath = ExcelUtils.app.dirs.tempSheet.generated;
    const generatedFileName = `generated-${moment().valueOf()}-1`;
    const generatedFilePath = path.join(generatedDirectoryPath, generatedFileName);

    ExcelUtils.getWaterStationData(date)
      // Create the report
      .then(finalData => createWaterStationReport(finalData, { date }))
      .then(waterStationBuffer => {
        const Readable = require('stream').Readable;
        const waterStationReadStream = new Readable();
        waterStationReadStream.push(waterStationBuffer);
        waterStationReadStream.push(null);
        const contentType = 'application/vnd.ms-excel';
        const contentDisposition = `inline; filename=${path.basename(generatedFilePath) + '.xlsx'}`;
        return callback(null, waterStationReadStream, contentType, contentDisposition);
      })
      .catch(err => callback(err));
  };

  ExcelUtils.remoteMethod('exportWaterStationReport', {
    isStatic: true,
    accepts: { arg: 'date', type: 'string' },
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
