'use strict';
const path = require('path');
const fs = require('fs');
const createError = require('http-errors');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-timezone');
const XlsxTemplate = require('xlsx-template');
// const toStream = require('buffer-to-stream');
const aggregate = require('../../utils/aggregate');

//  Thong ke chi so dong ho nuoc
module.exports = ClientMeterNumber => {
  const buildQuery = ({ wardId, quarterId, month }) => {
    const matchCondition = {};
    if (wardId) {
      matchCondition.wardId = new ObjectID(wardId);
    }
    if (quarterId) {
      matchCondition.quarterId = new ObjectID(quarterId);
    }
    return [
      {
        $match: matchCondition,
      },
      { $limit: 100000 },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          let: { id: { $concat: [{ $toString: '$_id' }, moment(month).format('-YYYY-MM')] } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$id'],
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
      //
      {
        $match: {
          status: 'ACTIVE',
          ...matchCondition,
        },
      },
      { $limit: 100000 },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          let: { id: { $concat: [{ $toString: '$_id' }, moment(month).format('-YYYY-MM')] } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$id'],
                },
              },
            },
            { $replaceRoot: { newRoot: { $ifNull: ['$invoiceData', {}] } } },
            { $project: { oldMeterNumber: 1, newMeterNumber: 1, totalWaterUsed: 1 } },
          ],
          as: 'term',
        },
      },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          let: {
            id: {
              $concat: [
                { $toString: '$_id' },
                moment(month)
                  .subtract(1, 'month')
                  .format('-YYYY-MM'),
              ],
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$id'],
                },
              },
            },
            { $replaceRoot: { newRoot: { $ifNull: ['$invoiceData', {}] } } },
            { $project: { totalWaterUsed: 1 } },
          ],
          as: 'preTerm',
        },
      },

      { $unwind: { path: '$term', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$preTerm', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          currentCount: { $cond: { if: { $eq: [{ $type: '$term' }, 'object'] }, then: 1, else: 0 } },
          preCount: { $cond: { if: { $eq: [{ $type: '$preTerm' }, 'object'] }, then: 1, else: 0 } },
        },
      },
      {
        $group: {
          _id: '$quarterId',

          currentTotalWaterUsed: { $sum: '$term.totalWaterUsed' },
          preTotalWaterUsed: { $sum: '$preTerm.totalWaterUsed' },

          currentConnection: { $sum: '$currentCount' },
          preConnection: { $sum: '$preCount' },

          currentConnectionActive: { $sum: { $cond: { if: { $gt: ['$term.totalWaterUsed', 0] }, then: 1, else: 0 } } },
          preConnectionActive: { $sum: { $cond: { if: { $gt: ['$preTerm.totalWaterUsed', 0] }, then: 1, else: 0 } } },
        },
      },
      {
        $addFields: {
          percentWaterUsed: {
            $cond: {
              if: { $gt: ['$preTotalWaterUsed', 0] },
              then: { $divide: [{ $multiply: ['$currentTotalWaterUsed', 100] }, '$preTotalWaterUsed'] },
              else: 'N/A',
            },
          },
          percentConnection: {
            $cond: {
              if: { $gt: ['$preConnection', 0] },
              then: { $divide: [{ $multiply: ['$currentConnection', 100] }, '$preConnection'] },
              else: 'N/A',
            },
          },
          percentConnectionActive: {
            $cond: {
              if: { $gt: ['$preConnectionActive', 0] },
              then: { $divide: [{ $multiply: ['$currentConnectionActive', 100] }, '$preConnectionActive'] },
              else: 'N/A',
            },
          },
        },
      },

      {
        $lookup: {
          from: 'GeoQuarter',
          localField: '_id',
          foreignField: '_id',
          as: 'geo',
        },
      },
      { $unwind: '$geo' },
      { $addFields: { formattedAddress: '$geo.fullAddress' } },
      { $project: { geo: 0 } },
    ];
  };

  const exportExcelTermNumberSummaryGroupByGeoInternal = async (wardId, quarterId, month) => {
    if (!month) {
      throw createError(400, 'error.INVALID_FILTER');
    }
    let data = await aggregate(ClientMeterNumber.app.models.Client, buildQuery({ wardId, quarterId, month }));
    if (!data || data.length === 0) {
      throw createError(400, 'error.DATA_NOT_FOUND');
    }
    // get company
    let company = await ClientMeterNumber.app.models.CtmCompany.findOne({ where: { active: true } });
    if (!company) {
      company = { name: 'Bworks' };
    }
    const templatePath = path.join(ClientMeterNumber.app.dirs.tempSheet.template, 'TermNumberSummaryGroupByGeo.xlsx');
    if (!fs.existsSync(templatePath)) {
      throw createError(400, 'error.TEMPLATE_NOT_FOUND');
    }
    const templateData = fs.readFileSync(templatePath);
    const template = new XlsxTemplate(templateData);
    data.map((item, index) => (item.index = index + 1));
    // sheet summary
    const sheet1Data = { geos: data, company, month: moment(month).month() + 1, year: moment(month).year() };
    template.substitute(1, sheet1Data);

    const buffer = template.generate({ type: 'nodebuffer' });
    return buffer;
  };

  ClientMeterNumber.exportExcelTermNumberSummaryGroupByGeo = (wardId, quarterId, month, cb) => {
    exportExcelTermNumberSummaryGroupByGeoInternal(wardId, quarterId, month)
      .then(stream => {
        const fileName = `${moment(month).format('YYYY-MM')}-${quarterId || wardId || 1}.xlsx`;
        const contentType = 'application/vnd.ms-excel';
        const contentDisposition = `attachment; filename=${fileName}`;
        return cb(null, stream, contentType, contentDisposition);
      })
      .catch(e => {
        cb(e);
      });
  };

  ClientMeterNumber.remoteMethod('exportExcelTermNumberSummaryGroupByGeo', {
    isStatic: true,
    accepts: [
      { arg: 'wardId', type: 'string' },
      { arg: 'quarterId', type: 'string' },
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
