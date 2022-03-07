'use strict';
const basic = require('basic-authorization-header');

module.exports = function(EInvoice) {
  // eslint-disable-next-line no-unused-vars
  EInvoice.sendRequest = async ({ method, params }) => {
    const meta = EInvoice.config.dataSource.settings.meta;
    const { username, password, tax } = meta;
    let authorization = basic(username, password);
    return new Promise((resolve, reject) => {
      EInvoice.invoke({ authorization, tax, ...params }, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };
};
