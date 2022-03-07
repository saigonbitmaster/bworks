const moment = require('moment-timezone');
const format = require('../../../common/utils/formatEInvoiceData');

const eInvoice = {
  // eslint-disable-next-line no-unused-vars
  createEInvoice: async function({ app, options }) {
    //let {clientMeterNumberItem, company } = options;
    //let company = await app.models.CtmCompany.find({limit: 1});
    //for testing use hardcode data from below template
    let sellerInfo = dataTemplate.company[0];
    let clientMeterNumberItem = dataTemplate.clientMeterNumberItem;
    let data = format.newInvoice(sellerInfo, clientMeterNumberItem);
    let result = await app.models.EInvoice.sendRequest({
      method: 'createEInvoice',
      params: { data, requestType: 'createNewInvoice' },
    });
    let EInvoiceData = format.resultData(result, clientMeterNumberItem, data.generalInvoiceInfo.transactionUuid);
    await app.models.EInvoiceData.create(EInvoiceData);
    return result;
  },
  // eslint-disable-next-line no-unused-vars
  replaceEInvoice: async function({ app, options }) {
    //let {originalInvoiceId, additionalReferenceDate, additionalReferenceDesc, invoiceNote } = options;
    //let company = await app.models.CtmCompany.find({limit: 1});
    //for testing use hardcode data from below template
    let hardReplaceData = dataTemplate.replaceData;
    let originalInvoice = await app.models.EInvoiceData.find({
      where: { eInvoiceNo: hardReplaceData.originalInvoiceId },
    });
    let originalInvoiceIssueDate = originalInvoice[0].eInvoiceDate.valueOf();
    let clientMeterNumberItem = originalInvoice[0].clientMeterNumberItem;
    let sellerInfo = dataTemplate.company[0];
    let replaceData = {
      originalInvoiceId: hardReplaceData.originalInvoiceId,
      additionalReferenceDesc: hardReplaceData.additionalReferenceDesc,
      invoiceNote: hardReplaceData.invoiceNote,
      additionalReferenceDate: hardReplaceData.additionalReferenceDate,
      originalInvoiceIssueDate: originalInvoiceIssueDate,
    };

    let data = format.replaceInvoice(sellerInfo, clientMeterNumberItem, replaceData);
    let result = await app.models.EInvoice.sendRequest({
      method: 'createEInvoice',
      params: { data, requestType: 'replaceInvoice' },
    });
    let EInvoiceData = format.resultData(result, clientMeterNumberItem, data.generalInvoiceInfo.transactionUuid);
    await app.models.EInvoiceData.create(EInvoiceData);
    return result;
  },
};

const dataTemplate = {
  company: [
    {
      name: 'Bworks',
      taxNum: '1111',
      address: '222',
      phone: '333',
      creditCards: [
        {
          bankName: 'VCB',
          bankAccount: '1111',
        },
      ],
    },
  ],
  clientMeterNumberItem: {
    id: '5bbdd99d24823e40af6ec164-2018-10',
    fromDate: moment('2018-09-14T17:00:00.000+0000').toDate(),
    toDate: moment('2018-10-14T17:00:00.000+0000').toDate(),
    previousNumber: 100,
    currentNumber: 150,
    paymentStatus: false,
    clientId: '5bbdd99d24823e40af6ec164',
    createdDate: moment('2018-10-15T09:02:31.616+0000').toDate(),
    updatedDate: moment('2018-10-15T09:02:31.616+0000').toDate(),
    creatorId: '1a1a1a1a1a1a1a1a1a1a1a1a',
    updaterId: '1a1a1a1a1a1a1a1a1a1a1a1a',
    description: '',
    invoiceData: {
      details: [
        {
          waterUsed: 10,
          from: 0,
          to: 10,
          factor: 1,
          name: '1',
          price: 10000,
          toFee: 100000,
        },
        {
          waterUsed: 10,
          from: 10,
          to: 20,
          factor: 1,
          name: '2',
          price: 20000,
          toFee: 200000,
        },
        {
          waterUsed: 30,
          from: 20,
          to: 50,
          factor: 1,
          name: '3',
          price: 30000,
          toFee: 900000,
        },
      ],
      sewagePercent: 5,
      sewageFee: 60000,
      taxPercent: 10,
      taxFee: 120000,
      waterFee: 1200000,
      totalFee: 1380000,
      totalWaterUsed: 50,
      invoiceNo: '0000090',
      client: {
        formattedAddress: '123, Khu pho 1, Phuong Phuoc Long B, Quan 9, Tp Ho Chi Minh',
        name: 'Trần văn teo',
        type: 'ORGANIZATION',
        memberCount: 1,
        familyCount: 1,
        contractNo: '11',
      },
      fromDate: moment('2018-09-14T17:00:00.000+0000').toDate(),
      toDate: moment('2018-10-14T17:00:00.000+0000').toDate(),
      oldMeterNumber: 100,
      newMeterNumber: 150,
    },
  },
  replaceData: {
    originalInvoiceId: 'FS/18E0000658',
    additionalReferenceDesc: 'Ghi chú thay thế hoá đơn',
    invoiceNote: 'Thay thế hoá đơn',
    additionalReferenceDate: moment().valueOf(),
  },
};

module.exports = eInvoice;
