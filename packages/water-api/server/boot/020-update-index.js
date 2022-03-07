'use strict';
const delay = require('delay');
const async = require('async');
const { get, keyBy } = require('lodash');
const hash = require('object-hash');
const moment = require('moment-timezone');
const { rawExecute } = require('../../common/utils/mongo-common');

const FORCE_INDEX = !!process.env.NODE_FORCE_INDEX || process.env.NODE_ENV !== 'development' || false;
/* eslint-disable no-console */
module.exports = async app => {
  if (!process.env.NODE_INDEX) return;
  // avoid multi update from development invironment
  const current = moment().toDate();
  const compareDate = FORCE_INDEX ? moment() : moment().subtract(12, 'hour');
  await delay(1000);
  const indexHistoryMap = {};
  // create index
  await async.mapSeries(
    Object.keys(app.models),
    async key => {
      let model = app.models[key];
      let dataSource = model.getDataSource();
      // if (get(dataSource, 'settings.database') !== 'toanNmsLog2') {
      //   return;
      // }
      if (get(dataSource, 'settings.connector') === 'mongodb') {
        // get index history in model database
        if (!indexHistoryMap[dataSource.name]) {
          // get current Index, using raw mongo query
          let currentIndexs = await rawExecute(dataSource, 'IndexHistory', collection => {
            return new Promise((resolve, reject) =>
              collection.find({ logTime: { $lt: current } }).toArray((err, docs) => {
                if (err) return reject(err);
                resolve(docs);
              }),
            );
          });
          indexHistoryMap[dataSource.name] = keyBy(currentIndexs, '_id');
        }
        let hashModel = hash(
          { local: model.definition.properties, global: model.definition.indexs, relation: model.definition.relations },
          { ignoreUnknown: true, respectFunctionProperties: false },
        );
        // verify & update index
        if (
          !indexHistoryMap[dataSource.name][model.modelName] ||
          (indexHistoryMap[dataSource.name][model.modelName].hash !== hashModel &&
            compareDate.diff(moment(indexHistoryMap[dataSource.name][model.modelName].logTime), 'hour') >= 0)
        ) {
          try {
            let result = await model.dataSource.autoupdate(model.modelName);
            console.log(`Index model ${model.modelName} result: ${result === undefined ? 'OK' : result}`);
            await rawExecute(dataSource, 'IndexHistory', collection => {
              return collection.updateOne(
                { _id: model.modelName },
                { $set: { _id: model.modelName, logTime: new Date(), hash: hashModel } },
                { upsert: true },
              );
            });
          } catch (e) {
            console.log(`Index model ${model.modelName} Error: ${e}`);
          }
        }
      }

      return true;
    },
    err => (err ? console.error('Update Index error', err) : console.log('Update Index OK!')),
  ); // eslint-disable-line no-console)
};
/* eslint-enable no-console */
