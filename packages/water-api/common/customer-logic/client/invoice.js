'use strict';
const createError = require('http-errors');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const delay = require('delay');
const { readFileSync } = require('fs');
const pos = require('../../utils/pos/pos');

module.exports = Client => {
  Client.invoice = async (id, width = 576, mode = 'raw', res) => {
    const models = Client.app.models;
    const meterNumber = await models.ClientMeterNumber.findById(id);
    if (!meterNumber) {
      throw createError(400, 'error.INVOICE_NO_INVALID');
    }
    let template = await models.CtmTemplate.getTemplateContent('ClientInvoice');
    if (process.env.NODE_ENV === 'development') {
      template = {};
      template.content = readFileSync(`${process.cwd()}/../../tmp/invoice.html`, 'utf8');
    }
    const content = handlebars.compile(template.content)(meterNumber.invoiceData);
    switch (mode.toLowerCase()) {
      case 'pos':
      case 'png': {
        const browser = await puppeteer.launch({
          headless: true,
          // args: ['--hide-scrollbars'],
        });
        try {
          const page = await browser.newPage();
          const scale = 1;
          page.setViewport({ width: (width || 384) / scale, height: 600, deviceScaleFactor: scale });
          await page.setContent(content);
          await delay(50);
          if (mode === 'png') {
            const base64Content = await page.screenshot({ encoding: 'base64', fullPage: true });
            return { data: base64Content };
          }
          await page.screenshot({ path: `${process.cwd()}/abc.png`, fullPage: true });
          const imgBuf = await page.screenshot({ encoding: 'binary', fullPage: true });
          const data = await pos.getImageBase64Segment(imgBuf, 'image/png');
          await page.close();
          await browser.close();
          await browser.disconnect();
          return { data };
        } catch (e) {
          throw e;
        } finally {
          if (browser) {
            await browser.close();
            await browser.disconnect();
          }
        }
      }
      case 'html': {
        return { data: content };
      }
      default:
        res.send(content);
    }
  };

  // check valid MaKH, MaHD, Masothue khi chinh sua hop dong va khach hang
  Client.remoteMethod('invoice', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'width', type: 'number' },
      { arg: 'mode', type: 'string' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: {
      arg: 'data',
      type: 'object',
      root: true,
    },
  });
};
