'use strict';
const get = require('lodash/get');
const app = require('../server');

module.exports = async ({ data, options: rawOptions, ctx, isNew, userMeta, isSystem = false }) => {
  let userId = '';
  let current = new Date();
  let options = rawOptions || get(ctx, 'options', null);
  if (isSystem) {
    options = {
      accessToken: {
        userId: app.get('systemId'),
      },
    };
  } else {
    if (options) {
      const token = options && options.accessToken;
      if (token && token.userId) {
        userId = token.userId;
      }
    }
  }

  if (userId) {
    const items = data instanceof Array ? data : [data];
    items.map(item => {
      if (userMeta) {
        item[userMeta] = userId;
      }
      item.updaterId = userId;
      item.updatedDate = current;
      if (isNew) {
        item.creatorId = userId;
        item.createdDate = current;
      }
    });
    return data instanceof Array ? items : items[0];
  }
  return data;
};
