const moment = require('moment-timezone');
const uuidV4 = require('uuid/v4');
const numberToWord = require('ra-loopback3/server/utils/number-to-word');

let currentDate = moment();
let eInvoiceDate = currentDate.valueOf();

const format = {
  newInvoice: (sellerInfo, clientMeterNumberItem, einvoiceData) => {
    let data = {},
      itemInfos = {},
      itemInfo = {};
    const taxPercentage =
      clientMeterNumberItem.invoiceData.taxPercent + clientMeterNumberItem.invoiceData.sewagePercent;
    let realTaxPercentage = taxPercentage;
    if (taxPercentage % 1 === 0) {
      realTaxPercentage = realTaxPercentage / 100;
    }
    itemInfos = clientMeterNumberItem.invoiceData.details.map(item => {
      itemInfo = {
        lineNumber: parseInt(item.rank),
        itemCode: item.from.toString() + '-' + item.to.toString(),
        itemName: item.name,
        unitName: 'm3',
        unitPrice: item.price,
        quantity: item.waterUsed,
        itemTotalAmountWithoutTax: item.toFee,
        taxPercentage,
        taxAmount: item.toFee * realTaxPercentage,
        discount: 0,
        itemDiscount: 0,
      };
      return itemInfo;
    });

    data = {
      generalInvoiceInfo: {
        invoiceType: '01GTKT',
        templateCode: einvoiceData.templateCode,
        invoiceSeries: einvoiceData.invoiceSeries,
        transactionUuid: uuidV4(),
        invoiceIssuedDate: clientMeterNumberItem.invoiceIssuedDate
          ? moment(clientMeterNumberItem.invoiceIssuedDate).valueOf()
          : eInvoiceDate,
        currencyCode: 'VND',
        adjustmentType: '1',
        paymentStatus: true, // must be true to enable revoke and replace invoice
        paymentType: 'TM/CK',
        paymentTypeName: 'TM/CK',
        cusGetInvoiceRight: true,
      },
      buyerInfo: {
        buyerName: clientMeterNumberItem.invoiceData.client.name,
        buyerLegalName: clientMeterNumberItem.invoiceData.client.name,
        buyerAddressLine: clientMeterNumberItem.invoiceData.client.formattedAddress,
        buyerCode: clientMeterNumberItem.invoiceData.client.code,
      },
      sellerInfo: {
        sellerLegalName: sellerInfo.name,
        sellerTaxCode: sellerInfo.taxNum,
        sellerAddressLine: sellerInfo.address,
        sellerPhoneNumber: sellerInfo.phone,
        // sellerBankName: sellerInfo.creditCards[0].bankName,
        // sellerBankAccount: sellerInfo.creditCards[0].bankAccount,
      },
      extAttribute: [],
      payments: [
        {
          paymentMethodName: 'TM/CK',
        },
      ],
      deliveryInfo: {},
      itemInfo: itemInfos,
      discountItemInfo: [],
      metadata: [
        {
          keyTag: 'month',
          valueType: 'number',
          numberValue: moment(clientMeterNumberItem.invoiceData.fromDate).month() + 1,
          keyLabel: 'Tháng',
        },
        {
          keyTag: 'year',
          valueType: 'number',
          numberValue: moment(clientMeterNumberItem.invoiceData.fromDate).year(),
          keyLabel: 'Năm',
        },
        {
          keyTag: 'householdNo',
          valueType: 'number',
          numberValue: parseInt(clientMeterNumberItem.invoiceData.client.familyCount, 10),
          keyLabel: 'Số hộ sử dụng',
        },
        {
          keyTag: 'startDate',
          valueType: 'date',
          dateValue: moment(clientMeterNumberItem.invoiceData.fromDate).valueOf(),
          keyLabel: 'Thời gian sử dụng từ ngày',
        },
        {
          keyTag: 'endDate',
          valueType: 'date',
          dateValue: moment(clientMeterNumberItem.invoiceData.toDate).valueOf(),
          keyLabel: 'Thời gian sử dụng đến ngày',
        },
      ],
      meterReading: [
        {
          previousIndex: clientMeterNumberItem.invoiceData.oldMeterNumber,
          currentIndex: clientMeterNumberItem.invoiceData.newMeterNumber,
          factor: '1',
          amount: clientMeterNumberItem.invoiceData.totalWaterUsed,
        },
      ],
      summarizeInfo: {
        sumOfTotalLineAmountWithoutTax: clientMeterNumberItem.invoiceData.waterFee,
        totalAmountWithoutTax: clientMeterNumberItem.invoiceData.waterFee,
        totalTaxAmount: clientMeterNumberItem.invoiceData.taxFee + clientMeterNumberItem.invoiceData.sewageFee,
        totalAmountWithTax: clientMeterNumberItem.invoiceData.totalFee,
        totalAmountWithTaxInWords: numberToWord(clientMeterNumberItem.invoiceData.totalFee),
        discountAmount: 0,
        settlementDiscountAmount: 0,
        taxPercentage: clientMeterNumberItem.invoiceData.taxPercent + clientMeterNumberItem.invoiceData.sewagePercent,
      },
      taxBreakdowns: [
        {
          taxPercentage: clientMeterNumberItem.invoiceData.taxPercent,
          taxableAmount: clientMeterNumberItem.invoiceData.waterFee,
          taxAmount: clientMeterNumberItem.invoiceData.taxFee,
        },
        {
          taxPercentage: clientMeterNumberItem.invoiceData.sewagePercent,
          taxableAmount: clientMeterNumberItem.invoiceData.waterFee,
          taxAmount: clientMeterNumberItem.invoiceData.sewageFee,
        },
      ],
    };
    return data;
  },
  replaceInvoice: (sellerInfo, clientMeterNumberItem, invoiceIssuedDate, einvoiceData, replaceData) => {
    let data = {},
      itemInfos = {},
      itemInfo = {};
    let originalInvoiceId = replaceData.originalInvoiceId;
    let additionalReferenceDesc = replaceData.additionalReferenceDesc;
    let invoiceNote = replaceData.invoiceNote;
    let additionalReferenceDate = replaceData.additionalReferenceDate;
    let originalInvoiceIssueDate = replaceData.originalInvoiceIssueDate;
    let currentDate = moment();
    let eInvoiceDate = invoiceIssuedDate ? moment(invoiceIssuedDate).valueOf() : currentDate.valueOf();
    const taxPercentage =
      clientMeterNumberItem.invoiceData.taxPercent + clientMeterNumberItem.invoiceData.sewagePercent;
    let realTaxPercentage = taxPercentage;
    if (taxPercentage % 1 === 0) {
      realTaxPercentage = realTaxPercentage / 100;
    }
    itemInfos = clientMeterNumberItem.invoiceData.details.map(item => {
      itemInfo = {
        lineNumber: parseInt(item.rank),
        itemCode: item.from.toString() + '-' + item.to.toString(),
        itemName: item.name,
        unitName: 'm3',
        unitPrice: item.price,
        quantity: item.waterUsed,
        itemTotalAmountWithoutTax: item.toFee,
        taxPercentage,
        taxAmount: item.toFee * realTaxPercentage,
        discount: 0,
        itemDiscount: 0,
      };
      return itemInfo;
    });

    const replacementEinvoiceNote = {
      selection: 2,
      itemName: `Hóa đơn thay thế cho hóa đơn điện tử số  ${originalInvoiceId} lập ngày ${moment(
        originalInvoiceIssueDate,
      ).format('DD/MM/YYYY')}`,
    };

    itemInfos.push(replacementEinvoiceNote);

    data = {
      generalInvoiceInfo: {
        invoiceType: '01GTKT',
        templateCode: einvoiceData.templateCode,
        invoiceSeries: einvoiceData.invoiceSeries,
        invoiceIssuedDate: eInvoiceDate,
        currencyCode: 'VND',
        transactionUuid: uuidV4(),
        //information for replacing invoice
        adjustmentType: '3',
        invoiceNote: invoiceNote,
        originalInvoiceId: originalInvoiceId,
        originalInvoiceIssueDate: originalInvoiceIssueDate,
        additionalReferenceDesc: additionalReferenceDesc,
        additionalReferenceDate: additionalReferenceDate,
        paymentStatus: true,
        paymentType: 'TM/CK',
        paymentTypeName: 'TM/CK',
        cusGetInvoiceRight: true,
      },
      buyerInfo: {
        buyerName: clientMeterNumberItem.invoiceData.client.name,
        buyerLegalName: clientMeterNumberItem.invoiceData.client.name,
        buyerAddressLine: clientMeterNumberItem.invoiceData.client.formattedAddress,
        buyerCode: clientMeterNumberItem.invoiceData.client.code,
      },
      sellerInfo: {
        sellerLegalName: sellerInfo.name,
        sellerTaxCode: sellerInfo.taxNum,
        sellerAddressLine: sellerInfo.address,
        sellerPhoneNumber: sellerInfo.phone,
        sellerBankName: sellerInfo.creditCards[0].bankName,
        sellerBankAccount: sellerInfo.creditCards[0].bankAccount,
      },
      extAttribute: [],
      payments: [
        {
          paymentMethodName: 'TM/CK',
        },
      ],
      deliveryInfo: {},
      itemInfo: itemInfos,
      discountItemInfo: [],
      metadata: [
        {
          keyTag: 'month',
          valueType: 'number',
          numberValue: moment(clientMeterNumberItem.invoiceData.fromDate).month() + 1,
          keyLabel: 'Tháng',
        },
        {
          keyTag: 'year',
          valueType: 'number',
          numberValue: moment(clientMeterNumberItem.invoiceData.fromDate).year(),
          keyLabel: 'Năm',
        },
        {
          keyTag: 'householdNo',
          valueType: 'number',
          numberValue: parseInt(clientMeterNumberItem.invoiceData.client.familyCount, 10),
          keyLabel: 'Số hộ sử dụng',
        },
        {
          keyTag: 'startDate',
          valueType: 'date',
          dateValue: moment(clientMeterNumberItem.invoiceData.fromDate).valueOf(),
          keyLabel: 'Thời gian sử dụng từ ngày',
        },
        {
          keyTag: 'endDate',
          valueType: 'date',
          dateValue: moment(clientMeterNumberItem.invoiceData.toDate).valueOf(),
          keyLabel: 'Thời gian sử dụng đến ngày',
          isSeller: false,
        },
      ],
      meterReading: [
        {
          previousIndex: clientMeterNumberItem.invoiceData.oldMeterNumber,
          currentIndex: clientMeterNumberItem.invoiceData.newMeterNumber,
          factor: '1',
          amount: clientMeterNumberItem.invoiceData.totalWaterUsed,
        },
      ],
      summarizeInfo: {
        sumOfTotalLineAmountWithoutTax: clientMeterNumberItem.invoiceData.waterFee,
        totalAmountWithoutTax: clientMeterNumberItem.invoiceData.waterFee,
        totalTaxAmount: clientMeterNumberItem.invoiceData.taxFee + clientMeterNumberItem.invoiceData.sewageFee,
        totalAmountWithTax: clientMeterNumberItem.invoiceData.totalFee,
        totalAmountWithTaxInWords: numberToWord(clientMeterNumberItem.invoiceData.totalFee),
        discountAmount: 0,
        settlementDiscountAmount: 0,
        taxPercentage: clientMeterNumberItem.invoiceData.taxPercent + clientMeterNumberItem.invoiceData.sewagePercent,
      },
      taxBreakdowns: [
        {
          taxPercentage: clientMeterNumberItem.invoiceData.taxPercent,
          taxableAmount: clientMeterNumberItem.invoiceData.waterFee,
          taxAmount: clientMeterNumberItem.invoiceData.taxFee,
        },
        {
          taxPercentage: clientMeterNumberItem.invoiceData.sewagePercent,
          taxableAmount: clientMeterNumberItem.invoiceData.waterFee,
          taxAmount: clientMeterNumberItem.invoiceData.sewageFee,
        },
      ],
    };
    return data;
  },

  cancelInvoice: ({ supplierTaxCode, templateCode }, invoiceNo, originalInvoiceIssuedDate, invoiceIssuedDate) => {
    let data = {};
    data.supplierTaxCode = supplierTaxCode;
    data.templateCode = templateCode;
    data.invoiceNo = invoiceNo;
    data.strIssueDate = moment(originalInvoiceIssuedDate).format('YYYYMMDDHHmmss');
    data.additionalReferenceDesc = 'abcd';
    data.changeNote = 'abcd';
    data.additionalReferenceDate = moment(invoiceIssuedDate).format('YYYYMMDDHHmmss');
    return data;
  },

  resultData: (result, clientMeterNumberItem, transactionUuid, invoiceIssuedDate, einvoiceCredential) => {
    let data = {};
    data.canceled = false;
    data.id = clientMeterNumberItem.id || clientMeterNumberItem._id;
    data.clientName = clientMeterNumberItem.invoiceData.client.name;
    data.termInvoice = moment(clientMeterNumberItem.toDate)
      .startOf('month')
      .toDate();
    data.eInvoiceNo = result.result.invoiceNo;
    data.tax = einvoiceCredential.supplierTaxCode;
    data.templateCode = einvoiceCredential.templateCode;
    data.eInvoiceDate = invoiceIssuedDate ? moment(invoiceIssuedDate).toDate() : currentDate.toDate();
    data.eInvoiceReservationCode = result.result.reservationCode;
    data.transactionUuid = transactionUuid;
    data.clientMeterNumberItem = clientMeterNumberItem;
    data.rawResult = result;
    return data;
  },
};

module.exports = format;
