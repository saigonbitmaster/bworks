//'use strict';
/*
const get = require('lodash/get');

module.exports = function(app) {
    app.models.EInvoice.sendRequest({method: 'createEInvoice', params: {data}}).then(res => {
        console.log(res);
    });
};

const data = {
    generalInvoiceInfo: {
        'invoiceType': '01GTKT',
        'templateCode': '01GTKT0/007',
        'invoiceIssuedDate': 1544591257719,
        'currencyCode': 'VND',
        'adjustmentType': '1',
        'paymentStatus': false,
        'paymentType': 'TM',
        'paymentTypeName': 'TM',
        'cusGetInvoiceRight': true,
        'userName': 'BworksAdmin',
    },
    'buyerInfo': {
        'buyerName': 'a',
        'buyerLegalName': 'a',
        'buyerAddressLine': 'hcm',
    },
    'sellerInfo': {
        'sellerLegalName': 'Bworks',
        'sellerTaxCode': '111',
        'sellerAddressLine': 'company.address',
        'sellerPhoneNumber': 'company.phone',
        'sellerBankName': 'company.bankName',
        'sellerBankAccount': 'company.bankAcount',
    },
    'extAttribute': [],
    'payments': [
        {
            'paymentMethodName': 'TM',
        },
    ],
    'deliveryInfo': {},
    'itemInfo': [
        {
            'lineNumber': 1,
            'itemCode': 'from-to',
            'itemName': "Mức sử dụng từ '${from}' đến '${to}'",
            'unitName': 'm3',
            'unitPrice': 100,
            'quantity': 100,
            'itemTotalAmountWithoutTax': 10000,
            'taxPercentage': 15,
            'taxAmount': 1500,
            'discount': 0,
            'itemDiscount': 0,
        },
    ],

    'discountItemInfo': [],
    'metadata': [],
    'meterReading': [
        {
            'previousIndex': 0,
            'currentIndex': 100,
            'factor': '1',
            'amount': 100,
        },
    ],
    'summarizeInfo': {
        'sumOfTotalLineAmountWithoutTax': 10000,
        'totalAmountWithoutTax': 10000,
        'totalTaxAmount': 1500,
        'totalAmountWithTax': 11500,
        'totalAmountWithTaxInWords': 'mười một ngàn năm trăm đồng',
        'discountAmount': 0,
        'settlementDiscountAmount': 0,
        'taxPercentage': 15,
    },
    'taxBreakdowns': [
        {
            'taxPercentage': 10,
            'taxableAmount': 10000,
            'taxAmount': 1000,
        },
        {
            'taxPercentage': 5,
            'taxableAmount': 10000,
            'taxAmount': 500,
        },
    ],
};
*/
