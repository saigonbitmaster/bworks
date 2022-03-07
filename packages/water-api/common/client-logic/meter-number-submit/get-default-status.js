const { get } = require('lodash');
const moment = require('moment-timezone');

const status = {
  EDIT: 'EDIT',
  NEW: 'NEW',
  LOCK: 'LOCK',
  DISABLED: 'DISABLED',
  DENIED: 'DENIED',
};

module.exports = function(Meternumbersubmit) {
  Meternumbersubmit.getDefaultStatus = async (clientId, options) => {
    if (!clientId) {
      const userId = get(options, 'accessToken.userId');
      const currentUser = await Meternumbersubmit.app.models.ClientUser.findById(userId);
      clientId = currentUser.clientId;
    }
    let previosMeterNumber = await Meternumbersubmit.app.models.ClientMeterNumber.getLastWritedMonth(clientId);
    const meterNumberId = `${clientId.toString()}-${moment().format('YYYY-MM')}`;
    // nếu tháng này đã ghi, lastWritedMonth sẽ trả về tháng đã ghi trước 1 tháng
    if (moment(previosMeterNumber.termMonth).isSame(moment(), 'months')) {
      const previousMonth = moment().subtract(1, 'months');
      const previosMonthMeterNumber = await Meternumbersubmit.app.models.ClientMeterNumber.findById(
        `${clientId.toString()}-${moment(previousMonth).format('YYYY-MM')}`,
      );
      previosMeterNumber = { lastWritedMonth: previosMonthMeterNumber, termMonth: previousMonth };
    }
    const currentClientMeterNumber = await Meternumbersubmit.app.models.ClientMeterNumber.findById(meterNumberId);
    const currentMeterNumberSubmit = await Meternumbersubmit.findById(meterNumberId);
    // nếu tháng đó đã ghi nước : lock submit ghi nước
    if (currentClientMeterNumber) {
      return {
        previosMeterNumber,
        currentMeterNumber: currentMeterNumberSubmit,
        status: status.LOCK,
      };
    }
    // nếu tháng khách hàng đã tự ghi nước nhưng chưa lưu vào client meter number: cho chỉnh sửa submit
    if (currentMeterNumberSubmit) {
      const { submitStatus } = currentMeterNumberSubmit;
      if (submitStatus === 'DENIED') {
        return { previosMeterNumber, currentMeterNumber: currentMeterNumberSubmit, status: status.DENIED };
      }
      return { previosMeterNumber, currentMeterNumber: currentMeterNumberSubmit, status: status.EDIT };
    } else {
      // khách hàng chưa ghi nước
      if (previosMeterNumber.termMonth) {
        // nếu lấy được tháng ghi nước cuối cùng trước
        // kiểm tra xem tháng ghi nước cuối cùng có kề tháng hiện tại không
        if (moment().diff(moment(previosMeterNumber.termMonth), 'months') > 1) {
          return { previosMeterNumber, status: status.DISABLED };
        } else {
          return { previosMeterNumber, status: status.NEW };
        }
      } else {
        // ghi tháng đầu tiên
        return { previosMeterNumber, status: status.NEW };
      }
    }
  };

  Meternumbersubmit.remoteMethod('getDefaultStatus', {
    accepts: [
      { arg: 'clientId', type: 'string' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'boolean', root: true },
  });
};
