const { get } = require('lodash');
const moment = require('moment-timezone');
const createError = require('http-errors');

module.exports = function(Meternumbersubmit) {
  Meternumbersubmit.postSubmit = async (meterData, options) => {
    const { currentNumber, meterImage, submitDate } = meterData;
    const userId = get(options, 'accessToken.userId');
    const currentUser = await Meternumbersubmit.app.models.ClientUser.findById(userId);
    const clientId = currentUser.clientId;
    const { lastWritedMonth, termMonth } = await Meternumbersubmit.app.models.ClientMeterNumber.getLastWritedMonth(
      clientId,
    );
    const { currentNumber: previosCurrentNumber = 0, toDate } = lastWritedMonth || {};
    const resultValidate = await validatePostSubmit(clientId, meterData, lastWritedMonth);
    const submitId = `${clientId.toString()}-${moment(submitDate).format('YYYY-MM')}`;
    const record = await Meternumbersubmit.findById(submitId);
    if (record) {
      const { submitStatus } = record;
      switch (submitStatus) {
        case 'WAITING': {
          record.updateAttributes({ meterImage, currentNumber });
          break;
        }
        case 'DENIED': {
          record.updateAttributes({ meterImage, currentNumber, submitStatus: 'WAITING', declineMessage: null });
          break;
        }
        default: {
          throw createError(400, 'error.CANNOT_EDIT_SUBMIT');
        }
      }
    } else {
      const { changedClientMeter = null } = resultValidate || {};
      Meternumbersubmit.create({
        id: submitId,
        meterImage,
        currentNumber,
        changedClientMeter,
        clientId,
        termMonth,
        previousNumber: previosCurrentNumber,
        fromDate: toDate,
        toDate: moment(submitDate).toDate(),
      });
    }
  };

  const validatePostSubmit = async (clientId, submitData, previosData) => {
    const { currentNumber, submitDate, meterImage } = submitData;
    if (currentNumber && submitData && meterImage) {
      const { currentNumber: previosCurrentNumber, toDate } = previosData;
      if (moment(submitDate).isBefore(toDate)) {
        throw createError(400, 'error.INVALID_SUBMIT_DATE');
      }
      const {
        isChanged,
        changedClientMeter,
      } = await Meternumbersubmit.app.models.ClientMeterHistory.checkClientMeterHaveChange(
        clientId,
        toDate,
        submitDate,
      );
      if (!isChanged) {
        if (currentNumber < previosCurrentNumber) {
          throw createError(400, 'error.INVALID_METER_NUMBER');
        }
      } else {
        return { changedClientMeter };
      }
    } else {
      throw createError(400, 'error.INVALID_SUBMIT_DATA');
    }
    return {};
  };

  Meternumbersubmit.remoteMethod('postSubmit', {
    accepts: [
      { arg: 'meterData', type: 'object' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'post' },
  });
};
