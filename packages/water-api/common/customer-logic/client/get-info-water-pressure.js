'use strict';
const moment = require('moment');

module.exports = function(Client) {
  // su dung cho api: getInfoWaterPressure ,  getAlertWaterPressure
  Client.formatFilter = async function(filter, options) {
    let { typeTime, hour, dayFrom, dayTo, monthFrom, monthTo, yearFrom, yearTo } = filter.where;
    let valueTimeFrom;
    let valueTimeTo;
    let level = 2;
    let dmaId;
    let typeStatistic = 'pressure';
    let modelConfig = 'CtmConfig';
    const token = options && options.accessToken;
    const userId = token && token.userId;
    if (!userId) {
      return false;
    }
    let clientUser = await Client.app.models.ClientUser.findById(userId);
    if (!clientUser || !clientUser.clientId) {
      return false;
    }

    let client = await Client.findById(clientUser.clientId);
    if (!client || !client.dmaId) {
      return false;
    }

    dmaId = client.dmaId;

    // format filter
    switch (typeTime) {
      case 'hour': {
        valueTimeFrom = moment(hour).startOf('day');
        valueTimeTo = valueTimeFrom;
        break;
      }
      case 'day': {
        valueTimeFrom = dayFrom;
        valueTimeTo = dayTo;
        break;
      }
      case 'month': {
        valueTimeFrom = monthFrom; // YYYY-MM
        valueTimeTo = monthTo; // YYYY-MM
        break;
      }
      case 'year': {
        valueTimeFrom = yearFrom; // YYYY
        valueTimeTo = yearTo; // YYYY
        break;
      }
    }

    delete filter.where;
    filter.where = {
      typeTime,
      valueTimeFrom,
      valueTimeTo,
      level,
      dmaId,
      typeStatistic,
      modelConfig,
    };
    return true;
  };

  Client.getInfoWaterPressure = async (filter, res, options) => {
    const {
      where: { typeTime, day, from, to },
    } = filter;
    const emptyData = () => {
      res.header('content-range', 0);
      return {};
    };

    try {
      let data = {};
      let ret = await Client.formatFilter(filter, options);
      if (!ret) return emptyData();

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

      // Get the water pressure data
      if (typeTime === 'day') {
        data = await Client.app.models.Dma.statisticRuntimeLoggerDay(dmaId, moment(from).toDate(), moment(to).toDate());
      } else if (typeTime === 'hour') {
        data = await Client.app.models.Dma.statisticRuntimeLoggerHour(dmaId, moment(day).toDate());
      } else {
        return emptyData();
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  // site: ctm-client => get thong tin ap luc, dung cho CHART
  Client.remoteMethod('getInfoWaterPressure', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
