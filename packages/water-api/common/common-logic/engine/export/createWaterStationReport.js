'use strict';
const XlsxPopulate = require('xlsx-populate');
const last = require('lodash/last');
const initial = require('lodash/initial');
const moment = require('moment-timezone');

const createWaterStationReport = (input, options) => {
  const totalSum = last(input);
  const data = initial(input);
  const month = options && options.date ? moment(options.date).format('MM/YYYY') : moment().format('MM/YYYY');
  const summaryOrder = [
    'previousMeterNumber',
    'currentMeterNumber',
    'ratioMeterNumber',
    'totalLastMonthClient',
    'totalClient',
    'ratioClient',
    'totalLastMonthWaterUsedClient',
    'totalWaterUsedClient',
    'ratioWaterUsedClient',
  ];

  const dataCellStyle = {
    borderStyle: {
      right: 'thin',
      left: 'thin',
      bottom: 'thin',
    },
  };

  const summaryCellStyle = {
    fill: 'FFFF00',
    ...dataCellStyle,
  };

  const headerCellStyle = {
    bold: true,
    borderStyle: {
      top: 'thin',
      ...dataCellStyle.borderStyle,
    },
  };

  return XlsxPopulate.fromBlankAsync().then(workbook => {
    const reportWorksheet = workbook.sheet('Sheet1');

    // Add titles
    reportWorksheet
      .range('A1:F1')
      .merged(true)
      .value('TRUNG TÂM NƯỚC SẠCH & VSMT NT BẮC NINH')
      .style({
        bold: true,
        horizontalAlignment: 'center',
      });
    reportWorksheet
      .range('A4:L4')
      .merged(true)
      .value('BẢNG TỔNG HỢP KẾT QUẢ THỰC HIỆN CỦA CÁC TRẠM CẤP NƯỚC')
      .style({
        bold: true,
        horizontalAlignment: 'center',
      });
    reportWorksheet
      .range('F5:G5')
      .merged(true)
      .value(`Tháng ${month}`)
      .style({
        horizontalAlignment: 'center',
      });

    // Add headers
    const headers = ['STT', 'Trạm', 'Mã xã', 'Tên xã'];
    reportWorksheet
      .cell('A7')
      .value([headers])
      .style(headerCellStyle);
    reportWorksheet
      .range('E7:G7')
      .merged(true)
      .value('Tiêu thụ')
      .style(headerCellStyle);
    reportWorksheet
      .range('H7:J7')
      .merged(true)
      .value('Số đấu nối thực tế')
      .style(headerCellStyle);
    reportWorksheet
      .range('K7:M7')
      .merged(true)
      .value('Tổng số đấu nối có hoá đơn')
      .style(headerCellStyle);

    // Add subheaders
    const secondHeaders = ['Kỳ đầu', 'Kỳ sau', '%'];
    const range = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7 = 6 / 5 * 100',
      '8',
      '9',
      '10 = 9 / 8 * 100',
      '11',
      '12',
      '13 = 12 / 11 * 100',
    ];
    reportWorksheet
      .cell('E8')
      .value([secondHeaders])
      .style(headerCellStyle);
    reportWorksheet
      .cell('H8')
      .value([secondHeaders])
      .style(headerCellStyle);
    reportWorksheet
      .cell('K8')
      .value([secondHeaders])
      .style(headerCellStyle);
    reportWorksheet
      .cell('A9')
      .value([range])
      .style(headerCellStyle);

    // Add data
    if (data && data.length > 0) {
      reportWorksheet
        .cell('A10')
        // .range(`A10:M${10 + data.length}`)
        .value([...data])
        .style(dataCellStyle);
    }

    // Add summary
    const summaryRowIndex = 10 + (data && data.length ? data.length : 0);
    reportWorksheet
      .range(`A${summaryRowIndex}:D${summaryRowIndex}`)
      .merged(true)
      .value('Tổng cộng')
      .style(summaryCellStyle);
    reportWorksheet
      .cell(`E${summaryRowIndex}`)
      .value([summaryOrder.map(key => totalSum[key])])
      .style(summaryCellStyle);

    return workbook.outputAsync();
  });
};

module.exports = createWaterStationReport;
