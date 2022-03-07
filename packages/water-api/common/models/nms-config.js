'use strict';
const { camelCase } = require('lodash');
// eslint-disable-next-line no-unused-vars
module.exports = function(Nmsconfig) {
  Nmsconfig.remoteMethod('getUnusedChoices', {
    accepts: [],
    returns: { root: true, type: ['object'] },
    http: { verb: 'get' },
  });

  Nmsconfig.remoteMethod('getAttributeChoices', {
    accepts: [{ arg: 'id', type: 'any' }],
    returns: { root: true, type: ['object'] },
    http: { verb: 'get' },
  });

  Nmsconfig.observe('before save', async function checkData(ctx) {
    let data = ctx.instance;
    let FormatData = ctx.Model.definition.properties;
    let error = [];
    let systemField = ['createdDate', 'updatedDate', 'creatorId', 'updaterId', 'description'];
    if (data) {
      // keys is a special array - it got from neutral array instance loopback
      let keys = Object.keys(data['__data']);
      // console.log(data);
      keys.map(key => {
        let isNotSystemField = !systemField.some(i => i === key);
        if (isNotSystemField) {
          let field = FormatData[key];
          if (field['enum']) {
            let res = invalidField(data, field['enum'], key, typeof field['enum'][0]);
            if (Object.entries(res).length) error.push(res);
          }
          // if (field['']) {
          // }
        } else {
          // console.log(key);
        }
      });
    }
    if (error.length > 0) return error;
    return;
  });

  Nmsconfig.getUnusedChoices = async () => {
    let result = [];
    let allChoices = Nmsconfig.definition.properties.id.enum;
    // get current list
    let currentList = (await Nmsconfig.find({ fields: { id: true } })) || [];
    currentList = currentList.map(item => item.id);
    allChoices.map(key => {
      if (!currentList.includes(key.id)) {
        result.push(key);
      }
    });
    return result;
  };

  Nmsconfig.getAttributeChoices = async id => {
    let allChoices = Nmsconfig.definition.properties.id.enum;
    let result = {};
    // get type by id
    if (id) result = allChoices.filter(i => i.id == id);
    // get all type
    else result = allChoices;

    return result;
  };

  function invalidField(currentData, systemData, key, typeSystemData) {
    let validAttribute = [];
    let error = [];
    if (typeSystemData === 'object') {
      validAttribute = systemData.some(obj => obj[key] === currentData[key]);
      !validAttribute ? (error[key] = `${key} is invalid value`) : '';
    }
    if (typeSystemData === 'string') {
      validAttribute = systemData.some(item => item === currentData[key]);
      !validAttribute ? (error[key] = `${key} is invalid value`) : '';
    }
    return error;
  }

  Nmsconfig.getConfigByKey = async key => {
    let config = await Nmsconfig.findById(key);
    if (!config) {
      let defaultConfig = Nmsconfig.app.get(camelCase(key));
      if (defaultConfig) {
        return { value: defaultConfig };
      }
      return null;
    }
    return config;
  };
};
