'use strict';
const aggregate = require('../../utils/aggregate');

module.exports = EinvoiceRange => {
  EinvoiceRange.getMostRecentlyUsableEinvoiceRange = async () => {
    const query = [
      { $match: { isActive: true } },
      { $addFields: { remaining_invoices: { $subtract: ['$totalInv', '$numOfpublishInv'] } } },
      { $match: { remaining_invoices: { $gt: 0 } } },
      { $sort: { verifyAt: 1, priority: 1 } },
    ];
    return await aggregate(EinvoiceRange, query);
  };
};
