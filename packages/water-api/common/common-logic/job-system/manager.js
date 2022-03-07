'use strict';
const os = require('os');
const createHash = require('crypto').createHash;
const get = require('lodash/get');
const eachSeries = require('util').promisify(require('async/eachSeries'));
const Queue = require('bull');
const moment = require('moment-timezone');

module.exports = JobSystem => {
  // Constants
  const JOB_TYPE = {
    SCHEDULE: 'SCHEDULE',
    RUN_NOW: 'RUN_NOW',
    CUSTOM: 'CUSTOM',
  };
  const REDIS_DATABASE = JobSystem.app.dataSources.redis.settings;

  JobSystem.JOB_TYPE = JOB_TYPE;

  const getPrefix = () => {
    const networkInterfaces = os.networkInterfaces();
    const networkInterfaceNames = Object.keys(networkInterfaces);
    let prefix = 'seqq';
    for (const networkInterfaceName of networkInterfaceNames) {
      const networkInterface = networkInterfaces[networkInterfaceName];
      const macAddr = get(networkInterface, '[0].mac', null);
      if (macAddr && macAddr.indexOf('00:00') !== 0) {
        prefix = createHash('sha256')
          .update(macAddr)
          .digest('base64')
          .replace(/[^a-zA-Z]+/g, '')
          .substring(0, 4)
          .toLowerCase();
        break;
      }
    }

    return prefix;
  };

  const prefix = getPrefix();

  // const getFunctionProcess = functionPath => {
  //   return get(JobSystem.app.models, functionPath, null);
  // };

  JobSystem.getJob = (jobQueueKey, jobId) => {
    const currentQueue = JobSystem.queue[jobQueueKey];
    if (currentQueue) {
      return currentQueue.getJob(jobId);
    }
    return null;
  };

  JobSystem.removeRepeatableJob = async (functionPath, repeatObject = {}, jobQueueKey = 'SCHEDULE') => {
    const currentQueue = JobSystem.queue[jobQueueKey];
    const { description, count, ...repeat } = repeatObject;
    if (currentQueue) await currentQueue.removeRepeatable(functionPath, repeat);
  };

  const validateFunctionPath = functionPath => {
    if (typeof functionPath !== 'string') {
      return false;
    }

    const pathSplit = functionPath.split('.');
    if (pathSplit.length !== 2) {
      return false;
    }
    if (pathSplit[1].indexOf('process') !== 0) {
      // eslint-disable-next-line no-console
      console.error('Invalid job function, required prefix "process"', functionPath);
    }

    const func = get(JobSystem.app.models, functionPath, null);
    return !!func;
  };

  const executeProcess = async job => {
    const functionPath = get(job, 'data.functionPath');
    const repeat = get(job, 'opts.repeat', {});
    const { limit, count, endDate, jobId } = repeat;
    if (limit || endDate) {
      if (count === limit || moment().isAfter(moment(endDate, 'YYYY-MM-DD'))) {
        const jobInstance = await JobSystem.findById(jobId);
        if (jobInstance) jobInstance.updateAttribute('status', 'DONE');
      }
    }
    const func = get(JobSystem.app.models, functionPath, null);
    if (func) {
      return func(job);
    }
  };

  JobSystem.queue = {};
  JobSystem.queue[JOB_TYPE.SCHEDULE] = new Queue(JOB_TYPE.SCHEDULE, { redis: REDIS_DATABASE, prefix });
  JobSystem.queue[JOB_TYPE.RUN_NOW] = new Queue(JOB_TYPE.RUN_NOW, { redis: REDIS_DATABASE, prefix });
  JobSystem.queue[JOB_TYPE.CUSTOM] = new Queue(JOB_TYPE.CUSTOM, { redis: REDIS_DATABASE, prefix });

  const registerProcess = async () => {
    if (!process.env.NODE_JOB) return;
    // clear repeat able job
    eachSeries(JobSystem.JOB_TYPE, async jobKey => {
      const repeatableJobs = await JobSystem.queue[jobKey].getRepeatableJobs();
      eachSeries(repeatableJobs, async job => {
        // eslint-disable-next-line no-console
        console.log('remove Repeatable', job.name);
        return JobSystem.queue[jobKey].removeRepeatableByKey(job.key);
      });
      if (process.env.NODE_ENV === 'development') {
        const delayedJobs = await JobSystem.queue[jobKey].getDelayed();
        eachSeries(delayedJobs, async job => {
          // eslint-disable-next-line no-console
          console.log('remove Delayed', job.name);
          return job.remove();
        });
      }
    });
    JobSystem.queue[JOB_TYPE.SCHEDULE].process('*', executeProcess);
    JobSystem.queue[JOB_TYPE.RUN_NOW].process('*', executeProcess);
    JobSystem.queue[JOB_TYPE.CUSTOM].process('*', executeProcess);
  };

  JobSystem.registerSchedule = (functionPath, payload, repeat, options) => {
    if (validateFunctionPath(functionPath) && repeat) {
      // console.log('registerSchedule', functionPath, JSON.stringify({ ...options, repeat }));
      try {
        JobSystem.queue[JOB_TYPE.SCHEDULE].add(
          functionPath,
          { functionPath, type: JOB_TYPE.SCHEDULE, payload },
          { ...options, repeat },
        );
      } catch (e) {
        throw e;
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('Invalid registerSchedule', functionPath, repeat, options);
    }
  };

  JobSystem.registerRunNow = (functionPath, payload, options = {}) => {
    // Do not accept repeatable jobs
    if (validateFunctionPath(functionPath) && !options.repeat) {
      // console.log('registerRunNow', functionPath);
      JobSystem.queue[JOB_TYPE.RUN_NOW].add(functionPath, { functionPath, type: JOB_TYPE.RUN_NOW, payload }, options);
    } else {
      // eslint-disable-next-line no-console
      console.error('Invalid registerRunNow', functionPath, options);
    }
  };

  JobSystem.registerCustom = (functionPath, payload, options = {}) => {
    // Accept all types of job
    if (validateFunctionPath(functionPath)) {
      // console.log('registerCustom', functionPath);
      JobSystem.queue[JOB_TYPE.CUSTOM].add(functionPath, { functionPath, type: JOB_TYPE.CUSTOM, payload }, options);
    } else {
      // eslint-disable-next-line no-console
      console.error('Invalid registerCustom', functionPath, options);
    }
  };

  JobSystem.registerJob = (jobInstance, forcedRegister) => {
    const { type, functionPath, payload, repeat: tempRepeat = {}, options: tempOptions, id, status } = jobInstance;
    const options = { ...tempOptions, jobId: id.toString() };
    const { description, count, ...repeat } = tempRepeat;
    if (status === 'RUNNING' || forcedRegister) {
      // console.log(
      //   `registerJob ${type}:
      //   functionPath: ${JSON.stringify(functionPath)},
      //   payload: ${JSON.stringify(payload)},
      //   repeat: ${JSON.stringify(repeat)},
      //   options: ${JSON.stringify(options)}`,
      // );
      switch (type) {
        case 'SCHEDULE': {
          JobSystem.registerSchedule(functionPath, payload, repeat, options);
          break;
        }
        case 'RUN_NOW': {
          JobSystem.registerRunNow(functionPath, payload, options);
          break;
        }
        case 'CUSTOM': {
          JobSystem.registerCustom(functionPath, payload, { ...options, repeat });
        }
      }
    }
  };

  // JobSystem.queue[JOB_TYPE.SCHEDULE].on('global:completed', job => {
  //   console.log(job);
  // });

  // init process
  registerProcess();
};
