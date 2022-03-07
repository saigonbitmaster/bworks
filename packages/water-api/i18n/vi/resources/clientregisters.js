const commonFields = require('../commomFields');
const clients = require('./clients');
module.exports = {
  name: 'Đăng kí |||| Đăng kí',
  fields: {
    ...clients.fields,
    ...commonFields,
  },
  values: {
    paymentTypeChoices: {
      CASH: 'Tiền mặt',
      TRANSFER: 'Chuyển khoản',
      ALL: 'Tiền mặt/Chuyển khoản',
    },
    type: {
      RESIDENT: 'SH',
      ORGANIZATION: 'HCSN',
      INDUSTRY: 'SX',
      SERVICE: 'KDDV',
    },
    contractStatus: {
      ACTIVE: 'Đang sử dụng',
      STOP: 'Ngừng sử dụng',
    },
    buyerIdType: {
      1: 'Số CMND',
      2: 'Hộ chiếu',
      3: 'Giấy phép kinh doanh',
    }
  },
};
