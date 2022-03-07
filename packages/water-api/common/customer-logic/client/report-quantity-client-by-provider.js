'use strict';
const moment = require('moment');
const utilCommon = require('../../utils/common');
const aggregate = require('../../utils/aggregate');

module.exports = function(Client) {
  Client.reportQuantityClientByProvider = async function(filter, res) {
    // console.log('reportQuantityClientByProvider: ', filter);
    try {
      let { time, flgTotal, flgGetFull } = filter.where;

      let total = {
        totalClient: 0,
      };

      let cdt = {};
      let dataCollect = [];

      if (!time) {
        res.header('content-range', 0);
        return flgTotal === true ? total : dataCollect;
      }

      let providers = await Client.app.models.WaterProvider.find(cdt);
      if (!providers || !providers.length) {
        res.header('content-range', 0);
        return flgTotal === true ? total : dataCollect;
      }

      let endMonth = moment(time)
        .endOf('month')
        .toDate();

      let query = [
        {
          $match: {
            startMeterDate: { $lte: endMonth },
          },
        },
        {
          $project: {
            status: 1,
            providerId: 1,
          },
        },
        { $sortByCount: '$status' },
      ];

      let lenProvider = providers.length;
      for (let i = 0; i < lenProvider; i++) {
        let itemProvider = providers[i];
        let record = {
          id: i,
          activeClient: 0,
          pauseClient: 0,
          stopClient: 0,
          provider: itemProvider.name,
        };
        query[0].$match.providerId = itemProvider.id;
        let data = await aggregate(Client, query);
        data.find(function(item) {
          switch (item._id) {
            case 'ACTIVE':
              record.activeClient = item.count;
              break;
            case 'STOP':
              record.stopClient = item.count;
              break;
            case 'PAUSE':
              record.pauseClient = item.count;
              break;
            default:
              break;
          }
        });

        record.totalClient = record.activeClient + record.stopClient + record.pauseClient;
        dataCollect.push(record);

        total.totalClient += record.totalClient;
      }
      if (flgGetFull === true) {
        if (res) {
          res.header('content-range', dataCollect.length);
        }
        return dataCollect;
      } else if (flgTotal === true) {
        if (res) {
          res.header('content-range', 0);
        }
        return total;
      } else {
        return utilCommon.filterData(filter, dataCollect, res);
      }
    } catch (error) {
      throw error;
    }
  };
  // thong ke so luong khach hang theo nha cung cap
  Client.remoteMethod('reportQuantityClientByProvider', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};

/*
//code cu
'use strict';
const moment = require('moment');
const utilCommon = require('../../utils/common');
module.exports = function(Client) {
    Client.reportQuantityClientByProvider = async function(filter, res) {
        // console.log('reportQuantityClientByProvider: ', filter);
        try {
            let { time } = filter.where;

            let cdt = {};
            let dataCollect = [];

            if (!time) {
                res.header('content-range', 0);
                return dataCollect;
            }

            let providers = await Client.app.models.WaterProvider.find(cdt);
            if (!providers || !providers.length) {
                res.header('content-range', 0);
                return dataCollect;
            }

            let endMonth = moment(time)
                .endOf('month')
                .toDate();

            let lenProvider = providers.length;
            for (let i = 0; i < lenProvider; i++) {
                let itemProvider = providers[i];
                cdt = {};
                cdt.where = { and: [{ providerId: itemProvider.id }, { status: { inq: ['ACTIVE', 'STOP', 'PAUSE'] } }] };
                let clients = await Client.find(cdt);
                if (!clients || !clients.length) {
                    continue;
                }

                let activeClient = 0;
                let pauseClient = 0;
                let stopClient = 0;

                let lenClient = clients.length;
                for (let k = 0; k < lenClient; k++) {
                    let itemClient = clients[k];

                    // kiem tra client da co meter va truoc time?
                    cdt = {};
                    cdt.where = { and: [{ clientId: itemClient.id }, { startMeterDate: { lte: endMonth } }] };
                    let meter = await Client.app.models.ClientMeter.findOne(cdt);
                    if (!meter) {
                        continue;
                    }

                    if (itemClient.status === 'ACTIVE') {
                        ++activeClient;
                    } else if (itemClient.status === 'PAUSE') {
                        ++pauseClient;
                    } else if (itemClient.status === 'STOP') {
                        ++stopClient;
                    }
                }

                let record = {};
                record.id = i;
                record.provider = itemProvider.name;
                record.activeClient = activeClient;
                record.pauseClient = pauseClient;
                record.stopClient = stopClient;
                record.totalClient = activeClient + pauseClient + stopClient;
                dataCollect.push(record);
            }
            return utilCommon.filterData(filter, dataCollect, res);
        } catch (error) {
            throw error;
        }
    };
    // thong ke so luong khach hang theo nha cung cap
    Client.remoteMethod('reportQuantityClientByProvider', {
        accepts: [{ arg: 'filter', type: 'object' }, { arg: 'res', type: 'object', http: { source: 'res' } }],
        http: { verb: 'get' },
        returns: { arg: 'data', type: 'object', root: true },
    });
};
*/
