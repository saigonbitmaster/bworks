'use strict';
const path = require('path');
const fs = require('fs');
const has = require('lodash/has');
const createError = require('http-errors');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-timezone');
const XlsxTemplate = require('xlsx-template');
const aggregate = require('../../utils/aggregate');

//  Thong ke chi so dong ho nuoc
module.exports = ClientMeterNumber => {
  const buildQuery = ({ wardId, quarterId, timeRange }) => {
    const matchCondition = {};
    if (wardId) {
      matchCondition.wardId = new ObjectID(wardId);
    }
    if (quarterId) {
      matchCondition.quarterId = new ObjectID(quarterId);
    }
    return [
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
          let: { clientId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$clientId', '$$clientId'] },
                    { $gte: ['$toDate', moment(timeRange.from).toDate()] },
                    { $lte: ['$toDate', moment(timeRange.to).toDate()] },
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
                serial: 1,
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
          name: 1,
          code: 1,
          formattedAddress: 1,
          quarterId: 1,
          oldMeterNumber: '$term.oldMeterNumber',
          newMeterNumber: '$term.newMeterNumber',
          totalWaterUse: '$term.totalWaterUsed',
          serial: 1,
        },
      },
      {
        $group: {
          _id: '$quarterId',
          count: { $sum: 1 },
          waterUse: { $sum: '$totalWaterUse' },
          customers: { $push: '$$ROOT' },
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
      { $addFields: { formattedAddress: '$geo.name' } },
      { $project: { geo: 0 } },
    ];
  };

  const exportExcelTermNumberGroupByGeoInternal = async (wardId, quarterId, timeRange) => {
    if (!timeRange || !has(timeRange, 'from') || !has(timeRange, 'to')) {
      throw createError(400, 'error.INVALID_FILTER');
    }

    // Modify the time range
    const modifiedTimeRange = {
      from: moment(timeRange.from).startOf('month'),
      to: moment(timeRange.to).endOf('month'),
    };

    let data = await aggregate(
      ClientMeterNumber.app.models.Client,
      buildQuery({ wardId, quarterId, timeRange: modifiedTimeRange }),
    );
    if (!data || data.length === 0) {
      throw createError(400, 'error.DATA_NOT_FOUND');
    }
    // get company
    let company = await ClientMeterNumber.app.models.CtmCompany.findOne({ where: { active: true } });
    if (!company) {
      company = { name: 'Bworks' };
    }
    const templatePath = path.join(ClientMeterNumber.app.dirs.tempSheet.template, 'TermNumberGroupByGeo.xlsx');
    if (!fs.existsSync(templatePath)) {
      throw createError(400, 'error.TEMPLATE_NOT_FOUND');
    }
    const templateData = fs.readFileSync(templatePath);
    const template = new XlsxTemplate(templateData);
    const fromToDate =
      moment(timeRange.from).format('MM/YYYY') === moment(timeRange.to).format('MM/YYYY')
        ? `Tháng ${moment(timeRange.to).month() + 1}/${moment(timeRange.to).year()}`
        : `Tháng ${moment(timeRange.from).month() + 1}/${moment(timeRange.from).year()} - Tháng ${moment(
            timeRange.to,
          ).month() + 1}/${moment(timeRange.to).year()}`;

    data.map((item, index) => (item.index = index + 1));
    // sheet summary
    const sheet1Data = {
      geos: data,
      company,
      fromToDate,
    };
    template.substitute(1, sheet1Data);
    // data for sheet details
    const customers = data.reduce((pre, current) => pre.concat(current.customers), []);
    customers.map((item, index) => (item.index = index + 1));
    const sheet2Data = {
      customers,
      company,
      fromToDate,
    };
    template.substitute(2, sheet2Data);

    const buffer = template.generate({ type: 'nodebuffer' });
    return buffer;
  };

  ClientMeterNumber.exportExcelTermNumberGroupByGeo = (wardId, quarterId, timeRange, cb) => {
    exportExcelTermNumberGroupByGeoInternal(wardId, quarterId, timeRange)
      .then(stream => {
        const fileName =
          moment(timeRange.from).format('MM/YYYY') === moment(timeRange.to).format('MM/YYYY')
            ? `${moment(timeRange.to).format('YYYY-MM')}-${quarterId || wardId || 1}.xlsx`
            : `${moment(timeRange.from).format('YYYY-MM')}--${moment(timeRange.to).format('YYYY-MM')}-${quarterId ||
                wardId ||
                1}.xlsx`;
        const contentType = 'application/vnd.ms-excel';
        const contentDisposition = `attachment;filename=${fileName}`;
        return cb(null, stream, contentType, contentDisposition);
      })
      .catch(e => {
        cb(e);
      });
  };

  ClientMeterNumber.remoteMethod('exportExcelTermNumberGroupByGeo', {
    isStatic: true,
    accepts: [
      { arg: 'wardId', type: 'string' },
      { arg: 'quarterId', type: 'string' },
      { arg: 'timeRange', type: 'object', required: true },
    ],
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
