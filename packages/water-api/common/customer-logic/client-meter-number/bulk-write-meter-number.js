'use strict';
const path = require('path');
const get = require('lodash/get');
const uniq = require('lodash/uniq');
const moment = require('moment');
const httpError = require('http-errors');
const excelPopulate = require('xlsx-populate');
const Transaction = require('../../utils/transaction');
const validateEinvoiceReplacementDate = require('../../utils/validate-einvoice-replacement-date');
const computeChecksumForFile = require('../../utils/compute-checksum-for-file');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.importClientMeterNumbersFromExcel = async (filename, options) => {
    const uploadedExcelDir = ClientMeterNumber.app.dirs.tempSheet.uploaded;
    const filepath = path.resolve(uploadedExcelDir, filename);
    const checksum = await computeChecksumForFile(filepath);
    const jobKey = `${checksum}-ClientMeterNumber`;

    const job = await ClientMeterNumber.app.models.BackgroundJob.findOne({ where: { key: jobKey } });

    let jobStatus = '';
    let jobError = '';
    if (!job) {
      // Put the process onto the queue
      await ClientMeterNumber.app.runBackground({
        path: 'ClientMeterNumber.importClientMeterNumbersFromExcelInternal',
        jobKey,
        data: { filepath, options },
      });
      jobStatus = 'QUEUED';
    } else {
      // The job's already running, check whether it's still in progress or completed
      if (job.status === 'FINISH' && job.completedDate) {
        jobStatus = 'FINISH';
        if (job.error) {
          jobStatus = 'ERROR';
          jobError = job.error;
        }
      } else {
        jobStatus = 'IN_PROGRESS';
      }
    }

    return { jobStatus, jobError };
  };

  ClientMeterNumber.importClientMeterNumbersFromExcelInternal = async ({ filepath, options }) => {
    return excelPopulate.fromFileAsync(filepath).then(async workbook => {
      const dictionary = {
        'Mã KH': 'code',
        'Tên KH': 'name',
        'Địa chỉ': 'formattedAddress',
        'Từ ngày': 'fromDate',
        'Đến ngày': 'toDate',
        'Số cũ': 'previousNumber',
        'Số mới': 'currentNumber',
        'Ngày xuất hóa đơn điện tử thay thế': 'invoiceIssuedDate',
        'Số mới': 'currentNumber',
        'Mô tả': 'description',
      };

      // Get new meter numbers from notWritten sheet
      // Get edited meter numbers from written sheet
      const newMeterNumberRaw = workbook
        .sheet('Chưa ghi')
        .usedRange()
        .value()
        .slice(1);

      const editedMeterNumberRaw = [];
      // workbook
      //   .sheet('Đã ghi')
      //   .usedRange()
      //   .value()
      //   .slice(1);

      // Convert 2D arrays to arrays of record and transform Excel-formatted date to Date object
      // Translate keys to original fieldname
      // Validate required keys are set with values
      const newMeterNumberKeys = newMeterNumberRaw[0];
      const newMeterNumberRecords = [];
      for (let index = 1; index < newMeterNumberRaw.length; index++) {
        const record = {};
        for (let subIndex = 0; subIndex < newMeterNumberKeys.length; subIndex++) {
          const rawKey = newMeterNumberKeys[subIndex];
          const translatedKey = get(dictionary, rawKey.replace('*', ''));
          if (translatedKey) {
            let translatedKeyValue = newMeterNumberRaw[index][subIndex];
            if (translatedKey === 'fromDate' || translatedKey === 'toDate') {
              translatedKeyValue = excelPopulate.numberToDate(newMeterNumberRaw[index][subIndex]);
            } else if (translatedKey === 'currentNumber') {
              if (translatedKeyValue === undefined) {
                break;
              }
            }
            record[translatedKey] = translatedKeyValue;
          }
        }
        if (record['currentNumber']) {
          newMeterNumberRecords.push(record);
        }
      }

      const editedMeterNumberKeys = editedMeterNumberRaw[0];
      const editedMeterNumberRecords = [];
      for (let index = 1; index < editedMeterNumberRaw.length; index++) {
        const record = {};
        for (let subIndex = 0; subIndex < editedMeterNumberKeys.length; subIndex++) {
          const rawKey = editedMeterNumberKeys[subIndex];
          if (rawKey.includes('*') && editedMeterNumberRaw[index][subIndex] === undefined) {
            throw httpError(400, 'error.REQUIRED_DATA_NOT_EXIST');
          }
          const translatedKey = get(dictionary, rawKey.replace('*', ''));
          if (translatedKey) {
            if (translatedKey === 'invoiceIssuedDate') {
              if (typeof editedMeterNumberRaw[index][subIndex] === 'string') {
                const parsedInvoiceIssuedDate = moment(editedMeterNumberRaw[index][subIndex], 'DD/MM/YYYY HH:mm', true);
                if (parsedInvoiceIssuedDate.isValid()) {
                  record[translatedKey] = parsedInvoiceIssuedDate;
                }
              } else if (typeof editedMeterNumberRaw[index][subIndex] === 'number') {
                const parsedInvoiceIssuedDate = moment(
                  excelPopulate.numberToDate(editedMeterNumberRaw[index][subIndex]),
                );
                if (parsedInvoiceIssuedDate.isValid()) {
                  record[translatedKey] = parsedInvoiceIssuedDate;
                }
              }
            } else if (['fromDate', 'toDate'].includes(translatedKey)) {
              record[translatedKey] = excelPopulate.numberToDate(editedMeterNumberRaw[index][subIndex]);
            } else {
              record[translatedKey] = editedMeterNumberRaw[index][subIndex];
            }
          }
        }
        editedMeterNumberRecords.push(record);
      }

      // Validate
      //   + no duplicate code
      //   + toDate is within chosen period
      //   + currentNumber is larger or equal to previousNumber
      if (uniq(newMeterNumberRecords.map(i => i.code)).length !== newMeterNumberRecords.map(i => i.code).length) {
        throw httpError(400, 'error.DUPLICATE_CODE');
      }
      for (let record of newMeterNumberRecords) {
        if (record['currentNumber'] < record['previousNumber']) {
          throw httpError(400, 'error.INVALID_CURRENT_METER_NUMBER');
        }
        if (
          !moment(record['toDate']).isBetween(
            moment(record['fromDate'])
              .add(1, 'month')
              .startOf('month'),
            moment(record['fromDate'])
              .add(1, 'month')
              .endOf('month'),
            null,
            '[]',
          )
        ) {
          throw httpError(400, 'error.INVALID_END_MONTH');
        }
      }

      // Validate
      //   + toDate is within chosen period
      //   + currentNumber is larger or equal to previousNumber
      //   + einvoice export date, if existed, satisfies constraint
      const toDates = [];
      const invoiceIssuedDates = [];
      for (let record of editedMeterNumberRecords) {
        if (record['currentNumber'] < record['previousNumber']) {
          throw httpError(400, 'error.INVALID_CURRENT_METER_NUMBER');
        }
        if (
          !moment(record['toDate']).isBetween(
            moment(record['fromDate'])
              .add(1, 'month')
              .startOf('month'),
            moment(record['fromDate'])
              .add(1, 'month')
              .endOf('month'),
            null,
            '[]',
          )
        ) {
          throw httpError(400, 'error.INVALID_END_MONTH');
        }

        if (record.invoiceIssuedDate) {
          toDates.push(moment(record.toDate).format('MM/YYYY'));
          invoiceIssuedDates.push(record.invoiceIssuedDate);
        }
      }

      if (invoiceIssuedDates.length > 0 && uniq(toDates).length !== 1) {
        throw httpError(400, 'error.DIFFERENT_TO_DATE');
      }
      const latestEinvoice = await ClientMeterNumber.app.models.EInvoiceData.getLatestEinvoice(
        moment(toDates[0], 'MM/YYYY'),
      );

      if (!validateEinvoiceReplacementDate(latestEinvoice, ...invoiceIssuedDates)) {
        throw httpError(400, 'INVALID_EINVOICE_REPLACEMENT_DATE');
      }

      // Add clientId and id to both sheet data
      // Additionally, remove records already have current number as any writing action would be constituted as `editing`
      const newlyWrittenClientIds = await ClientMeterNumber.app.models.Client.find({
        where: { code: { inq: newMeterNumberRecords.map(i => i.code) } },
        fields: { id: true, code: true, name: true, lastMeterNumber: true, termMeterNumber: true },
      }).then(results =>
        results.length > 0
          ? results.reduce(
              (acc, val) => ({
                ...acc,
                [val.code]: {
                  id: val.id,
                  lastMeterNumber: val.lastMeterNumber,
                  termMeterNumber: val.termMeterNumber,
                  name: val.name,
                },
              }),
              {},
            )
          : [],
      );
      for (let i = 0; i < newMeterNumberRecords.length; i++) {
        const record = newMeterNumberRecords[i];
        const fetchedClient = newlyWrittenClientIds[record['code']];
        if (
          moment(fetchedClient.termMeterNumber).format('MM/YYYY') === moment(record.toDate).format('MM/YYYY') &&
          fetchedClient.lastMeterNumber === record.currentNumber
        ) {
          record['skipped'] = true;
          continue;
        }
        if (fetchedClient.id) {
          // Check if fetched client matches with input client data
          if (fetchedClient.name !== record.name || fetchedClient.lastMeterNumber !== record.previousNumber) {
            throw httpError(400, 'error.REF_DATA_HAS_BEEN_MODIFIED');
          }
          record['clientId'] = fetchedClient.id;
          record['id'] = `${record['clientId'].toString()}-${moment(record['toDate']).format('YYYY-MM')}`;
        } else {
          throw httpError(400, 'error.REF_DATA_HAS_BEEN_MODIFIED');
        }
      }
      const cleanedNewMeterNumberRecords = newMeterNumberRecords.filter(({ skipped }) => !skipped);
      // const editedClientIds = await ClientMeterNumber.app.models.Client.find({
      //   where: { code: { inq: editedMeterNumberRecords.map(i => i.code) } },
      //   fields: { id: true, code: true },
      // }).then(results => results.reduce((acc, val) => ({ ...acc, [val.code]: val.id }), {}));
      // for (let record of editedMeterNumberRecords) {
      //   if (editedClientIds[record['code']]) {
      //     record['clientId'] = editedClientIds[record['code']];
      //     record['id'] = `${record['clientId'].toString()}-${moment(record['toDate']).format('YYYY-MM')}`;
      //   } else {
      //     throw httpError(400, 'error.REF_DATA_HAS_BEEN_MODIFIED');
      //   }
      // }

      // Begin transaction
      const transaction = new Transaction(ClientMeterNumber);
      const session = transaction.start();

      try {
        // For new meter numbers, call bulkWriteNewMonth()
        if (cleanedNewMeterNumberRecords.length > 0) {
          await ClientMeterNumber.bulkWriteNewMonth(cleanedNewMeterNumberRecords, options, transaction, session);
        }
        // For edited meter numbers, call bulkUpdateMonth()
        // if (editedMeterNumberRecords.length > 0) {
        //   await ClientMeterNumber.bulkUpdateMonth(editedMeterNumberRecords, transaction, session);
        // }
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });
  };

  ClientMeterNumber.remoteMethod('importClientMeterNumbersFromExcel', {
    accepts: [
      { arg: 'filename', type: 'string' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'jobData', type: 'object', root: true },
  });
};
