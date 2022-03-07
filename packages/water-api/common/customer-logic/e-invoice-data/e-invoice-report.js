const moment = require('moment');
const utilCommon = require('water-api/common/utils/common');
const aggregate = require('../../utils/aggregate');

module.exports = function(EInvoiceData) {
  EInvoiceData.eInvoiceReport = async (filter, res) => {
    let { mode, valueTimeFrom, valueTimeTo } = filter.where;
    let dataCollect = [];

    if (moment(valueTimeFrom, 'DD/MM/YYYY').isAfter(moment())) {
      valueTimeFrom = moment().format('DD/MM/YYYY');
    }
    if (moment(valueTimeTo, 'DD/MM/YYYY').isAfter(moment())) {
      valueTimeTo = moment().format('DD/MM/YYYY');
    }

    if (!mode) {
      res.header('content-range', 0);
      return [];
    }

    if (mode == 'series') {
      let querySeries = [
        {
          $project: {
            templateCode: 1,
            canceled: 1,
            scrappedEinvoice: {
              $cond: { if: { $isArray: '$scrappedEinvoice' }, then: { $size: '$scrappedEinvoice' }, else: 'NA' },
            },
          },
        },
        {
          $group: {
            _id: '$templateCode',
            validInvoices: {
              $sum: {
                $cond: [{ $eq: ['$canceled', false] }, 1, 0],
              },
            },

            canceledInvoices: {
              $sum: {
                $cond: [{ $eq: ['$canceled', true] }, 1, 0],
              },
            },
            canceledInvoices1: {
              $sum: '$scrappedEinvoice',
            },
          },
        },
        {
          $project: {
            templateCode: '$_id',
            validInvoices: 1,
            canceledInvoices: { $add: ['$canceledInvoices', '$canceledInvoices1'] },
            totalInvoices: { $add: ['$canceledInvoices', '$canceledInvoices1', '$validInvoices'] },
          },
        },
        {
          $addFields: {
            id: '$_id',
            replacedInvoices: 0,
            adjustedInvoices: 0,
          },
        },
      ];
      dataCollect = await aggregate(EInvoiceData, querySeries);
    }
    if (mode == 'time') {
      let monthFrom = moment(valueTimeFrom, 'DD/MM/YYYY')
        .startOf('month')
        .toDate();
      let monthTo = moment(valueTimeTo, 'DD/MM/YYYY')
        .endOf('month')
        .toDate();

      let queryTime = [
        { $match: { $and: [{ eInvoiceDate: { $gte: monthFrom } }, { eInvoiceDate: { $lte: monthTo } }] } },

        {
          $project: {
            templateCode: 1,
            canceled: 1,
            eInvoiceDate: 1,
            month: { $add: [{ $year: '$eInvoiceDate' }, { $month: '$eInvoiceDate' }] },
            scrappedEinvoice: {
              $cond: { if: { $isArray: '$scrappedEinvoice' }, then: { $size: '$scrappedEinvoice' }, else: 'NA' },
            },
          },
        },
        {
          $group: {
            _id: '$month',
            eInvoiceDate: { $first: '$eInvoiceDate' },
            validInvoices: {
              $sum: {
                $cond: [{ $eq: ['$canceled', false] }, 1, 0],
              },
            },

            canceledInvoices: {
              $sum: {
                $cond: [{ $eq: ['$canceled', true] }, 1, 0],
              },
            },
            scrappedEinvoices: {
              $sum: '$scrappedEinvoice',
            },
          },
        },
        {
          $project: {
            id: "$_id",
            eInvoiceDate: 1,
            validInvoices: 1,
            canceledInvoices: { $add: ['$canceledInvoices', '$scrappedEinvoices'] },
            totalInvoices: { $add: ['$canceledInvoices', '$scrappedEinvoices', '$validInvoices'] },
          },
        },
        {
          $addFields: {
            adjustedInvoices: 0,
            replacedInvoices: 0,
          },
        },
      ];
      dataCollect = await aggregate(EInvoiceData, queryTime);
     
    }

    return utilCommon.filterData(filter, dataCollect, res);
  };

  EInvoiceData.eInvoiceReportSummary = async filter => {
    let { mode, valueTimeFrom, valueTimeTo } = filter;
    let data = {};
    let aggregateQuery = [];
    if (moment(valueTimeFrom, 'DD/MM/YYYY').isAfter(moment())) {
      valueTimeFrom = moment().format('DD/MM/YYYY');
    }
    if (moment(valueTimeTo, 'DD/MM/YYYY').isAfter(moment())) {
      valueTimeTo = moment().format('DD/MM/YYYY');
    }

    if (!mode) {
      return {};
    }

    if (mode == 'series') {
      aggregateQuery = [
        {
          $project: {
            templateCode: 1,
            canceled: 1,
            scrappedEinvoice: {
              $cond: { if: { $isArray: '$scrappedEinvoice' }, then: { $size: '$scrappedEinvoice' }, else: 'NA' },
            },
          },
        },
        {
          $group: {
            _id: '$templateCode',
            validInvoices: {
              $sum: {
                $cond: [{ $eq: ['$canceled', false] }, 1, 0],
              },
            },

            canceledInvoices: {
              $sum: {
                $cond: [{ $eq: ['$canceled', true] }, 1, 0],
              },
            },
            canceledInvoices1: {
              $sum: '$scrappedEinvoice',
            },
          },
        },
        {
          $project: {
            templateCode: '$_id',
            validInvoices: 1,
            totalInvoices: { $add: ['$canceledInvoices', '$canceledInvoices1', '$validInvoices'] },
          },
        },
        {
          $group: {
            _id: null,

            templateCode: { $push: { $concat: ['$templateCode'] } },
            totalInvoices: {
              $sum: '$totalInvoices',
            },
            totalValidInvoices: {
              $sum: '$validInvoices',
            },
          },
        },
        {
          $project: {
            _id: 0,
            templateCode: {
              $reduce: {
                input: '$templateCode',
                initialValue: '',
                in: { $concat: ['$$this', ' ', '$$value'] },
              },
            },
            totalValidInvoices: 1,
            totalInvoices: 1,
          },
        },
      ];
      let result = await aggregate(EInvoiceData, aggregateQuery);
      data = result[0];
      // console.log(data)
    }

    if (mode == 'time') {
      let monthFrom = moment(valueTimeFrom, 'DD/MM/YYYY')
        .startOf('month')
        .toDate();
      let monthTo = moment(valueTimeTo, 'DD/MM/YYYY')
        .endOf('month')
        .toDate();

      let queryTime = [
        { $match: { $and: [{ eInvoiceDate: { $gte: monthFrom } }, { eInvoiceDate: { $lte: monthTo } }] } },

        {
          $project: {
            templateCode: 1,
            canceled: 1,
            eInvoiceDate: 1,
            month: { $add: [{ $year: '$eInvoiceDate' }, { $month: '$eInvoiceDate' }] },
            scrappedEinvoice: {
              $cond: { if: { $isArray: '$scrappedEinvoice' }, then: { $size: '$scrappedEinvoice' }, else: 'NA' },
            },
          },
        },
        {
          $group: {
            _id: '$month',
            eInvoiceDate: { $first: '$eInvoiceDate' },
            validInvoices: {
              $sum: {
                $cond: [{ $eq: ['$canceled', false] }, 1, 0],
              },
            },

            canceledInvoices: {
              $sum: {
                $cond: [{ $eq: ['$canceled', true] }, 1, 0],
              },
            },
            scrappedEinvoices: {
              $sum: '$scrappedEinvoice',
            },
          },
        },
        {
          $project: {
            id: "$_id",
            eInvoiceDate: 1,
            validInvoices: 1,
            canceledInvoices: { $add: ['$canceledInvoices', '$scrappedEinvoices'] },
            totalInvoices: { $add: ['$canceledInvoices', '$scrappedEinvoices', '$validInvoices'] },
          },
        },
        {
          $addFields: {
            adjustedInvoices: 0,
            replacedInvoices: 0,
          },
        },
        {
          $group: {
            _id: null,
             canceledInvoices: {
            $sum: '$canceledInvoices',
          }, totalInvoices: {
            $sum: '$totalInvoices',
          }, adjustedInvoices: {
            $sum: '$adjustedInvoices',
          },
            replacedInvoices: {
            $sum: '$replacedInvoices',
          },
          totalValidInvoices: {
            $sum: '$validInvoices',
          },
          }
      }
      ];
      let result = await aggregate(EInvoiceData, queryTime);
      data = result[0];
     
    }


    return data;
  };
  EInvoiceData.remoteMethod('eInvoiceReport', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });

  EInvoiceData.remoteMethod('eInvoiceReportSummary', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });

  EInvoiceData.printEInvoice = async function(invoiceNo) {
    // console.log(invoiceNo);
    let invoiceQuery = {
      supplierTaxCode: '0100109106-997',
      invoiceNo: invoiceNo,
      pattern: '01GTKT0/007',
      fileType: 'PDF',
    };
    let dataCollect = null;
    let tempData = await EInvoiceData.app.models.EInvoice.sendRequest({
      method: 'createEInvoice',
      params: { data: invoiceQuery, requestType: 'getInvoicePdfFile' },
    });
    if (tempData.errorCode == 'SUCCESS' || tempData.errorCode == null) {
      dataCollect = tempData.fileToBytes;
    }
    //  console.log(tempData);
    return dataCollect;
    /*
=======
=======
>>>>>>> ab1781055c19f51ba30fed2262e1fdd93b3df612
  EInvoiceData.printEInvoice = async function(invoiceNo) {
    let invoiceQuery = {
      supplierTaxCode: '0100109106-997',
      invoiceNo: invoiceNo,
      pattern: '01GTKT0/007',
      fileType: 'PDF',
    };
    let dataCollect = null;
    let tempData = await EInvoiceData.app.models.EInvoice.sendRequest({
      method: 'createEInvoice',
      params: { data: invoiceQuery, requestType: 'getInvoicePdfFile' },
    });
    if (tempData.errorCode == 'SUCCESS' || tempData.errorCode == null) {
      dataCollect = tempData.fileToBytes;
    }
    return dataCollect;
 */
  };

  EInvoiceData.remoteMethod('printEInvoice', {
    accepts: [{ arg: 'invoiceNo', type: 'string' }],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};

/*
//print invoice
 {
 "supplierTaxCode":"0100109106-997",
 "invoiceNo":"FS/18E0000616",
 "pattern":"01GTKT0/007",
 "fileType":"PDF"
 }


filter = {
mode: 'series' || 'time',
data: {
 fromDate: '',
 toDate: ''
}
}
//by series
 https://demo-sinvoice.viettel.vn:8443/InvoiceAPI/InvoiceUtilsWS/getProvidesStatusUsingInvoice
 POST
 {
 "supplierTaxCode":"0100109106-997",
 "pattern":"01GTKT0/003",
 "serial":"AA/18E"
 }
//return
 numOfpublishInv	Tổng số hóa đơn đã phát hành
 totalInv	Tổng số hóa đơn có thể lập với mẫu hóa đơn + dải truyển vào

//by date
 https://demo-sinvoice.viettel.vn:8443/InvoiceAPI/InvoiceUtilsWS/getListInvoiceDataControl
 POST
 {
 "supplierTaxCode":"0100109106-997",
 "fromDate":"10/12/2018",
 "toDate":"16/12/2018"
 }


 */
