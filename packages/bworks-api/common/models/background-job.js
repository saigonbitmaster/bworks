'use strict';
const si = require('systeminformation');
const moment = require('moment-timezone');
const set = require('lodash/set');

module.exports = function(Backgroundjob) {
  const system = { serial: 'FFFFFF' };
  si.system(({ serial }) => {
    if (serial) {
      system.serial = serial;
    }

    const parentFindOne = Backgroundjob.findOne.bind(Backgroundjob);
    Backgroundjob.findOne = function findOne(filter, options, cb) {
      if (!filter) filter = {};
      set(filter, 'where.serial', system.serial);
      return parentFindOne(filter, options, cb);
    };
  });
  const getSerial = () => {
    return system.serial;
  };
  const generateId = () => {
    return (
      system.serial +
      moment()
        .valueOf()
        .toString()
    );
  };

  Backgroundjob.clearData = async () => {
    const serial = getSerial();
    Backgroundjob.destroyAll({ serial });
  };

  Backgroundjob.init = async data => {
    const id = generateId();
    const serial = getSerial();
    const { key, opts, path } = data;
    return await Backgroundjob.create({
      key,
      opts: opts ? JSON.stringify(opts) : '{}',
      path,
      serial,
      id,
      registerDate: new Date(),
      status: 'NEW',
    });
  };

  Backgroundjob.complete = async jobKey => {
    const jobRecord = await Backgroundjob.findOne({ where: { key: jobKey, status: { neq: 'FINISH' } } });
    if (jobRecord) {
      await jobRecord.updateAttributes({
        status: 'FINISH',
        completedDate: new Date(),
      });
    }
  };

  Backgroundjob.error = async (jobKey, err) => {
    const jobRecord = await Backgroundjob.findOne({ where: { key: jobKey } });
    if (jobRecord) {
      const attrs = {
        status: 'FINISH',
        error: err.messages || err.message || err,
        meta: typeof err === 'object' ? err : null,
        completedDate: new Date(),
      };
      await jobRecord.updateAttributes(attrs);
    }
  };
};
