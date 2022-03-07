'use strict';
const moment = require('moment-timezone');
const get = require('lodash/get');
// const utilCommon = require('water-api/common/utils/common');
const aggregate = require('../../utils/aggregate');
const getRawWhere = require('../../utils/get-raw-where');
const { utc } = require('../../../server/config.json');

module.exports = Client => {
  const buildQuery = filter => {
    const { where = {}, order = 'code ASC', limit = 25, skip = 0 } = filter || {};
    const { invoiceLock, canLockInvoice, termMeterNumber, ...restWhere } = where; // invoiceLock CAN,CANT,PAID
    restWhere.status = 'ACTIVE';
    const month = moment(termMeterNumber).format('YYYY-MM');
    const rawWhere = getRawWhere(Client, restWhere);
    const orderSplit = order[0].split(' ');
    const sort = {};
    sort[orderSplit[0]] = orderSplit[1] === 'ASC' ? 1 : -1;
    let result = [
      { $match: rawWhere },
      { $sort: sort },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          let: { id: { $concat: [{ $toString: '$_id' }, `-${month}`] } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$id'],
                },
              },
            },
          ],
          as: 'term',
        },
      },
      { $unwind: { path: '$term', preserveNullAndEmptyArrays: true } },
    ];

    if (canLockInvoice === 'can') {
      result.push({ $match: { 'term.paymentStatus': false } });
    } else if (canLockInvoice === 'cannot') {
      result.push({ $match: { $or: [{ 'term.paymentStatus': true }, { term: { $exists: false } }] } });
    } else if (canLockInvoice === 'notUse') {
      result.push({ $match: { $expr: { $eq: [{ $ifNull: ['$term.currentNumber', 0] }, '$term.previousNumber'] } } });
    }

    if (invoiceLock === 'isLocked') {
      result.push({ $match: { $expr: { $eq: [{ $type: '$term.invoiceData' }, 'object'] } } });
    } else if (invoiceLock === 'isNotLocked') {
      result.push({ $match: { $expr: { $ne: [{ $type: '$term.invoiceData' }, 'object'] } } });
    }

    // paging
    result.push({
      $facet: {
        info: [{ $count: 'total' }],
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              id: '$_id',
              code: 1,
              name: 1,
              lastTimeMeterNumberUpdate: 1,
              status: 1,
              formattedAddress: 1,
              termInvoice: 1,
              termMeterNumber: 1,
              previousNumber: { $ifNull: ['$term.previousNumber', '$lastMeterNumber'] },
              currentNumber: { $ifNull: ['$term.currentNumber', 'N/A'] },
              isNotUse: { $eq: [{ $ifNull: ['$term.currentNumber', -1] }, '$term.previousNumber'] },
              isLock: { $eq: [{ $type: '$term.invoiceData' }, 'object'] },
              paymentStatus: { $eq: ['$term.paymentStatus', true] },
            },
          },
        ],
      },
    });
    return result;
  };
  Client.invoiceLockList = async function(filter, res) {
    const query = buildQuery(filter);
    const data = await aggregate(Client, query);
    let total = get(data, '[0].info[0].total', 0);
    let result = get(data, '[0]data', []);
    res.header('Content-Range', total);
    return result;
  };
  // site: ctm-client => get thong tin su dung nuoc
  Client.remoteMethod('invoiceLockList', {
    accepts: [
      { arg: 'filter', type: 'object', required: true },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
