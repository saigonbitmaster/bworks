'use strict';
const moment = require('moment-timezone');
const utilCommon = require('../../utils/common');
const format = require('../../utils/format');

module.exports = Client => {
  // Theo tiêu chuẩn, pH của nước sử dụng cho sinh hoạt là 6,0 – 8,5
  Client.PH = async (useForChart, filter, res) => {
    const dataCollect = [];
    const {
      where: { typeTime, hour, dayFrom, dayTo },
    } = filter;
    let valueTimeFrom, valueTimeTo;
    let start, distTime, keyTime;
    switch (typeTime) {
      case 'hour': {
        keyTime = 'hour';
        valueTimeFrom = moment(hour).startOf('day');
        valueTimeTo = valueTimeFrom;
        break;
      }
      case 'day': {
        keyTime = 'day';
        valueTimeFrom = dayFrom;
        valueTimeTo = dayTo;
        break;
      }
      default: {
        res.header('content-range', 0);
        return dataCollect;
      }
    }

    let index = 0;
    if (typeTime === 'hour') {
      distTime = 24;
    } else {
      distTime = moment(valueTimeTo)
        .startOf(keyTime)
        .diff(moment(valueTimeFrom).startOf(keyTime), keyTime);
      distTime = distTime + 1; // add 1 for current time
    }

    start = moment(valueTimeFrom).startOf(keyTime);
    for (let i = 1; i <= distTime; i++) {
      // end = moment(start).endOf(keyTime);

      // create data
      let tmp = {};
      tmp.id = index;
      index++;
      tmp.time = start;
      tmp.typeTime = typeTime;
      tmp.ph = Math.floor(Math.random() * 10 + 1);
      if (useForChart) {
        dataCollect.push(tmp);
      } else {
        if (tmp.ph > 8.5) {
          tmp.status = 'generic.qualityWaterChart.high';
          tmp.keyAlert = 'high';
          dataCollect.push(tmp);
        } else if (tmp.ph < 6) {
          tmp.status = 'generic.qualityWaterChart.low';
          tmp.keyAlert = 'low';
          dataCollect.push(tmp);
        }
      }

      // next time
      start = moment(valueTimeFrom)
        .startOf(keyTime)
        .add(i, keyTime);
    }
    return dataCollect;
  };
  // hàm lượng clo trong nước sạch phục vụ ăn uống là 0,3 – 0,5 mg/lít
  Client.CLO = async function(useForChart, filter, res) {
    let dataCollect = [];
    let { typeTime, hour, dayFrom, dayTo, monthFrom, monthTo, yearFrom, yearTo } = filter.where;
    let valueTimeFrom, valueTimeTo;
    let start, distTime, keyTime;
    switch (typeTime) {
      case 'hour': {
        keyTime = 'hour';
        valueTimeFrom = moment(hour).startOf('day');
        valueTimeTo = valueTimeFrom;
        break;
      }
      case 'day': {
        keyTime = 'day';
        valueTimeFrom = dayFrom;
        valueTimeTo = dayTo;
        break;
      }
      case 'month': {
        keyTime = 'month';
        valueTimeFrom = monthFrom; // YYYY-MM
        valueTimeTo = monthTo; // YYYY-MM
        break;
      }
      case 'year': {
        keyTime = 'year';
        valueTimeFrom = yearFrom; // YYYY
        valueTimeTo = yearTo; // YYYY
        break;
      }
      default: {
        res.header('content-range', 0);
        return dataCollect;
      }
    }

    let index = 0;
    if (typeTime === 'hour') {
      distTime = 24;
    } else {
      distTime = moment(valueTimeTo)
        .startOf(keyTime)
        .diff(moment(valueTimeFrom).startOf(keyTime), keyTime);
      distTime = distTime + 1; // add 1 for current time
    }

    start = moment(valueTimeFrom).startOf(keyTime);
    for (let i = 1; i <= distTime; i++) {
      // end = moment(start).endOf(keyTime);

      // create data
      let tmp = {};
      tmp.id = index;
      index++;
      tmp.time = start;
      tmp.typeTime = typeTime;
      let val = Math.random();
      tmp.clo = format.formatWithDec(val, 2);

      if (useForChart) {
        dataCollect.push(tmp);
      } else {
        if (tmp.clo > 0.5) {
          tmp.status = 'generic.qualityWaterChart.high';
          tmp.keyAlert = 'high';
          dataCollect.push(tmp);
        } else if (tmp.clo < 0.3) {
          tmp.status = 'generic.qualityWaterChart.low';
          tmp.keyAlert = 'low';
          dataCollect.push(tmp);
        }
      }

      // next time
      start = moment(valueTimeFrom)
        .startOf(keyTime)
        .add(i, keyTime);
    }
    return dataCollect;
  };
  // Tiêu chuẩn nước sạch quy định độ đục nhỏ hơn 5NTU
  Client.NTU = async function(useForChart, filter, res) {
    let dataCollect = [];
    let { typeTime, hour, dayFrom, dayTo, monthFrom, monthTo, yearFrom, yearTo } = filter.where;
    let valueTimeFrom, valueTimeTo;
    let start, distTime, keyTime;
    switch (typeTime) {
      case 'hour': {
        keyTime = 'hour';
        valueTimeFrom = moment(hour).startOf('day');
        valueTimeTo = valueTimeFrom;
        break;
      }
      case 'day': {
        keyTime = 'day';
        valueTimeFrom = dayFrom;
        valueTimeTo = dayTo;
        break;
      }
      case 'month': {
        keyTime = 'month';
        valueTimeFrom = monthFrom; // YYYY-MM
        valueTimeTo = monthTo; // YYYY-MM
        break;
      }
      case 'year': {
        keyTime = 'year';
        valueTimeFrom = yearFrom; // YYYY
        valueTimeTo = yearTo; // YYYY
        break;
      }
      default: {
        res.header('content-range', 0);
        return dataCollect;
      }
    }

    let index = 0;
    if (typeTime === 'hour') {
      distTime = 24;
    } else {
      distTime = moment(valueTimeTo)
        .startOf(keyTime)
        .diff(moment(valueTimeFrom).startOf(keyTime), keyTime);
      distTime = distTime + 1; // add 1 for current time
    }

    start = moment(valueTimeFrom).startOf(keyTime);
    for (let i = 1; i <= distTime; i++) {
      // end = moment(start).endOf(keyTime);

      // create data
      let tmp = {};
      tmp.id = index;
      index++;
      tmp.time = start;
      tmp.typeTime = typeTime;
      tmp.ntu = Math.floor(Math.random() * 10 + 1);

      if (useForChart) {
        dataCollect.push(tmp);
      } else {
        if (tmp.ntu > 5) {
          tmp.status = 'generic.qualityWaterChart.high';
          tmp.keyAlert = 'high';
          dataCollect.push(tmp);
        }
      }

      // next time
      start = moment(valueTimeFrom)
        .startOf(keyTime)
        .add(i, keyTime);
    }
    return dataCollect;
  };

  // eslint-disable-next-line no-unused-vars
  Client.getInfoQualityWater = async (filter, res, options) => {
    try {
      let {
        where: { typeTime, hour, dayFrom, dayTo },
      } = filter;
      let data = [];

      const emptyData = () => {
        res.header('content-range', 0);
        return {};
      };

      let keyTime = '';
      // Assign correct key time
      if (typeTime === 'hour' && hour) {
        keyTime = 'hour';
      } else if (typeTime === 'day') {
        dayFrom = dayFrom ? moment(dayFrom).toDate() : moment().toDate();
        dayTo = dayTo ? moment(dayTo).toDate() : moment().toDate();
        keyTime = 'day';
      }

      // Get the client user
      const token = options && options.accessToken;
      const userId = token && token.userId;
      if (!userId) return emptyData();
      const clientUser = await Client.app.models.ClientUser.findById(userId);
      if (!clientUser || !clientUser.clientId) return emptyData();

      // Get assigned DMA
      const client = await Client.findById(clientUser.clientId);
      const dmaId = client.dmaId;
      if (!dmaId) return emptyData();

      switch (keyTime) {
        case 'hour': {
          data = await Client.app.models.Dma.getDmaQualityWaterHourly(dmaId, moment(hour).toDate());
          break;
        }
        case 'day': {
          data = await Client.app.models.Dma.getDmaQualityWaterDaily(
            dmaId,
            moment(dayFrom).toDate(),
            moment(dayTo).toDate(),
          );
          break;
        }
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  // site: ctm-client => get thong tin chat luong nuoc
  Client.remoteMethod('getInfoQualityWater', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
