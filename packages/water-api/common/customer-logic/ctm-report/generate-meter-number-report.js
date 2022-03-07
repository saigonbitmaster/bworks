// const fs = require('fs');
// const handlebars = require('handlebars');
const moment = require('moment');
const get = require('lodash/get');
const flatten = require('lodash/flatten');
const aggregate = require('../../utils/aggregate');

module.exports = CtmReport => {
  CtmReport.getMonthlyMeterNumberData = async date => {
    // Prepare the aggregate query
    const aggregateQuery = [
      { $addFields: { toDateMonth: { $month: '$toDate' }, toDateYear: { $year: '$toDate' } } },
      { $match: { toDateMonth: { $eq: date.month() + 1 }, toDateYear: { $eq: date.year() } } },
      { $project: { clientId: 1, currentNumber: 1, previousNumber: 1, creatorId: 1 } },
      { $lookup: { from: 'Client', localField: 'clientId', foreignField: '_id', as: 'client' } },
      { $unwind: { path: '$client' } },
      {
        $project: {
          name: '$client.name',
          code: '$client.code',
          contractNo: '$client.contractNo',
          address: '$client.formattedAddress',
          currentNumber: 1,
          consumption: { $subtract: ['$currentNumber', '$previousNumber'] },
          creatorId: 1,
        },
      },
      { $group: { _id: '$creatorId', clients: { $push: '$$ROOT' } } },
    ];

    // Run the query
    // Get client's meter number grouped by meter reader ID
    const meterNumbersGroupedByMeterReaderID = await aggregate(CtmReport.app.models.ClientMeterNumber, aggregateQuery);

    // Get all application users
    const appUsers = await CtmReport.app.models.AppUser.find({}).then(appUsers =>
      appUsers.map(appUser => appUser.toJSON()),
    );

    // Data for template
    const data = {
      date: {
        month: date.month() + 1,
        year: date.year(),
      },
      root: [],
    };

    // Group the users and recently grouped meter numbers by the ID
    for (let index = 0; index < appUsers.length; index++) {
      const appUserId = get(appUsers[index], 'id');
      const appUserFullName = get(appUsers[index], 'fullName');
      const filteredMeterNumbers = flatten(
        meterNumbersGroupedByMeterReaderID
          .filter(({ _id }) => _id.toString() === appUserId.toString())
          .map(({ clients }) => clients),
      );
      const individualData = {
        index: `${index + 1}`,
        name: appUserFullName,
        totalMeters: `${filteredMeterNumbers.length}`,
        totalConsumption: `${filteredMeterNumbers.reduce((acc, { currentNumber }) => acc + currentNumber, 0)}`,
        clients: filteredMeterNumbers.map(
          ({ name, code, contractNo, address, currentNumber, consumption }, clientIndex) => ({
            index: `${index + 1}.${clientIndex + 1}`,
            code,
            name,
            contractNo,
            address,
            consumption: `${consumption}`,
            terminalMeterNumber: `${currentNumber}`,
          }),
        ),
      };

      if (individualData.clients.length !== 0) {
        data.root.push(individualData);
      }
    }

    return data;
  };

  CtmReport.generateMonthlyMeterNumberReport = (templateId, date, callback) => {
    // Parse the date to correct Moment format
    const parsedDate = moment(date, 'ddd MMM DD YYYY HH:mm:ss Z');
    // Save date as metadata
    CtmReport.cacheMetadata('', { date: { month: parsedDate.month() + 1, year: parsedDate.year() } })
      .then(
        // Get monthly meter number data
        metadataId => Promise.all([metadataId, CtmReport.getMonthlyMeterNumberData(parsedDate)]),
      )
      .then(([metadataId, data]) =>
        // Call `generateReport` method from 'CtmReport' to generate PDF version of compiled template
        CtmReport.generateReport(templateId, metadataId, data),
      )
      .then(reportName =>
        Promise.all([reportName, CtmReport.app.models.CtmReportFile.downloadStream('CtmReportFiles', reportName)]),
      )
      .then(([reportName, reportStream]) => {
        // Prepare the headers
        const contentType = 'application/pdf';
        const contentDisposition = `inline; filename=${reportName}`;
        // Return the stream
        return callback(null, reportStream, contentType, contentDisposition);
      })
      .catch(err => callback(err));
  };
  CtmReport.remoteMethod('generateMonthlyMeterNumberReport', {
    accepts: [
      { arg: 'templateId', type: 'string' },
      { arg: 'date', type: 'string' },
    ],
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
