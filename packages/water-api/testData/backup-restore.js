'use strict';
const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { mapSeries } = require('async');
// const models = ['AppUser', 'Dma', 'Node', 'MaterialDetailType', 'MaterialStock', 'MaterialExport', 'MaterialUse'];

const models = ['Dma', 'Node', 'MaterialDetailType', 'MaterialStock', 'MaterialExport', 'MaterialUse'];

const getBackupPath = () => {
  return path.join(__dirname, '/dbFiles/backup');
};
const getTempPath = () => {
  return path.join(__dirname, '/dbFiles/tmp');
};
const copyModel = async (app, modelName) => {
  let model = app.models[modelName];
  let dbSettings = model.dataSource.settings;
  // build dump command
  let command = 'mongodump';
  // connect
  command += ` --host ${dbSettings.host}`;
  command += ` --port ${dbSettings.port}`;
  command += ` --db ${dbSettings.database}`;
  // authenticate
  if (dbSettings.authSource) {
    command += ` --authenticationDatabase ${dbSettings.authSource}`;
    command += ` --username ${dbSettings.user}`;
    command += ` --password ${dbSettings.password}`;
  }
  // collection
  command += ` --collection ${modelName}`;
  // output
  command += ` --out ${getTempPath(modelName)}`;
  let cs = await exec(command);
  // eslint-disable-next-line no-console
  console.log(cs.stdout);
  // copy to backup folder
  command = `mv ${getTempPath()}/${dbSettings.database}/${modelName}.bson ${getBackupPath()}/`;
  await exec(command);
  command = `mv ${getTempPath()}/${dbSettings.database}/${modelName}.metadata.json ${getBackupPath()}/`;
  await exec(command);
  // delete all in temp folter
  await exec(`rm -rf ${getTempPath()}/*`);
  // eslint-disable-next-line no-console
};

const backup = async app => {
  // delete all in temp folter
  await exec(`mkdir -p ${getTempPath()}`);
  await exec(`rm -rf ${getTempPath()}/*`);
  // delete all in temp folter
  await exec(`rm -rf ${getBackupPath()}/*`);
  await mapSeries(
    models,
    async modelName => {
      if (fs.existsSync(path.join(getBackupPath(), `${modelName}.bson`))) {
        // eslint-disable-next-line no-console
        console.log('restore', modelName);
        return await copyModel(app, modelName);
      }
    },
    // eslint-disable-next-line no-console
    err => (err ? console.error('Test data backup error', err) : console.log('Test data backup OK!')),
  );
};

const restoreModel = async (app, modelName) => {
  let model = app.models[modelName];
  let dbSettings = model.dataSource.settings;
  // build command
  let command = 'mongorestore';
  // connect
  command += ` --host ${dbSettings.host}`;
  command += ` --port ${dbSettings.port}`;
  command += ` --db ${dbSettings.database}`;
  // authenticate
  if (dbSettings.authSource) {
    command += ` --authenticationDatabase ${dbSettings.authSource}`;
    command += ` --username ${dbSettings.user}`;
    command += ` --password ${dbSettings.password}`;
  }
  // collection
  command += ` --collection ${modelName}`;
  // bson file
  command += ` ${getBackupPath()}/${modelName}.bson --drop`;
  let cs = await exec(command);
  // eslint-disable-next-line no-console
  console.log('Restore', modelName, cs.stderr);
};
const restore = async app => {
  await mapSeries(
    models,
    async modelName => await restoreModel(app, modelName),
    // eslint-disable-next-line no-console
    err => (err ? console.error('Test data restore error', err) : console.log('Test data restore OK!')),
  );
};

module.exports = { backup, restore };
