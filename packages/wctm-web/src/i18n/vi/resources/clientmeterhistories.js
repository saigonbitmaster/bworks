import CommonFields from '../commomFields';
export default {
  fields: {
    clientId: 'Khách hàng',
    newMeterNumber: 'Số mới',
    oldMeterNumber: 'Số cũ',
    setupDate: 'Ngày lắp đặt',
    type: 'Loại',
    ...CommonFields,
  },
  types: {
    NEW_INSTALL: 'Lắp mới',
    REPLACE: 'Thay thế',
  },
};
