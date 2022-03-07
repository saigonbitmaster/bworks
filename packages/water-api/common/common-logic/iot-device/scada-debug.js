'use strict';
// const delay = require('delay');
const _ = require('lodash');
const filterNodes = require('loopback-filters');
const utils = require('loopback/lib/utils');
const PassThrough = require('stream').PassThrough;

module.exports = function(Iotdevice) {
  Iotdevice.beforeRemote('scadaDebug', Iotdevice.verify);
  Iotdevice.scadaDebug = function(deviceKey, res, options, cb) {
    res.set('Connection', 'keep-alive');
    res.setTimeout(24 * 3600 * 1000);
    res.set('X-Accel-Buffering', 'no');
    const id = deviceKey.toLowerCase();
    if (typeof options === 'function') {
      cb = options;
      options = undefined;
    }
    cb = cb || utils.createPromiseCallback();

    const idName = this.getIdName();
    const Model = this;
    const changes = new PassThrough({ objectMode: true });

    changes._destroy = function() {
      changes.end();
      changes.emit('end');
      changes.emit('close');
    };

    changes.destroy = changes.destroy || changes._destroy; // node 8 compability

    changes.on('error', removeHandlers);
    changes.on('close', removeHandlers);
    changes.on('finish', removeHandlers);
    changes.on('end', removeHandlers);

    process.nextTick(function() {
      Iotdevice.findById(id).then(data => {
        if (data) {
          const reported = _.get(data, 'state.reported', {});
          changes.write({ id, name: data.name, reported });
        }
      });
      cb(null, changes);
    });

    Model.observe('after save', changeHandler);

    return cb.promise;

    function changeHandler(ctx, next) {
      const change = createChangeObject(ctx, 'save');
      if (change && change.data && change.data.id && change.data.id.toString() === id) {
        const reported = _.get(change.data, 'state.reported', {});
        changes.write({ id, name: change.data.name, reported });
      }

      next();
    }

    function createChangeObject(ctx, type) {
      const where = ctx.where;
      let data = ctx.instance || ctx.data;
      // eslint-disable-next-line no-unused-vars
      const whereId = where && where[idName];

      // the data includes the id
      // or the where includes the id
      let target;

      if (data && (data[idName] || data[idName] === 0)) {
        target = data[idName];
      } else if (where && (where[idName] || where[idName] === 0)) {
        target = where[idName];
      }

      const hasTarget = target === 0 || !!target;

      // apply filtering if options is set
      if (options) {
        const filtered = filterNodes([data], options);
        if (filtered.length !== 1) {
          return null;
        }
        data = filtered[0];
      }

      const change = {
        target: target,
        where: where,
        data: data,
      };

      switch (type) {
        case 'save':
          if (ctx.isNewInstance === undefined) {
            change.type = hasTarget ? 'update' : 'create';
          } else {
            change.type = ctx.isNewInstance ? 'create' : 'update';
          }

          break;
        case 'delete':
          change.type = 'remove';
          break;
      }

      return change;
    }

    function removeHandlers() {
      Model.removeObserver('after save', changeHandler);
    }
  };

  Iotdevice.remoteMethod('scadaDebug', {
    description: 'stream updated messages of the logged in user.',
    accessType: 'READ',
    accepts: [
      { arg: 'x-device-key', type: 'string', http: { source: 'header' } },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      {
        arg: 'userId',
        type: 'string',
      },
    ],
    http: {
      verb: 'get',
    },
    returns: [{ arg: 'changes', type: 'ReadableStream', json: true }],
  });
};
