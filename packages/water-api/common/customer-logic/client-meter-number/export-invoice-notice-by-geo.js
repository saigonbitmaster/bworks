'use strict';
const path = require('path');
const fs = require('fs');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-timezone');
// const toStream = require('buffer-to-stream');
const aggregate = require('../../utils/aggregate');
const puppeteer = require('puppeteer');
const Handlebars = require("handlebars");
const httpError = require('http-errors');
const uuidV4 = require('uuid/v4');
// in phieu thu 
module.exports = ClientMeterNumber => {
  const getData = async (wardId, quarterId, month) => {
    let quarterIds = []
    if (quarterId) { quarterIds.push(ObjectID(quarterId)) }
    else {
      let _quarterIds = await ClientMeterNumber.app.models.GeoQuarter.find({ where: { wardId: wardId } });
      quarterIds = _quarterIds.map(item => ObjectID(item.id))
    }
    let _month = moment(month).format('M');
    let _year = moment(month).format('YYYY');
    let mongoQuery = [
      {
        $match: { "quarterId": { "$in": quarterIds } }
      },
      {
        $project: { "_id": 1 }
      },
      {
        $lookup: {
          from: "ClientMeterNumber",
          localField: "_id",
          foreignField: "clientId",
          as: "meterNumber"
        }
      },
      {
        $unwind: "$meterNumber"
      },
      {
        $replaceRoot: {
          newRoot: "$meterNumber"
        }
      },
      { $match: { $and: [{ $expr: { $lt: ["$previousNumber", "$currentNumber"] } }, { $expr: { $eq: [{ $year: "$toDate" }, +_year] } }, { $expr: { $eq: [{ $month: "$toDate" }, +_month] } }] } },
      {
        $project:
        {
          fromDate: "$fromDate",
          toDate: "$toDate",
          client: {
            name: '$invoiceData.client.name',
            formattedAddress: '$invoiceData.client.formattedAddress',
            code: '$invoiceData.client.code',
            taxNo: '$invoiceData.client.taxNo'
          },
          oldMeterNumber: "$previousNumber",
          newMeterNumber: "$currentNumber",
          totalWaterUsed: "$invoiceData.totalWaterUsed",
          waterFee: '$invoiceData.waterFee',
          taxFee: "$invoiceData.taxFee",
          sewageFee: "$invoiceData.sewageFee",
          totalFee: "$invoiceData.totalFee",
          taxPercent: "$invoiceData.taxPercent",
          sewagePercent: "$invoiceData.sewagePercent",
          details: "$invoiceData.details",
        }
      },
      {
        $lookup: {
          "from": "CtmCompany",
          "pipeline": [
            { $limit: 1 }
          ],
          "as": "sellerInfo"
        }
      },
      { $unwind: "$sellerInfo" },
      { $addFields: { date: new Date() } }
    ];
    let invoiceData
    try {
      let _invoiceData = await aggregate(ClientMeterNumber.app.models.Client, mongoQuery);
      //update last invoiceNoticeNo
      let ctmCompany = await ClientMeterNumber.app.models.CtmCompany.find({ limit: 1 });
      await ctmCompany[0].updateAttributes({ invoiceNoticeNo: ctmCompany[0].invoiceNoticeNo + _invoiceData.length })
      invoiceData = _invoiceData.map((item, index) => { item.invoiceNoticeNo = item.sellerInfo.invoiceNoticeNo + index; return item });
    }
    catch (error) {
      console.log("lỗi dữ liệu tại: ", error.message, path.basename(__filename))
      throw error;
    }

    return invoiceData
  };

  const getDataByMeterNumberIds = async (meterNumberIds) => {


    let mongoQuery = [
      { $match: { "_id": { "$in": meterNumberIds } } },
      {
        $project:
        {
          fromDate: "$fromDate",
          toDate: "$toDate",
          client: {
            name: '$invoiceData.client.name',
            formattedAddress: '$invoiceData.client.formattedAddress',
            code: '$invoiceData.client.code',
            taxNo: '$invoiceData.client.taxNo'
          },
          oldMeterNumber: "$previousNumber",
          newMeterNumber: "$currentNumber",
          totalWaterUsed: "$invoiceData.totalWaterUsed",
          waterFee: '$invoiceData.waterFee',
          taxFee: "$invoiceData.taxFee",
          sewageFee: "$invoiceData.sewageFee",
          totalFee: "$invoiceData.totalFee",
          taxPercent: "$invoiceData.taxPercent",
          sewagePercent: "$invoiceData.sewagePercent",
          details: "$invoiceData.details",
        }
      },
      {
        $lookup: {
          "from": "CtmCompany",
          "pipeline": [
            { $limit: 1 }
          ],
          "as": "sellerInfo"
        }
      },
      { $unwind: "$sellerInfo" },
      { $addFields: { date: new Date() } }
    ];
    let invoiceData
    try {
      let _invoiceData = await aggregate(ClientMeterNumber, mongoQuery);
      //update last invoiceNoticeNo
      let ctmCompany = await ClientMeterNumber.app.models.CtmCompany.find({ limit: 1 });
      await ctmCompany[0].updateAttributes({ invoiceNoticeNo: ctmCompany[0].invoiceNoticeNo + _invoiceData.length })
      invoiceData = _invoiceData.map((item, index) => { item.invoiceNoticeNo = item.sellerInfo.invoiceNoticeNo + index; return item });
    }
    catch (error) {
      console.log("lỗi dữ liệu tại: ", error.message, path.basename(__filename))
      throw error;
    }
    return invoiceData
  };

  let createMultiInvoices = async (hbsFile, wardId, quarterId, month, cb) => {
    let data = await getData(wardId, quarterId, month)
    let htmlHbsFile = `${path.dirname(__dirname)}/../../tempSpreadSheet/hbs/generated/${uuidV4()}invoices.html`;
    const contentType = "application/pdf";
    const contentDisposition = 'attachment; filename=invoices.pdf';
    try {
    let template = await fs.promises
      .readFile(hbsFile, "utf8")
      .then((buffer) => Handlebars.compile(buffer, { noEscape: true }));
    let result = template(data);
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROME_BIN,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    await fs.promises.writeFile(htmlHbsFile, result);
    await page.goto("file://" + htmlHbsFile, {
      waitUntil: "networkidle0",
    });
    await page
      .pdf({ format: "A5", printBackground: true })
      .then((dataBuffer) =>
        cb(null, dataBuffer, contentType, contentDisposition)
      );
      await browser.close();
      await browser.disconnect();
    }
    catch (error) {
      throw error;
    }
   
  };

  let createSingleInvoice = async (hbsFile, clientMeterNumberIds, cb) => {
    let data = await getDataByMeterNumberIds(clientMeterNumberIds)
    let htmlHbsFile = `${path.dirname(__dirname)}/../../tempSpreadSheet/hbs/generated/${uuidV4()}invoice.html`;
    const contentType = "application/pdf";
    const contentDisposition = 'attachment; filename=invoice.pdf';
try {
    let template = await fs.promises
      .readFile(hbsFile, "utf8")
      .then((buffer) => Handlebars.compile(buffer, { noEscape: true }));
    let result = template(data);
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROME_BIN,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    await fs.promises.writeFile(htmlHbsFile, result);
    await page.goto("file://" + htmlHbsFile, {
      waitUntil: "networkidle0",
    });
    await page
      .pdf({ format: "A5", printBackground: true })
      .then((dataBuffer) =>
        cb(null, dataBuffer, contentType, contentDisposition)
      );
    await browser.close();
    await browser.disconnect();
  }
  catch (error) {
    throw error;
  }
  };

  ClientMeterNumber.exportInvoiceNoticeGroupByGeo = (wardId, quarterId, month, cb) => {
     //invoiceTableMultiLines 
    //createMultiInvoices(`${path.dirname(__dirname)}/../../tempSpreadSheet/hbs/invoiceTable.hbs`, wardId, quarterId, month, cb);
    createMultiInvoices(`${path.dirname(__dirname)}/../../tempSpreadSheet/hbs/invoiceTableMultiLines.hbs`, wardId, quarterId, month, cb);
  };

  ClientMeterNumber.exportInvoiceNoticeByMeterNumberId = (meterNumberId, cb) => {
    let meterNumberIds = [];
    if (!meterNumberId) {
      throw httpError(400, 'error.NO_SELECTED_meterNumberId');
    }
   
    meterNumberIds.push(meterNumberId);
    createSingleInvoice(`${path.dirname(__dirname)}/../../tempSpreadSheet/hbs/invoiceTableMultiLines.hbs`, meterNumberIds, cb);

  };

  ClientMeterNumber.remoteMethod('exportInvoiceNoticeByMeterNumberId', {
    isStatic: true,
    accepts: [

      { arg: 'meterNumberId', type: 'string', required: true },
    ],
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
    // returns: { arg: 'data', type: 'object', root: true },
  });

  ClientMeterNumber.remoteMethod('exportInvoiceNoticeGroupByGeo', {
    isStatic: true,
    accepts: [
      { arg: 'wardId', type: 'string', required: true },
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
