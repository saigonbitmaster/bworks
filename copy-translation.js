/* eslint-disable no-console */
'use strict';
const _ = require('lodash');
const lineReader = require('line-reader');
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');

const PROJECTS = {
  'wnms-web': true,
  'wctm-web': true,
  'wsrc-web': true,
  'worg-web': true,
};

const REMOVE_MISSING = false;
const SRC_LANGUAGE = 'vi';
const DEFAULT_TARGET_LANGUAGE = 'en';
const DEFAULT_PROJECT = 'abc';
const CLONE_KEY = '$CLONE$';

const projectName = process.argv.length > 2 ? process.argv[2] : DEFAULT_PROJECT;
const destLanguage = process.argv.length > 3 ? process.argv[3] : DEFAULT_TARGET_LANGUAGE;

const srcPath = path.join(__dirname, `packages/${projectName}/src/i18n/${SRC_LANGUAGE}`);
const destPath = path.join(__dirname, `packages/${projectName}/src/i18n/${destLanguage}`);

if (!PROJECTS[projectName]) {
  throw new Error(`Invalid project name: [${projectName}]`);
}

const mapFile = async filePath => {
  const result = { filePath, mapping: {}, dataKeys: [] };
  if (!fs.existsSync(filePath)) return result;
  return new Promise(resolve => {
    lineReader.eachLine(filePath, function(line, last) {
      const splitIndex = line.indexOf(':');
      let key = '';
      let val = '';
      if (splitIndex >= 0) {
        key = line.substring(0, splitIndex);
        val = line.substring(splitIndex);
      } else {
        key = line;
        val = CLONE_KEY;
      }
      let i = 0;
      let fixKey = '';
      do {
        fixKey = `${key}-${i}`;
        i++;
      } while (result.mapping[fixKey]);
      result.mapping[fixKey] = val;
      result.dataKeys.push({ mapKey: fixKey, realKey: key });
      if (last) {
        resolve(result);
        return false; // stop reading
      }
    });
  });
};

const updateDest = async (srcMap, destMap) => {
  let content = '';
  srcMap.dataKeys.map(keyObj => {
    if (destMap.mapping[keyObj.mapKey]) {
      // reuse variable
      let val = destMap.mapping[keyObj.mapKey];
      content += keyObj.realKey;
      if (val !== CLONE_KEY) {
        content += val;
      }
      content += '\n';
    } else {
      // new variable
      let val = srcMap.mapping[keyObj.mapKey];
      content += keyObj.realKey;
      if (val !== CLONE_KEY) {
        content += val;
      }
      content += '\n';
    }
  });
  fs.writeFileSync(destMap.filePath, content, 'utf-8');
  console.log(destMap.filePath);
};

const copyTranslateFile = async (fileSource, fileDest) => {
  const srcMap = await mapFile(fileSource);
  const destMap = await mapFile(fileDest);
  await updateDest(srcMap, destMap);
};

const deepFileList = (dir, prefixPath, files = {}) => {
  const listRootDir = fs.readdirSync(dir);
  _.each(listRootDir, item => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      deepFileList(fullPath, prefixPath, files);
    } else {
      files[fullPath.replace(prefixPath, '')] = true;
    }
  });
};

const copy = async () => {
  const srcFiles = {};
  const destFiles = {};
  execSync(`mkdir -p ${destPath}`);
  deepFileList(srcPath, srcPath, srcFiles);
  deepFileList(destPath, destPath, destFiles);
  if (REMOVE_MISSING) {
    _.each(destFiles, (item, key) => {
      if (!srcFiles[key]) {
        // remove missing
        const fullPath = path.join(destPath, key);
        console.log('Remove missing', fullPath.replace(__dirname, ''));
        fs.unlinkSync(fullPath);
      }
    });
  }
  // update file flow
  _.each(srcFiles, (item, key) => {
    const fullItemSrcPath = path.join(srcPath, key);
    const fullItemDestPath = path.join(destPath, key);
    copyTranslateFile(fullItemSrcPath, fullItemDestPath);
  });
  console.log('Fix eslint');
  const lintCommand = `yarn lintPath ${destPath} --fix`;
  console.log('lintCommand', lintCommand);
  execSync(lintCommand);
};

copy().then(() => console.log('Copy Translate done!'));
