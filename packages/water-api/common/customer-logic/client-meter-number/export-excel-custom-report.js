'use strict';
const path = require('path');
const fs = require('fs');
const has = require('lodash/has');
const createError = require('http-errors');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-timezone');
const XlsxTemplate = require('xlsx-template');
const aggregate = require('../../utils/aggregate');

//Bao cao tram cap nuoc tuy chon
module.exports = ClientMeterNumber => {
  const invoiceTemplatePath = path.join(
    `${__dirname}/../../../tempSpreadSheet/excel/template/`,
    'waterStationInvoiceTemplate.xlsx',
  );
  const byStaffTemplatePath = path.join(
    `${__dirname}/../../../tempSpreadSheet/excel/template/`,
    'waterStationByStaffTemplate.xlsx',
  );
  const byFormulaTemplatePath = path.join(
    `${__dirname}/../../../tempSpreadSheet/excel/template/`,
    'waterStationByFormulaTemplate.xlsx',
  );

  // `${path.dirname(__dirname)}/../../tempSpreadSheet/excel/template/`;

  const contentType = 'application/vnd.ms-excel';
  const contentDisposition = 'attachment;filename=report.xlsx';

  const reportByStaff = async (geoGroupId, reportType, month, cb) => {
    let _quarters = await ClientMeterNumber.app.models.GeoQuarter.find({ where: { geoGroupId: geoGroupId } });
    let quarters = _quarters.map(item => ObjectID(item.id));

    let monthBegin = moment(month, 'YYYY-MM-DD')
      .add(1, 'M')
      .startOf('month')
      .toDate();
    let monthEnd = moment(month, 'YYYY-MM-DD')
      .add(1, 'M')
      .endOf('month')
      .toDate();
    let query = [
      {
        $match: {
          status: 'ACTIVE',
          quarterId: { $in: quarters },
        },
      },

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
                    { $gte: ['$toDate', monthBegin] },
                    { $lte: ['$toDate', monthEnd] },
                  ],
                },
              },
            },

            {
              $project: {
                previousNumber: 1,
                currentNumber: 1,
                totalWaterUsed: 1,
                invoiceData: 1,
                updaterId: 1,
              },
            },
          ],
          as: 'term',
        },
      },
      { $unwind: '$term' },

      {
        $lookup: {
          from: 'Formula',
          localField: 'formulaId',
          foreignField: '_id',
          as: 'formula',
        },
      },
      { $unwind: '$formula' },
      {
        $project: {
          _id: 1,
          name: 1,
          code: 1,
          formattedAddress: 1,
          formulaId: 1,
          taxNo: 1,
          quarterId: 1,
          waterFee: '$term.invoiceData.waterFee',
          taxFee: '$term.invoiceData.taxFee',
          sewageFee: '$term.invoiceData.sewageFee',
          totalFee: '$term.invoiceData.totalFee',
          oldMeterNumber: '$term.previousNumber',
          newMeterNumber: '$term.currentNumber',
          totalWaterUse: '$term.invoiceData.totalWaterUsed',
          updaterId: '$term.updaterId',
          serial: 1,
          contractNo: 1,
          formulaName: '$formula.name',
        },
      },
    ];
    let _data = await aggregate(ClientMeterNumber.app.models.Client, query);
    let staff = await ClientMeterNumber.app.models.AppUser.find();

    let data = _data.map((item, index) => {
      let updaterId = item.updaterId;
      let quarterId = item.quarterId;
      item.staffName = staff.filter(staffItem => staffItem.id.toString() === updaterId.toString())[0].fullName;
      item.quarterName = _quarters.filter(
        quarterItem => quarterItem.id.toString() === quarterId.toString(),
      )[0].fullName;
      item.index = index + 1;
      return item;
    });
    let company = await ClientMeterNumber.app.models.CtmCompany.findOne({ where: { active: true } });
    if (!company) {
      company = { name: 'Bworks' };
    }
    let geoGroup = await ClientMeterNumber.app.models.GeoGroup.findOne({ where: { id: geoGroupId } });
    let reportMonth = moment(month, 'YYYY-MM-DD')
      .add(1, 'M')
      .format('MM-YYYY');
    //group data by staff
    const sheet1Data = { data: data, company: company, reportMonth: reportMonth, geoGroup: geoGroup };
    const groupDataByStaff = data.reduce((value, item) => {
      value[item.staffName] = [...(value[item.staffName] || []), item];
      return value;
    }, {});

    let _sumDataByStaff = [];
    for (let item in groupDataByStaff) {
      let value = groupDataByStaff[item].reduce((value, item) => {
        let totalWaterUse = value.totalWaterUse || 0;
        let totalWaterFee = value.totalWaterFee || 0;
        let totalTax = value.totalTax || 0;
        let totalSewageFee = value.totalSewageFee || 0;
        let totalFee = value.totalFee || 0;
        value.totalWaterUse = totalWaterUse + item.totalWaterUse || 0;
        value.totalWaterFee = totalWaterFee + item.waterFee || 0;
        value.totalSewageFee = totalSewageFee + item.sewageFee || 0;
        value.totalTax = totalTax + item.taxFee || 0;
        value.totalFee = totalFee + item.totalFee || 0;
        return value;
      }, {});
      value.staffName = item;
      _sumDataByStaff.push(value);
    }
    let sumDataByStaff = _sumDataByStaff.map((item, index) => {
      item.index = index + 1;
      return item;
    });

    //group data by formula
    const groupDataByFormula = data.reduce((value, item) => {
      value[item.formulaName] = [...(value[item.formulaName] || []), item];
      return value;
    }, {});
    let _sumDataByFormula = [];
    for (let item in groupDataByFormula) {
      let value = groupDataByFormula[item].reduce((value, item) => {
        let totalWaterUse = value.totalWaterUse || 0;
        let totalWaterFee = value.totalWaterFee || 0;
        let totalTax = value.totalTax || 0;
        let totalSewageFee = value.totalSewageFee || 0;
        let totalFee = value.totalFee || 0;
        value.totalWaterUse = totalWaterUse + item.totalWaterUse || 0;
        value.totalWaterFee = totalWaterFee + item.waterFee || 0;
        value.totalSewageFee = totalSewageFee + item.sewageFee || 0;
        value.totalTax = totalTax + item.taxFee || 0;
        value.totalFee = totalFee + item.totalFee || 0;
        return value;
      }, {});
      value.formulaName = item;
      _sumDataByFormula.push(value);
    }
    let sumDataByFormula = _sumDataByFormula.map((item, index) => {
      item.index = index + 1;
      return item;
    });

    //group data by quarter
    const groupDataByQuarter = data.reduce((value, item) => {
      value[item.quarterName] = [...(value[item.quarterName] || []), item];
      return value;
    }, {});
    let _groupDataByQuarter = [];
    for (let item in groupDataByQuarter) {
      let value = groupDataByQuarter[item].reduce((value, item) => {
        let totalWaterUse = value.totalWaterUse || 0;
        let totalWaterFee = value.totalWaterFee || 0;
        let totalTax = value.totalTax || 0;
        let totalSewageFee = value.totalSewageFee || 0;
        let totalFee = value.totalFee || 0;
        let totalClient = value.totalClient || 0;
        let totalClientHasInvoice = value.totalClientHasInvoice || 0;
        value.totalWaterUse = totalWaterUse + item.totalWaterUse || 0;
        value.totalWaterFee = totalWaterFee + item.waterFee || 0;
        value.totalSewageFee = totalSewageFee + item.sewageFee || 0;
        value.totalTax = totalTax + item.taxFee || 0;
        value.totalFee = totalFee + item.totalFee || 0;
        value.totalClient = totalClient + 1;
        value.totalClientHasInvoice = item.totalWaterUse > 0 ? totalClientHasInvoice + 1 : totalClientHasInvoice;
        return value;
      }, {});
      value.quarterName = item;
      _groupDataByQuarter.push(value);
    }

    let _allStaffs = await aggregate(ClientMeterNumber.app.models.AppUser, [
      { $match: { quarterInChargeIds: { $in: quarters } } },
      { $project: { quarterInChargeIds: 1, fullName: 1 } },
    ]);
    let _allQuarters = await aggregate(ClientMeterNumber.app.models.GeoQuarter, []);

    let allStaffs = _allStaffs.map(item => {
      if (item.quarterInChargeIds.length == 0) {
        item.quarterNames = [];
        return item;
      }
      let quarterInChargeNames = item.quarterInChargeIds;
      let quarterNames = quarterInChargeNames.map(
        item1 => _allQuarters.filter(qItem => qItem._id.toString() == item1.toString())[0].fullName,
      );
      item.quarterNames = quarterNames;
      return item;
    });

    let sumDataByQuarter = _groupDataByQuarter.map((item, index) => {
      let staffList = allStaffs.filter(item1 => {
        let staffs = item1.quarterNames.length > 0 ? item1.quarterNames.includes(item.quarterName) : [];
        return staffs;
      });
      let staffNames = staffList.map(item => item.fullName).join(', ');
      item.staffNames = staffNames;
      item.index = index + 1;
      return item;
    });

    const sheet3Data = { data: sumDataByFormula, company: company, reportMonth: reportMonth, geoGroup: geoGroup };
    const sheet2Data = { data: sumDataByStaff, company: company, reportMonth: reportMonth, geoGroup: geoGroup };
    const sheet4Data = { data: sumDataByQuarter, company: company, reportMonth: reportMonth, geoGroup: geoGroup };


    if (reportType == 'reportByStaff') {
      const templateData = fs.readFileSync(byStaffTemplatePath);
      const template = new XlsxTemplate(templateData);
      template.substitute(1, sheet1Data);
      template.substitute(2, sheet2Data);
      const buffer = template.generate({ type: 'nodebuffer' });
      return cb(null, buffer, contentType, contentDisposition);
    }
    if (reportType == 'reportByFormula') {
      const templateData = fs.readFileSync(byFormulaTemplatePath);
      const template = new XlsxTemplate(templateData);   
      template.substitute(1, sheet3Data);
      const buffer = template.generate({ type: 'nodebuffer' });
      return cb(null, buffer, contentType, contentDisposition);
    }
    if (reportType == 'reportInvoice') {
      const templateData = fs.readFileSync(invoiceTemplatePath);
      const template = new XlsxTemplate(templateData);
      template.substitute(1, sheet4Data);
      const buffer = template.generate({ type: 'nodebuffer' });
      return cb(null, buffer, contentType, contentDisposition);
    }
  };

  ClientMeterNumber.customReport = (geoGroupId, reportType, month, cb) => {
    reportByStaff(geoGroupId, reportType, month, cb);

    //  cb(null);
  };

  ClientMeterNumber.remoteMethod('customReport', {
    isStatic: true,
    accepts: [
      { arg: 'geoGroupId', type: 'string', required: true },
      { arg: 'reportType', type: 'string', required: true },
      { arg: 'month', type: 'string', required: true },
    ],
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
