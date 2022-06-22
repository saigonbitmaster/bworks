'use strict';
const path = require('path');
const fs = require('fs');
const get = require('lodash/get');
const { pascalCase, camelCase } = require('change-case');
// eslint-disable-next-line no-undef
const debug = require('debug')('bworks-api:boot:ext-logic');

const LOGIC_DIRS = [
  'common/common-logic',
  'common/logic',
  'common/emp-logic',
  'common/jsk-logic',
  'common/cardano-logic',
  'common/org-logic',
  'common/cms-logic',
];
const OVERRIDE = {
  Role: {
    find: true,
  },
};

module.exports = async app => {
  LOGIC_DIRS.map(key => {
    const logicPath = path.join(app.dirs.root, key);
    if (fs.existsSync(logicPath) && fs.lstatSync(logicPath).isDirectory) {
      let subDirs = fs.readdirSync(logicPath);
      if (subDirs && subDirs.length > 0) {
        subDirs.map(modelKey => {
          let modelLogicPath = path.join(logicPath, modelKey);
          if (fs.existsSync(modelLogicPath) && fs.lstatSync(modelLogicPath).isDirectory()) {
            let funFiles = fs.readdirSync(modelLogicPath);
            if (funFiles && funFiles.length > 0) {
              funFiles.map(funFile => {
                let funFilePath = path.join(modelLogicPath, funFile);
                if (fs.existsSync(funFilePath) && fs.lstatSync(funFilePath).isFile()) {
                  if (funFile.lastIndexOf('.js') === funFile.length - 3) {
                    let modelName = pascalCase(modelKey);
                    if (app.models[modelName]) {
                      let funcName = camelCase(funFile.substr(0, funFile.length - 3));
                      let moduleExport = require(`../../${key}/${modelKey}/${funFile}`);
                      if (moduleExport) {
                        if (typeof moduleExport === 'function') {
                          if (!app.models[modelName][funcName]) {
                            moduleExport(app.models[modelName]);
                          } else if (get(OVERRIDE, `${modelName}.${funcName}`)) {
                            // eslint-disable-next-line no-console
                            console.log('remote', modelName, funcName, 'has been overriden!', 'file:', funFile);
                            moduleExport(app.models[modelName]);
                          } else {
                            // eslint-disable-next-line no-console
                            console.log('remote', modelName, funcName, 'already added!', 'file:', funFile);
                          }
                        }
                        if (typeof moduleExport === 'object') {
                          const extFunction = moduleExport.default;
                          if (typeof extFunction === 'function') {
                            if (!app.models[modelName][funcName]) {
                              extFunction(app.models[modelName]);
                            } else if (get(OVERRIDE, `${modelName}.${funcName}`)) {
                              // eslint-disable-next-line no-console
                              console.log('remote', modelName, funcName, 'has been overriden!', 'file:', funFile);
                              extFunction(app.models[modelName]);
                            } else {
                              // eslint-disable-next-line no-console
                              console.log('remote', modelName, funcName, 'already added!', 'file:', funFile);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              });
            }
          }
        });
      }
    }
  });
  // eslint-disable-next-line no-console
  debug('Add ext logic OK!');
};
