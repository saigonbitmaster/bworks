'use strict';
const fs = require('fs');
const moment = require('moment-timezone');
const numberToWords = require('ra-loopback3/server/utils/number-to-word');
const aggregate = require('../../utils/aggregate');
const getRawWhere = require('../../utils/get-raw-where');
module.exports = ClientMeterNumber => {
  ClientMeterNumber.remoteMethod('exportInvoices', {
    http: { verb: 'get' },
    accepts: [
      { arg: 'filterValues', type: 'object' },
      { arg: 'selectedIds', type: ['string'] },
    ],
    returns: [{ arg: 'data', type: 'any', root: true }],
  });

  ClientMeterNumber.exportInvoices = async (filterValues, selectedIds) => {
    // console.log('>>>filterValues', filterValues);
    // console.log('start exportInvoices => count client: ', selectedIds.length);
    let clientFilters = getCondition(filterValues, selectedIds);
    let termMonthFormat = moment(clientFilters.termInvoice.$gte).format('-YYYY-MM');
    let aggQuery = getAggQuery(clientFilters, termMonthFormat);

    let dataInvoice = await aggregate(ClientMeterNumber.app.models.Client, aggQuery);
    // console.log('count data: ', dataInvoice.length);
    if (dataInvoice && dataInvoice.length) {
      // let pureCompany = await ClientMeterNumber.app.models.CtmCompany.findOne({});
      let companies = await ClientMeterNumber.app.models.CtmCompany.find({ where: { active: true } });
      if (!companies || companies.length > 1) {
        return '';
      }

      // let company = pureCompany.__data;
      let company = companies[0].__data;
      let invoices = ClientMeterNumber.handleFormatInvoices(dataInvoice, company);
      if (!invoices.length) {
        return '';
      }
      let data = { invoices };
      // console.log('count invoices: ', invoices.length);
      let urlInvoice = await ClientMeterNumber.getPathByInvoiceData(ClientMeterNumber, data);
      // console.log('end exportInvoices => urlInvoice:', urlInvoice);
      return urlInvoice;
    }
    return '';
  };

  const uploadToAws = async (filePath, fileName) => {
    return new Promise((resolve, reject) => {
      let bucket = ClientMeterNumber.app.models.CtmFile.dataSource.settings.bucket;
      let writeStream = ClientMeterNumber.app.models.CtmFile.uploadStream(bucket, `CtmFiles/${fileName}`, {
        prefix: 'CtmFile',
        // acl: 'public-read',
        lastModified: new Date(),
        expires: moment()
          .add(1, 'year')
          .toDate(),
      });
      writeStream.on('success', data => {
        resolve(data.location);
      });
      writeStream.on('error', error => reject(error));
      let fileStream = fs.createReadStream(filePath);
      fileStream.pipe(writeStream);
    });
  };

  // su dung CHUNG cho function : exportInvoices va exportInvoiceByGeo
  ClientMeterNumber.getPathByInvoiceData = async (ClientMeterNumber, data) => {
    let fileName = await ClientMeterNumber.app.models.ReportEngine.generateInvoiceInPDF(
      data,
      'ClientInvoiceDataOnly',
      'CtmTemplate',
      'CtmFile',
    );

    // ClientMeterNumber.app.get('S3').invoiceFileExpiresIn
    // push to amazone
    let tempReport = ClientMeterNumber.app.dirs.tempReport;
    let filePath = `${tempReport}/${fileName}`;
    await uploadToAws(filePath, fileName);

    return fileName;
  };

  // su dung CHUNG cho function : exportInvoices va exportInvoiceByGeo
  // eslint-disable-next-line no-unused-vars
  ClientMeterNumber.handleFormatInvoices = (data, company, flgByGeo = false) => {
    let invoices = [];

    // OLD
    // let exportDateNum = ClientMeterNumber.app.get('invoiceExportDate') || 2;

    let totalRecord = data.length;
    data.map((record, index) => {
      // if (flgByGeo) {
      if (!record.invoiceData || !record.invoiceData.details || !record.invoiceData.details.length) {
        return null;
      }
      // }
      let { fromDate, toDate, invoiceExportDate } = record.invoiceData;
      invoiceExportDate = invoiceExportDate ? invoiceExportDate : new Date();
      // OLd
      // let termDate = moment(toDate)
      //   .add(1, 'month')
      //   .date(exportDateNum);

      // NEW
      let termDate = moment(toDate);

      let term = termDate.format('MM/YYYY');
      let date = termDate.date();
      let month = termDate.month() + 1;
      let year = termDate.year();

      fromDate = moment(fromDate).format('L');
      toDate = moment(toDate).format('L');

      let feeToText = numberToWords(record.invoiceData.totalFee, { postfix: 'đồng' });
      invoices.push({
        ...record.invoiceData,
        lastInvoice: index == totalRecord - 1,
        term, // ky
        // termDate: termDate.format('L'),
        termDate: moment(invoiceExportDate).format('L'),
        date,
        month,
        year,
        company,
        feeToText,
        fromDate,
        toDate,
      });
    });
    return invoices;
  };

  const getCondition = (filterValues, selectedIds) => {
    let fixFilterValues = { ...filterValues }; // clone object
    if (selectedIds && selectedIds.length) {
      fixFilterValues.id = { inq: selectedIds };
      fixFilterValues.status = 'ACTIVE';
    }
    let matchClientQuery = getRawWhere(ClientMeterNumber.app.models.Client, fixFilterValues);
    return matchClientQuery;
  };

  const getAggQuery = (condition, termMonthFormat) => {
    return [
      {
        $match: condition,
      },
      { $project: { termId: { $concat: [{ $convert: { input: '$_id', to: 'string' } }, termMonthFormat] } } },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          let: {
            termId: '$termId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$termId'],
                },
              },
            },
            {
              $project: {
                invoiceData: 1,
              },
            },
            {
              $limit: 1,
            },
          ],
          as: 'meterNumber',
        },
      },
      { $unwind: '$meterNumber' },
      { $replaceRoot: { newRoot: '$meterNumber' } },
    ];
  };
};
