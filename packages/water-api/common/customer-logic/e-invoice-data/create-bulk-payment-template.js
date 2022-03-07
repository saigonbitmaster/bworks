'use strict';
const fs = require('fs');
const path = require('path');
const xlsxTemplate = require('xlsx-template');
const uuidv1 = require('uuid/v1');
const objectHash = require('object-hash');
const clone = require('lodash/clone');
const isEmpty = require('lodash/isEmpty');
const set = require('lodash/set');
const get = require('lodash/get');
const moment = require('moment-timezone');
const httpError = require('http-errors');
const sortedObjectByKey = require('../../utils/sort-object-by-key');

module.exports = EinvoiceData => {
  const createBulkPaymentTemplateInternal = async (filter, res = null) => {
    // Only fetch clients who have invoice but havent paid yet
    const newFilter = {
      where: { ...clone(filter), einvoice: 'isExported', paymentStatus: 'notPaid' },
      noSkipOrLimit: true,
    };
    const invoicePaidDate = moment(newFilter.where.termInvoice.gte || filter.where.termInvoice);

    // Get template path
    const templatePath = path.join(EinvoiceData.app.dirs.tempSheet.template, 'BulkPay.xlsx');
    if (!fs.existsSync(templatePath)) {
      throw httpError(400, 'error.TEMPLATE_NOT_FOUND');
    }

    // Helper variable and function
    const hashFields = [
      ['index', 'A'],
      ['code', 'B'],
      ['name', 'C'],
      ['formattedAddress', 'D'],
      ['clientMeterNumber.totalWaterUsed', 'E'],
      ['clientMeterNumber.totalFee', 'F'],
      ['einvoice.eInvoiceNo', 'G'],
    ];

    // Get data
    const data = await EinvoiceData.app.models.Client.joinWithMeterNumber(newFilter, res).then(data =>
      // Add indices and empty value for `paymentStatus`
      data.map((client, index) => {
        set(client, 'index', index + 1);
        set(client, 'clientMeterNumber.paymentStatus', null);
        return client;
      }),
    );

    // Create a hash with data and their respective cell positions
    const hashObject = {};
    for (let i = 0, cellNum = 7; i < data.length; cellNum++, i++) {
      const datum = data[i];
      for (let [field, char] of hashFields) {
        hashObject[`${char}${cellNum}`] = get(datum, field);
      }
    }
    const sortedHashObject = sortedObjectByKey(hashObject);
    const contentHash = objectHash(sortedHashObject);

    // Populate template with data
    const rawTemplate = fs.readFileSync(templatePath);
    const template = new xlsxTemplate(rawTemplate);
    const sheet1Data = {
      month: moment(invoicePaidDate).month() + 1,
      year: moment(invoicePaidDate).year(),
      client: data,
    };
    template.substitute(1, sheet1Data);

    // Return the populated template
    const buffer = template.generate({ type: 'nodebuffer' });

    // Store somewhere else for later comparison
    if (!isEmpty(sortedHashObject)) {
      await EinvoiceData.app.models.ImportActivityLog.findOrCreate({ where: { id: contentHash } }, { id: contentHash });
    }

    return buffer;
  };

  EinvoiceData.createBulkPaymentTemplate = (filter, res = null, cb) =>
    createBulkPaymentTemplateInternal(filter, res).then(buffer => {
      const filename = `${uuidv1()}.xlsx`;
      const contentType = 'application/vnd.ms-excel';
      const contentDisposition = `attachment;filename=${filename}`;

      // Reset the `Content-Length` header
      res.set('Content-Length', buffer.length);
      return cb(null, buffer, contentType, contentDisposition);
    });

  EinvoiceData.remoteMethod('createBulkPaymentTemplate', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
