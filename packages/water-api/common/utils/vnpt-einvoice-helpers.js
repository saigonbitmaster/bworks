const soapRequest = require('easy-soap-request');
const xml2js = require('xml2js');
const moment = require('moment-timezone');
const set = require('lodash/set');
const get = require('lodash/get');
const httpError = require('http-errors');
const numberToWord = require('ra-loopback3/server/utils/number-to-word');

const headerGenerator = (action, customHeader) => ({
  'user-agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
  'Content-Type': 'text/xml;charset=UTF-8',
  soapAction: `http://tempuri.org/${action}`,
  ...customHeader,
});

const xmlGenerator = (json, builderOptions) => {
  if (builderOptions && typeof builderOptions !== 'object') {
    throw new Error('Given XML Builder option is not object');
  }
  let defaultBuilderOptions = { headless: true, cdata: true };
  if (builderOptions) {
    defaultBuilderOptions = { ...defaultBuilderOptions, ...builderOptions };
  }
  const xmlBuilder = new xml2js.Builder(defaultBuilderOptions);
  const xml = xmlBuilder
    .buildObject(json)
    .replace('<root>', '')
    .replace('</root>', '');
  return xml;
};

const soapEnvelopeGenerator = (action, payload) => {
  const xmlPayload = xmlGenerator(payload);
  return `
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <${action} xmlns="http://tempuri.org/">
            ${xmlPayload}
            </${action}>
        </soap:Body>
        </soap:Envelope>
    `;
};

const getDataFromSoapResult = async (action, body) => {
  const xmlParser = new xml2js.Parser();
  const parsedData = await new Promise((resolve, reject) =>
    xmlParser.parseString(body, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    }),
  );
  const data = parsedData['soap:Envelope']['soap:Body'][0][`${action}Response`][0][`${action}Result`][0];
  if (!data) {
    return parsedData;
  }
  return data;
};

const api = {
  WebService: ({ webServiceHost }) => webServiceHost,
  PublishService: ({ publishServiceHost }) => publishServiceHost,
  PortalService: ({ portalServiceHost }) => portalServiceHost,
  BusinessService: ({ businessServiceHost }) => businessServiceHost,
};

/* const api = {
  WebService: 'https://vesinhmoitruongnongthonadmindemo.vnpt-invoice.com.vn/WebService.asmx',
  PublishService: 'https://vesinhmoitruongnongthonadmindemo.vnpt-invoice.com.vn/PublishService.asmx',
  PortalService: 'https://vesinhmoitruongnongthonadmindemo.vnpt-invoice.com.vn/PortalService.asmx',
  BusinessService: 'https://vesinhmoitruongnongthonadmindemo.vnpt-invoice.com.vn/BusinessService.asmx',
}; */

//https://vesinhmoitruongnongthonadmindemo.vnpt-invoice.com.vn/publishservice.asmx
//https://vesinhmoitruongnongthonadmindemo.vnpt-invoice.com.vn/businessservice.asmx
//https://vesinhmoitruongnongthonadmindemo.vnpt-invoice.com.vn/portalservice.asmx

const pushDataToServer = async (customerData, credential, fixUrl) => {
  const action = 'UpdateCus';
  let url = api.PublishService(credential);
  if (fixUrl) {
    url = fixUrl(url);
  }
  const headers = headerGenerator(action);

  let customers = [];
  if (Array.isArray(customerData)) {
    customers = customerData;
  } else {
    customers = [customerData];
  }

  const customerItems = [];
  for (const customer of customers) {
    if (!customer.email) {
      if (process.env.DEFAULT_INVOICE_MAIL) {
        customer.email = process.env.DEFAULT_INVOICE_MAIL;
      } else {
        throw httpError(400, 'error.NO_EMAIL_FOR_EINVOICE');
      }
    }

    const customerItem = {
      Name: customer.name,
      Code: customer.code,
      Address: customer.formattedAddress,
      Email: customer.email,
      CusType: customer.type === 'RESIDENT' ? 0 : 1,
    };
    if (customerItem.CusType !== 0) {
      customerItem.TaxCode = customer.taxNo;
    }

    customerItems.push(customerItem);
  }

  const data = {
    Customers: { Customer: customerItems },
  };

  const xmlCustData = xmlGenerator(data);
  const payload = {
    XMLCusData: xmlCustData,
    username: credential.apiUsername,
    pass: credential.apiPassword,
  };

  const xmlPayload = soapEnvelopeGenerator(action, payload);

  const {
    response: { body },
  } = await soapRequest({ url, headers, xml: xmlPayload });
  const result = await getDataFromSoapResult(action, body);

  return result;
};

const setInvoiceDataToCore = (clientData, invoiceCreatedDate) => {
  const data = {};

  const client = get(clientData, 'invoiceData.client');
  const paidDuration = moment(
    clientData._id
      .split('-')
      .slice(1)
      .join('-'),
    'YYYY-MM',
  ).format('MM/YYYY');
  set(data, 'CusCode', client.code);
  set(data, 'CusName', client.name);
  set(data, 'CusTaxCode', client.taxNo);
 // set(data, 'ComTaxCode', client.taxCode);
  set(data, 'CusAddress', client.formattedAddress);
  set(data, 'PaymentMethod', 'TM/CK');
  set(data, 'KindOfService', paidDuration);

  const invoiceData = get(clientData, 'invoiceData');
  set(data, 'NGAY_DOC_DAU', moment(clientData.fromDate).format('DD/MM/YYYY'));
  set(data, 'NGAY_DOC_CUOI', moment(clientData.toDate).format('DD/MM/YYYY'));
  set(data, 'CHI_SO_DAU_KY', clientData.invoiceData.oldMeterNumber);
  set(data, 'CHI_SO_CUOI_KY', clientData.invoiceData.newMeterNumber);
  set(data, 'SAN_LUONG', invoiceData.totalWaterUsed);
  set(data, 'Total', invoiceData.waterFee);
  set(data, 'VATRate', invoiceData.taxPercent);
  set(data, 'VATAmount', invoiceData.taxFee);
  set(data, 'PHI_BVMT', invoiceData.sewageFee);
  set(data, 'Amount', invoiceData.totalFee);
  set(data, 'Sumptions.Sumption.CHI_SO_DAU_KY', clientData.invoiceData.oldMeterNumber);
  set(data, 'Sumptions.Sumption.CHI_SO_CUOI_KY', clientData.invoiceData.newMeterNumber);
  set(data, 'Sumptions.Sumption.SAN_LUONG', invoiceData.totalWaterUsed);
  set(data, 'Sumptions.Sumption.MA_TINH_TRANG_DH', 1);
  set(data, 'AmountInWords', numberToWord(invoiceData.totalFee));
  set(
    data,
    'ArisingDate',
    invoiceCreatedDate.endsWith('Z')
      ? moment(invoiceCreatedDate).format('DD/MM/YYYY')
      : moment(invoiceCreatedDate, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY'),
  );
  set(data, 'PaymentStatus', 0);

  const products = invoiceData.details.map(item => ({
    ProdName: item.name,
    ProdUnit: 'm3',
    ProdQuantity: item.to - item.from,
    ProdPrice: item.price,
    Amount: item.toFee,
  }));
  set(data, `Products.Product`, products);

  return data;
};

const createInvoice = async (customerData, invoiceCreatedDate, credential) => {
  const action = 'ImportAndPublishInv';
  const url = api.PublishService(credential);
  const headers = headerGenerator(action);

  let customers = [];
  if (Array.isArray(customerData)) {
    customers = customerData;
  } else {
    customers = [customerData];
  }

  const customerItems = [];
  for (const customer of customers) {
    const key = customer.key;
    const customerItem = {
      key,
      Invoice: setInvoiceDataToCore(customer, invoiceCreatedDate),
    };
    customerItems.push(customerItem);
  }

  const invoiceData = {
    Invoices: {
      Inv: customerItems,
    },
  };

  const xmlInvoiceData = xmlGenerator(invoiceData);

  const payload = {
    Account: credential.webUsername,
    ACpass: credential.webPassword,
    xmlInvData: xmlInvoiceData,
    username: credential.apiUsername,
    pass: credential.apiPassword,
    pattern: credential.templateCode,
    serial: credential.invoiceSeries,
  };

  const xmlPayload = soapEnvelopeGenerator(action, payload);

  const {
    response: { body },
  } = await soapRequest({ url, headers, xml: xmlPayload });
  const result = await getDataFromSoapResult(action, body);
  return result;
};

const replaceInvoice = async (clientData, invoiceCreatedDate, replacedInvoice, einvoiceCredential) => {
  const action = 'ReplaceInvoice';
  const url = api.BusinessService(einvoiceCredential);
  const headers = headerGenerator(action);

  const key = get(clientData, 'key');

  const xmlInvDataJson = {
    ReplaceInv: setInvoiceDataToCore(clientData, invoiceCreatedDate),
  };

  set(xmlInvDataJson, 'ReplaceInv.key', key);

  const xmlInvData = xmlGenerator(xmlInvDataJson);

  const payload = {
    Account: einvoiceCredential.webUsername,
    ACpass: einvoiceCredential.webPassword,
    xmlInvData,
    username: einvoiceCredential.apiUsername,
    pass: einvoiceCredential.apiPassword,
    fkey: replacedInvoice.eInvoiceNo,
  };
  const xmlPayload = soapEnvelopeGenerator(action, payload);

  const {
    response: { body },
  } = await soapRequest({ url, headers, xml: xmlPayload });
  const result = await getDataFromSoapResult(action, body);

  return result;
};

const cancelInvoice = async (eInvoiceCredential, invoiceKey) => {
  const action = 'cancelInv';
  const url = api.BusinessService(eInvoiceCredential);
  const headers = headerGenerator(action);

  const payload = {
    Account: eInvoiceCredential.webUsername,
    ACpass: eInvoiceCredential.webPassword,
    fkey: invoiceKey,
    userName: eInvoiceCredential.apiUsername,
    userPass: eInvoiceCredential.apiPassword,
  };
  const xmlPayload = soapEnvelopeGenerator(action, payload);
console.log("soap payload", payload,xmlPayload )
  const {
    response: { body },
  } = await soapRequest({ url, headers, xml: xmlPayload });
  const result = await getDataFromSoapResult(action, body);

  return result;
};

const downloadInvoice = async (invoiceNo, eInvoiceCredential) => {
  // vnpt thanh hoa
  const action = 'downloadInvPDFFkeyNoPay';
  const url = api.PortalService(eInvoiceCredential);
  const headers = headerGenerator(action);

  const payload = {
    fkey: invoiceNo,
    userName: eInvoiceCredential.apiUsername,
    userPass: eInvoiceCredential.apiPassword,
  };

  const xmlPayload = soapEnvelopeGenerator(action, payload);

  const {
    response: { body },
  } = await soapRequest({ url, headers, xml: xmlPayload });
  const result = await getDataFromSoapResult(action, body);

  return result;
};

const formatEinvoiceOutput = (clientMeterNumberItem, invoiceIssuedDate, einvoiceCredential) => {
  const data = {};
  data._id = clientMeterNumberItem.id || clientMeterNumberItem._id;
  delete data.id;
  data.clientName = clientMeterNumberItem.invoiceData.client.name;
  data.termInvoice = moment(clientMeterNumberItem.toDate)
    .startOf('month')
    .toDate();
  data.eInvoiceNo = clientMeterNumberItem.key;
  data.tax = einvoiceCredential.supplierTaxCode;
  data.templateCode = einvoiceCredential.templateCode;
  data.eInvoiceDate = invoiceIssuedDate ? moment(invoiceIssuedDate).toDate() : moment().toDate();
  data.clientMeterNumberItem = clientMeterNumberItem;
  data.canceled = false;
  return data;
};

module.exports = {
  headerGenerator,
  xmlGenerator,
  soapEnvelopeGenerator,
  getDataFromSoapResult,
  pushDataToServer,
  createInvoice,
  replaceInvoice,
  downloadInvoice,
  cancelInvoice,
  formatEinvoiceOutput,
};
