'use strict';
// eslint-disable-next-line no-unused-vars
const { get } = require('lodash');
module.exports = function(Packageconfig) {
  // eslint-disable-next-line no-unused-vars
  Packageconfig.registerMenu = async menu => {
    const screens = menu.menu.map(screen => {
      const icon = get(screen, 'icon.props.name', '');
      screen.icon = icon;
      return screen;
    });
    Packageconfig.upsert({ data: { ...menu, menu: screens }, id: menu.projectKey });
  };

  Packageconfig.remoteMethod('registerMenu', {
    accepts: [{ arg: 'menu', type: 'object', required: true }],
    http: { verb: 'post' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
