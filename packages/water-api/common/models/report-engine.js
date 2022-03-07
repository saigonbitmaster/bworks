'use strict';
const generatePDF = require('../common-logic/engine/report/generatePDF');
const generateInvoiceInPdf = require('../common-logic/engine/report/generate-invoice-in-pdf');

module.exports = function(Reportengine) {
  generatePDF(Reportengine);
  generateInvoiceInPdf(Reportengine);
};
