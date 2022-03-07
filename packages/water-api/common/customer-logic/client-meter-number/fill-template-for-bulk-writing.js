'use strict';
const path = require('path');
const moment = require('moment');
const get = require('lodash/get');
const has = require('lodash/has');
const intersectionBy = require('lodash/intersectionBy');
// const mapValues = require('lodash/mapValues');
const excelPopulate = require('xlsx-populate');
// const aggregate = require('../../utils/aggregate');
const toObjectId = require('../../utils/to-object-id');

module.exports = ClientMeterNumber => {
  const sortByReferenceKeys = (referenceKeys, arrayOfObjects) => {
    const sortedArrays = [];
    for (let object of arrayOfObjects) {
      const newObject = {};
      for (let key of referenceKeys) {
        newObject[key] = object[key];
      }
      sortedArrays.push(Object.values(newObject));
    }
    return sortedArrays;
  };

  // const buildQueryForWrittenClient = (currentMonth, filter) => [
  //   {
  //     $match: mapValues(filter.reduce((acc, val) => ({ ...acc, ...val }), {}), value => {
  //       return toObjectId(value);
  //     }),
  //   },
  //   { $project: { code: 1, name: 1, formattedAddress: 1, _id: 1 } },
  //   {
  //     $lookup: {
  //       from: 'ClientMeterNumber',
  //       let: { id: '$_id' },
  //       pipeline: [
  //         {
  //           $match: {
  //             $and: [
  //               {
  //                 fromDate: {
  //                   $gte: moment(currentMonth)
  //                     .subtract(1, 'month')
  //                     .startOf('month')
  //                     .toDate(),
  //                 },
  //                 toDate: {
  //                   $lte: moment(currentMonth)
  //                     .endOf('month')
  //                     .toDate(),
  //                 },
  //               },
  //               { $expr: { $eq: ['$clientId', '$$id'] } },
  //             ],
  //           },
  //         },
  //         {
  //           $project: {
  //             toDate: 1,
  //             fromDate: 1,
  //             paymentStatus: {
  //               $cond: { if: { $eq: ['$paymentStatus', true] }, then: 'Đã thanh toán', else: 'Chưa thanh toán' },
  //             },
  //             previousNumber: 1,
  //             currentNumber: 1,
  //           },
  //         },
  //       ],
  //       as: 'meterNumbers',
  //     },
  //   },
  //   { $unwind: { path: '$meterNumbers' } },
  //   {
  //     $lookup: {
  //       from: 'EInvoiceData',
  //       let: {
  //         monthId: {
  //           $concat: [{ $convert: { input: '$_id', to: 'string' } }, moment(currentMonth).format('-YYYY-MM')],
  //         },
  //       },
  //       pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$monthId'] } } }, { $project: { eInvoiceNo: 1 } }],
  //       as: 'einvoice',
  //     },
  //   },
  //   { $unwind: { path: '$einvoice', preserveNullAndEmptyArrays: true } },
  //   {
  //     $project: {
  //       code: '$code',
  //       name: '$name',
  //       formattedAddress: '$formattedAddress',
  //       fromDate: '$meterNumbers.fromDate',
  //       toDate: '$meterNumbers.toDate',
  //       paymentStatus: '$meterNumbers.paymentStatus',
  //       previousNumber: '$meterNumbers.previousNumber',
  //       currentNumber: '$meterNumbers.currentNumber',
  //       invoiceIssuedDate: '$einvoice',
  //     },
  //   },
  // ];

  ClientMeterNumber.fillTemplateForBulkWriting = (outputTemplate, currentMonth, filter, options = {}, callback) => {
    const templatePath = path.resolve(ClientMeterNumber.app.dirs.tempSheet.template, outputTemplate);
    const Client = ClientMeterNumber.app.models.Client;
    // Read the sheet
    excelPopulate
      .fromFileAsync(templatePath)
      .then(async workbook => {
        // Get the headers. They work as reference to ordering data 2D arrays
        // let writtenSheetHeaders = workbook
        //   .sheet('Đã ghi')
        //   .range('A2:K2')
        //   .value();
        let notWrittenSheetHeaders = workbook
          .sheet('Chưa ghi')
          .range('A2:H2')
          .value();
        // Translate back to original fieldname
        const dictionary = {
          'Mã KH': 'code',
          'Tên KH': 'name',
          'Địa chỉ': 'formattedAddress',
          'Từ ngày': 'fromDate',
          'Đến ngày': 'toDate',
          'Số cũ': 'previousNumber',
          'Số mới': 'currentNumber',
          'Mã hóa đơn điện tử đã xuất': 'eInvoiceNo',
          'Ngày xuất hóa đơn điện tử thay thế': 'invoiceIssuedDate',
          'Tình trạng thanh toán': 'paymentStatus',
          'Mô tả': 'description',
        };
        // writtenSheetHeaders = writtenSheetHeaders[0].map(i => get(dictionary, i.replace('*', '')));
        notWrittenSheetHeaders = notWrittenSheetHeaders[0].map(i => get(dictionary, i.replace('*', '')));

        // Data fetched for client who did not write meter number comes from Client.find(), a remote method by Loopback model
        // which is already limited for permitted wards and quarters. However, data fetched for client who did is through aggregation
        // and so, a geo-limitation filter must be put henceforth
        let processedFilterForWritten = filter
          ? filter.filter(filterObject => !has(filterObject, 'wardId') && !has(filterObject, 'quarterId'))
          : [];
        let processedFilterForNotWritten = filter
          ? filter.filter(filterObject => !has(filterObject, 'wardId') && !has(filterObject, 'quarterId'))
          : [];
        if (has(options, 'accessToken')) {
          const user = await options.accessToken.user.get();
          if (!user) {
            return;
          }
          const quarterInChargeIds = (user.quarterInChargeIds || []).map(id => toObjectId(id));
          const wardInChargeIds = (user.wardInChargeIds || []).map(id => toObjectId(id));
          if (user.username !== 'master') {
            // Check if the filter contains any IDs pertinent to wards and quarters
            // If there are, only ones contained in lists of permitted wards and quarters is allowed
            // If there arent, the permitted wards and quarters is the limitation
            let queryWard = filter.filter(({ wardId }) => wardId);
            let queryQuarter = filter.filter(({ quarterId }) => quarterId);
            if (queryWard.length === 1) {
              processedFilterForWritten.push({
                wardId: {
                  $in: intersectionBy([toObjectId(queryWard[0].wardId)], wardInChargeIds, id => id.toString()),
                },
              });
              processedFilterForNotWritten.push({
                wardId: {
                  inq: intersectionBy([toObjectId(queryWard[0].wardId)], wardInChargeIds, id => id.toString()),
                },
              });
            } else {
              processedFilterForWritten.push({ wardId: { $in: wardInChargeIds } });
              processedFilterForNotWritten.push({ wardId: { inq: wardInChargeIds } });
            }
            if (queryQuarter.length === 1) {
              processedFilterForWritten.push({
                quarterId: {
                  $in: intersectionBy([toObjectId(queryQuarter[0].quarterId)], quarterInChargeIds, id => id.toString()),
                },
              });
              processedFilterForNotWritten.push({
                quarterId: {
                  inq: intersectionBy([toObjectId(queryQuarter[0].quarterId)], quarterInChargeIds, id => id.toString()),
                },
              });
            } else {
              processedFilterForWritten.push({ quarterId: { $in: quarterInChargeIds } });
              processedFilterForNotWritten.push({ quarterId: { inq: quarterInChargeIds } });
            }
          } else {
            processedFilterForWritten = filter ? filter : [];
            processedFilterForNotWritten = filter ? filter : [];
          }
        }

        // Fetch data from Client and ClientMeterNumber model
        // Divide into two group: written and unwritten
        // const written = await aggregate(Client, buildQueryForWrittenClient(currentMonth, processedFilterForWritten));
        const notWrittenRaw = await Client.find({
          where: {
            and: [
              ...processedFilterForNotWritten,
              { status: 'ACTIVE' },
              {
                startMeterDate: {
                  lt: moment(currentMonth)
                    .startOf('month')
                    .toDate(),
                },
              },
              {
                termMeterNumber: {
                  lt: moment(currentMonth)
                    .subtract(1, 'months')
                    .endOf('month')
                    .toDate(),
                },
              },
              {
                termMeterNumber: {
                  gte: moment(currentMonth)
                    .subtract(1, 'months')
                    .startOf('month')
                    .toDate(),
                },
              },
            ],
          },
          fields: {
            code: true,
            name: true,
            formattedAddress: true,
            lastMeterNumber: true,
            lastTimeMeterNumberUpdate: true,
          },
        }).then(records => records.map(record => record.toJSON()));
        // Get configured day to write meter number
        const configuredDayToWriteMeterNumber = await Client.app.models.CtmConfig.findById(
          'ClientWriteMeterNumberDate',
        ).then(({ value }) => value);
        const notWritten = notWrittenRaw.map(record => {
          // Select configured day to write meter number
          record.toDate = moment(currentMonth)
            .date(configuredDayToWriteMeterNumber)
            .toDate();
          record.fromDate = moment(record.lastTimeMeterNumberUpdate).toDate();
          record.previousNumber = record.lastMeterNumber;
          record.currentNumber = null;
          delete record.lastMeterNumber;
          delete record.lastTimeMeterNumberUpdate;
          return record;
        });
        // Sort the objects based on their headers and convert to 2D array
        // const sortedWritten = Object.values(sortByReferenceKeys(writtenSheetHeaders, written));
        const sortedNotWritten = Object.values(sortByReferenceKeys(notWrittenSheetHeaders, notWritten));
        // Write back to sheets
        // if (sortedWritten.length > 0) {
        //   workbook
        //     .sheet('Đã ghi')
        //     .cell('A3')
        //     .value(sortedWritten);
        //   for (let index = 0; index < sortedWritten.length; index++) {
        //     const record = sortedWritten[index];
        //     workbook
        //       .sheet('Đã ghi')
        //       .cell(`D${index + 3}`)
        //       .style('numberFormat', 'dd/mm/yyyy');
        //     workbook
        //       .sheet('Đã ghi')
        //       .cell(`E${index + 3}`)
        //       .style('numberFormat', 'dd/mm/yyyy');
        //     if (record.length >= 9) {
        //       const einvoiceExportDate = record[8];
        //       const paymentStatus = record[9];
        //       if (einvoiceExportDate && einvoiceExportDate.eInvoiceNo && paymentStatus.includes('Chưa')) {
        //         workbook
        //           .sheet('Đã ghi')
        //           .cell(`H${index + 3}`)
        //           .value(einvoiceExportDate.eInvoiceNo)
        //           .style({ fill: 'F8AA97' });
        //         workbook
        //           .sheet('Đã ghi')
        //           .cell(`I${index + 3}`)
        //           .value(null)
        //           .style({ fill: 'F8AA97' });
        //       }
        //     }
        //   }
        // }
        if (sortedNotWritten.length > 0) {
          workbook
            .sheet('Chưa ghi')
            .cell('A3')
            .value(sortedNotWritten);
          for (let index = 0; index < sortedNotWritten.length; index++) {
            workbook
              .sheet('Chưa ghi')
              .cell(`D${index + 3}`)
              .style('numberFormat', 'dd/mm/yyyy');
            workbook
              .sheet('Chưa ghi')
              .cell(`E${index + 3}`)
              .style('numberFormat', 'dd/mm/yyyy');
          }
        }

        // Write correct format for date
        workbook
          .sheet('Đã ghi')
          .cell('I1')
          .value('DD/MM/YYYY HH:mm')
          .style({ fill: 'F8AA97' });

        // Write the current month
        workbook
          .sheet('Đã ghi')
          .cell('D1')
          .value(`Kỳ ghi nước ${moment(currentMonth).format('MM-YYYY')}`);
        workbook
          .sheet('Chưa ghi')
          .cell('D1')
          .value(`Kỳ ghi nước ${moment(currentMonth).format('MM-YYYY')}`);
        return workbook.outputAsync({ type: 'nodebuffer' });
      })
      .then(stream => {
        const fileName = 'Bieu_mau_ghi_so_nuoc.xlsx';
        const contentType = 'application/vnd.ms-excel';
        const contentDisposition = `attachment;filename=${fileName}`;
        return callback(null, stream, contentType, contentDisposition);
      })
      .catch(e => callback(e));
  };

  ClientMeterNumber.remoteMethod('fillTemplateForBulkWriting', {
    isStatic: true,
    accepts: [
      { arg: 'outputTemplate', type: 'string' },
      { arg: 'currentMonth', type: 'date' },
      { arg: 'filter', type: ['object'] },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
