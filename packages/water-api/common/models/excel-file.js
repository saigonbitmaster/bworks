'use strict';
const moment = require('moment');
const xlsx = require('xlsx');
// eslint-disable-next-line no-unused-vars
module.exports = function(ExcelFile) {
  const dateFormat = 'dd/MM/yyyy';

  const clientStandardTemplate = () => {
    const headers = {
      'Số thứ tự': 1,
      'Mã KH*': 'WOS_001',
      'Tên KH*': 'Nguyễn Văn A',
      'Số nhà/Đường': '123 Nguyễn Trãi',
      'Tọa độ': 'lat,long',
      Kiểu: 'Dân cư',
      'Số hộ*': '1',
      'Số người*': '1',
      'Mã hợp đồng': 'HDWOS_001',
      'Ngày ký hợp đồng': new Date(),
      'CS cuối': '1',
      'TG ghi cuối': '1',
      'Kỳ hoá đơn': '1',
      'Kỳ ghi nước': '1',
      'Tỉnh/Thành phố*': '1',
      'Quận/Huyện*': '1',
      'Xã/Phường/Thị trấn*': '1',
      'Thôn/Ấp/Khu phố': '1',
      'Nhà cung cấp': '1',
      'Công thức tính cước': '1',
      'Loại giấy tờ khách hàng': '1',
      'Mô tả': '1',
      'Tình trạng hợp đồng': '1',
      'Ngày Lắp ĐH': '1',
      'Số fax người mua': '1',
      'Email người mua': '1',
      'Tên ngân hàng': '1',
      'Tài khoản ngân hàng': '1',
      'Mã số thuế': '1',
      'Số seri Đồng hồ': '1',
      DMA: '1',
    };
  };

  ExcelFile.getTemplate = (reportName, callback) => {
    const CtmReportFile = ExcelFile.app.models.CtmReportFile;
    // Attempt to download requested report
    CtmReportFile.downloadStream(null, reportName)
      .then(stream => {
        const contentType = 'application/pdf';
        const contentDisposition = `inline; filename=${reportName}`;
        return callback(null, stream, contentType, contentDisposition);
      })
      .catch(err => {
        // Either the request report hasn't been made yet
        // Or there are errors appeared in the downloading process
        return callback(err.message);
      });
  };

  ExcelFile.remoteMethod('getTemplate', {
    accepts: { arg: 'name', type: 'string' },
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
