'use strict';
const fs = require('fs');
const path = require('path');
// for browser simulator
const template = '<!DOCTYPE html><html><head><title>Page Title</title></head><body></body></html>';
const domino = require('domino');
const win = domino.createWindow(template);
global['window'] = win;
global['window']['Promise'] = global['Promise'];
global['document'] = win.document;
global['navigator'] = win.navigator;
global['Event'] = domino.impl.Event;
global['Node'] = domino.impl.Node;
global['DOMTokenList'] = domino.impl.DOMTokenList;

// priority: low index is first
const libs = ['./LocalExport.js', 'react-admin'];

const buildIndex = () => {
  let libIndex = {};
  let libExport = {};
  // index local
  libs.map(libName => {
    if (libName.indexOf('.') === 0) {
      let fileContent = fs.readFileSync(path.join(__dirname, libName), 'utf8');
      let array = fileContent.match(/{.*}/g);
      array.map(line => {
        let fixLine = line.replace('default as ', '');
        fixLine = fixLine.replace('{', '');
        fixLine = fixLine.replace('}', '');
        fixLine = fixLine.trim();
        let keys = fixLine.split(',');
        keys.map(key => {
          key = key.trim();
          if (key) {
            if (!libIndex[key]) {
              libIndex[key] = libName;
              if (!libExport[libName]) {
                libExport[libName] = {};
              }
              libExport[libName][key] = true;
            }
          }
        });
      });
    } else {
      let keys = Object.keys(require(libName));
      keys.map(key => {
        if (!libIndex[key]) {
          libIndex[key] = libName;
          if (!libExport[libName]) {
            libExport[libName] = {};
          }
          libExport[libName][key] = true;
        }
      });
    }
  });
  // check and delete old file
  const fileName = `${__dirname}/index.js`;
  let fileContent = '';

  let comment = '/* THIS FILE IS AUTO GENERATE, DO NOT CODE IN THIS FILE! */\n';
  fileContent += comment;
  Object.keys(libExport).map(libName => {
    // let objects export
    let keys = Object.keys(libExport[libName]);
    fileContent += `export {\n  ${keys.join(',\n  ')},\n} from '${libName}';\n`;
  });
  fileContent += comment;
  fs.writeFileSync(fileName, fileContent, { encoding: 'utf8', flag: 'w' });
  // eslint-disable-next-line
};

buildIndex();
