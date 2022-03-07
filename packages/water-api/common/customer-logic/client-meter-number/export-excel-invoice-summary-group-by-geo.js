'use strict';
const path = require('path');
const fs = require('fs');
const has = require('lodash/has');
const createError = require('http-errors');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-timezone');
const XlsxTemplate = require('xlsx-template');
// const toStream = require('buffer-to-stream');
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
            { $project: { totalWaterUsed: 1, totalFee: 1, taxFee: 1, waterFee: 1, sewageFee: 1 } },
          ],
          as: 'term',
        },
      },
      { $unwind: { path: '$term', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$quarterId',
          totalCustomer: { $sum: 1 },
          totalInvoice: { $sum: { $cond: { if: { $gt: ['$term.totalWaterUsed', 0] }, then: 1, else: 0 } } },
          waterUsed: { $sum: '$term.totalWaterUsed' },
          totalFee: { $sum: '$term.totalFee' },
          waterFee: { $sum: '$term.waterFee' },
          taxFee: { $sum: '$term.taxFee' },
          sewageFee: { $sum: '$term.sewageFee' },
        },
      },
      // get geo
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

  const exportExcelInvoiceSummaryGroupByGeoInternal = async (wardId, quarterId, timeRange) => {
    if (!timeRange || !has(timeRange, 'from') || !has(timeRange, 'to')) {
      throw createError(400, 'error.INVALID_FILTER');
    }

    // Modify the time range
    const modifiedTimeRange = {
      from: moment(timeRange.from).startOf('month'),
      to: moment(timeRange.to).endOf('month'),
    };

    const query = buildQuery({ wardId, quarterId, timeRange: modifiedTimeRange });
    let data = await aggregate(ClientMeterNumber.app.models.Client, query);
    if (!data || data.length === 0) {
      throw createError(400, 'error.DATA_NOT_FOUND');
    }
    // get company
    let company = await ClientMeterNumber.app.models.CtmCompany.findOne({ where: { active: true } });
    if (!company) {
      company = { name: 'Bworks' };
    }
    //get list of in charge staffs by quarterId 
    const queryStaff = [
      { $unwind: "$quarterInChargeIds" },
      { $group: { _id: "$quarterInChargeIds", users: { $push: "$fullName" } } },
      {
        $project: {
          "users": {
            $reduce: {
              input: "$users",
              initialValue: "",
              in: { $concat: ["$$this", ", ", "$$value",] }

            }
          }
        }
      }
    ];

    let staffs = await aggregate(ClientMeterNumber.app.models.AppUser, queryStaff);
    if (!staffs || staffs.length === 0) {
      throw createError(400, 'error.DATA_NOT_FOUND');
    };

    data = data.map(item => {
      let _staffs = staffs.find(staffItem => staffItem._id.equals(item._id)); 
      item.users = _staffs.users; 
      return item
    })
    const templatePath = path.join(ClientMeterNumber.app.dirs.tempSheet.template, 'TermInvoiceSummaryByGeo.xlsx');
    if (!fs.existsSync(templatePath)) {
      throw createError(400, 'error.TEMPLATE_NOT_FOUND');
    }
    const templateData = fs.readFileSync(templatePath);
    const template = new XlsxTemplate(templateData);
    data.map((item, index) => { item.index = index + 1; });

    // sheet summary
    const fromToDate =
      moment(timeRange.from).format('MM/YYYY') === moment(timeRange.to).format('MM/YYYY')
        ? `Tháng ${moment(timeRange.to).month() + 1}/${moment(timeRange.to).year()}`
        : `Tháng ${moment(timeRange.from).month() + 1}/${moment(timeRange.from).year()} - Tháng ${moment(
          timeRange.to,
        ).month() + 1}/${moment(timeRange.to).year()}`;
    const sheet1Data = { invoices: data, company, fromToDate };
    template.substitute(1, sheet1Data);
   

    const buffer = template.generate({ type: 'nodebuffer' });
    return buffer;
  };

  ClientMeterNumber.exportExcelInvoiceSummaryGroupByGeo = (wardId, quarterId, timeRange, cb) => {
    exportExcelInvoiceSummaryGroupByGeoInternal(wardId, quarterId, timeRange)
      .then(stream => {
        const fileName =
          moment(timeRange.from).format('MM/YYYY') === moment(timeRange.to).format('MM/YYYY')
            ? `${moment(timeRange.to).format('YYYY-MM')}-${quarterId || wardId || 1}.xlsx`
            : `${moment(timeRange.from).format('YYYY-MM')}--${moment(timeRange.to).format('YYYY-MM')}-${quarterId ||
            wardId ||
            1}.xlsx`;
        const contentType = 'application/vnd.ms-excel';
        const contentDisposition = `attachment; filename=${fileName}`;
        return cb(null, stream, contentType, contentDisposition);
      })
      .catch(e => {
        cb(e);
      });
  };

  ClientMeterNumber.remoteMethod('exportExcelInvoiceSummaryGroupByGeo', {
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
