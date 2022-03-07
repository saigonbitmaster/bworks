const isFunction = require('lodash/isFunction');
const has = require('lodash/has');
const aggregate = require('../../utils/aggregate');

module.exports = EInvoiceData => {
  EInvoiceData.getLatestEinvoice = async (_month, session) => {
    const aggregationQuery = [{ $match: { canceled: { $eq: false } } }, { $sort: { eInvoiceDate: -1 } }, { $limit: 1 }];

    let aggregatedResult;
    if (!isFunction(session)) {
      aggregatedResult = await aggregate(EInvoiceData, aggregationQuery, session);
    } else {
      aggregatedResult = await aggregate(EInvoiceData, aggregationQuery);
    }

    if (has(aggregatedResult, '[0].eInvoiceDate')) {
      return aggregatedResult[0].eInvoiceDate;
    } else {
      return null;
    }
  };

  EInvoiceData.remoteMethod('getLatestEinvoice', {
    accepts: { arg: 'month', type: 'date', required: true },
    http: { verb: 'get' },
    returns: { arg: 'latestEinvoice', type: 'date', root: true },
  });
};
