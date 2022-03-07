'use strict';
const path = require('path');
const fs = require('fs');
const createError = require('http-errors');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-timezone');
const XlsxTemplate = require('xlsx-template');
const aggregate = require('../../utils/aggregate');

module.exports = ClientMeterNumber => {
  const buildQuery = ({ quarterId, month }) => {
    return [
      {
        $match: {
          quarterId: new ObjectID(quarterId),
        },
      },
      { $sort: { code: 1 } },
      { $limit: 10000 },
      {
        $addFields: {
          monthId: {
            $concat: [{ $toString: '$_id' }, moment(month).format('-YYYY-MM')],
          },
        },
      },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          let: { id: '$monthId' },
          pipeline: [
            {
              $match: {
                invoiceData: { $ne: null, $exists: true },
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', '$$id'],
                    },
                    {
                      $gte: [
                        '$toDate',
                        moment(month)
                          .startOf('month')
                          .toDate(),
                      ],
                    },
                    {
                      $lte: [
                        '$toDate',
                        moment(month)
                          .endOf('month')
                          .toDate(),
                      ],
                    },
                  ],
                },
              },
            },
            { $replaceRoot: { newRoot: { $mergeObjects: ['$invoiceData', { paymentStatus: '$paymentStatus' }] } } },
            { $project: { details: 0, client: 0 } },
          ],
          as: 'term',
        },
      },
      {
        $lookup: {
          from: 'EInvoiceData',
          let: { id: '$monthId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$id'] } } },
            { $project: { eInvoiceDate: 1, eInvoiceNo: 1 } },
          ],
          as: 'einvoice',
        },
      },
      { $project: { _id: 1, term: 1, einvoice: 1, name: 1, formattedAddress: 1, code: 1, formulaId: 1 } },
      { $unwind: '$term' },
      { $unwind: { path: '$einvoice', preserveNullAndEmptyArrays: true } },
      { $replaceRoot: { newRoot: { $mergeObjects: ['$term', '$einvoice', '$$ROOT'] } } },
      { $project: { term: 0, einvoice: 0 } },
      {
        $lookup: {
          from: 'Formula',
          let: { id: '$formulaId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$id'],
                },
              },
            },
            { $project: { name: 1 } },
          ],
          as: 'formula',
        },
      },
      { $unwind: '$formula' },
    ];
  };

  const exportExcelByGeoInternal = async (quarterId, month) => {
    if (!quarterId || !month) {
      throw createError(400, 'INVALID_FILTER');
    }
    let data = await aggregate(ClientMeterNumber.app.models.Client, buildQuery({ quarterId, month }));
    if (!data || data.length === 0) {
      throw createError(400, 'DATA_NOT_FOUND');
    }

    // Add column of payment status
    // Format date values
    data = data.map((item, index) => {
      item.index = index + 1;
      item.paymentStatus = item.paymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán';
      if (item.eInvoiceDate) {
        item.eInvoiceDate = moment(item.eInvoiceDate).format('DD/MM/YYYY');
      }
      return item;
    });

    // get company
    let company = await ClientMeterNumber.app.models.CtmCompany.findOne({ where: { active: true } });
    if (!company) {
      company = { name: 'Bworks' };
    }
    const templatePath = path.join(ClientMeterNumber.app.dirs.tempSheet.template, 'TermInvoiceByGeo.xlsx');
    if (!fs.existsSync(templatePath)) {
      throw createError(400, 'TEMPLATE_NOT_FOUND');
    }
    const templateData = fs.readFileSync(templatePath);
    const template = new XlsxTemplate(templateData);
    template.substitute(1, {
      customers: data,
      company,
      month: moment(month).month() + 1,
      year: moment(month).year(),
      clientCount: data.length,
      sumTotalWaterUsed: data.reduce((acc, { totalWaterUsed }) => acc + totalWaterUsed, 0),
      sumTotalFee: data.reduce((acc, { totalFee }) => acc + totalFee, 0),
      sumTotalTaxFee: data.reduce((acc, { taxFee }) => acc + taxFee, 0),
    });
    const buffer = template.generate({ type: 'nodebuffer' });
    return buffer;
  };

  ClientMeterNumber.exportExcelByGeo = (quarterId, month, cb) => {
    exportExcelByGeoInternal(quarterId, month)
      .then(stream => {
        const fileName = `${moment(month).format('YYYY-MM')}-${quarterId}.xlsx`;
        const contentType = 'application/vnd.ms-excel';
        const contentDisposition = `attachment; filename=${fileName}`;
        return cb(null, stream, contentType, contentDisposition);
      })
      .catch(e => {
        cb(e);
      });
  };

  ClientMeterNumber.remoteMethod('exportExcelByGeo', {
    isStatic: true,
    accepts: [
      { arg: 'quarterId', type: 'string', required: true },
      { arg: 'month', type: 'date', required: true },
    ],
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
    // returns: { arg: 'data', type: 'object', root: true },
  });
};
