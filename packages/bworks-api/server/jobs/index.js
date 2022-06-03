'use strict';
const moment = require('moment-timezone');
const kue = require('kue-scheduler');
const get = require('lodash/get');
const createError = require('http-errors');
const si = require('systeminformation');
const jobDefaults = require('./job-defaults');
const debug = require('debug')('bworks-api:job');

const backoff = jobBackoff => {
  debug('jobBackoff', jobBackoff);
};
const init = async app => {
  // only run job on main instance
  const instanceId = process.env.NODE_APP_INSTANCE || 0;
  if (instanceId === 0) {
    let redisDatasoure = app.datasources.redis.settings;
    const siInfo = await si.system();
    let options = {
      prefix: siInfo.serial,
      skipConfig: false,
      redis: {
        port: redisDatasoure.port,
        host: redisDatasoure.host,
        db: redisDatasoure.db,
      },
    };
    // clear BackroundJob
    app.models.BackgroundJob.clearData();

    let Queue = kue.createQueue(options);
    // get override config job time from JobConfig model
    let jobOverride = {};

    app.jobQueue = Queue;
    Queue.clear(function(error, response) {
      debug('Clear queue jobs', error, response.length);
    });
    //listen on success scheduling
    Queue.on('schedule success', function(job) {
      //a highly recommended place to attach
      //job instance level events listeners
      job
        .on('complete', function(result) {
          if (process.env.NODE_DEBUG_JOB) {
            debug(job.id, job.type, result);
          }
          app.models.LogJob.create({
            key: job.type,
            process: job.id,
            on: 'complete',
            result,
            logTime: moment().toDate(),
          });
        })
        .on('failed attempt', function(errorMessage, doneAttempts) {
          app.models.LogJob.create({
            key: job.type,
            process: job.id,
            on: 'failed attempt',
            result: { errorMessage, doneAttempts },
            logTime: moment().toDate(),
          });
        })
        .on('failed', function(errorMessage) {
          app.models.LogJob.create({
            key: job.type,
            process: job.id,
            on: 'failed',
            result: { errorMessage },
            logTime: moment().toDate(),
          });
        })
        .on('progress', function(progress, data) {
          app.models.LogJob.create({
            key: job.type,
            process: job.id,
            on: 'failed',
            progress,
            result: { data },
            logTime: moment().toDate(),
          });
        });
    });
    // warning duplicated schedule
    Queue.on('already scheduled', function(job) {
      app.models.LogJob.create({
        key: job.type,
        process: job.id,
        on: 'already scheduled',
        result: null,
        logTime: moment().toDate(),
      });
    });
    let jobs = jobDefaults(app);
    // operating job
    Object.keys(jobs).map(jobKey => {
      let jobConfig = jobs[jobKey];
      // override jobConfig job time from JobConfig model
      if (jobOverride[jobKey]) {
        if (jobOverride[jobKey].time) {
          jobConfig.time = jobOverride[jobKey].time;
        }
        if (jobOverride[jobKey].options) {
          jobConfig.time = jobOverride[jobKey].options;
        }
      }
      // process job
      Queue.process(jobKey, (job, done) => {
        jobConfig
          .execute({ app, options: jobConfig.options || {} })
          .then(result => done(null, result))
          .catch(error => done(error));
      });
      // create job
      let job = Queue.createJob(jobKey, jobConfig.options || {})
        .attempts(jobConfig.attempts || 3)
        .priority('normal')
        .unique(jobKey);
      // register time to run job
      Queue.every(jobConfig.time, job);
    });
    app.runBackground = async opts => {
      if (!opts || !opts.path || !opts.jobKey) {
        throw createError(400, 'error.JOB_INVALID');
      }
      const checkQueueJob = await app.models.BackgroundJob.findOne({
        where: { key: opts.jobKey, status: { neq: 'FINISH' } },
      });
      if (checkQueueJob) {
        throw createError(400, checkQueueJob.customeMsg || 'error.JOB_READY_INPROGRESS');
      }
      // register
      const jobInfo = await app.models.BackgroundJob.init({
        key: opts.jobKey,
        path: opts.path,
        opts,
      });
      var job = Queue.createJob('now', { options: opts })
        .attempts(1)
        .priority('normal');

      //schedule it to run now
      Queue.now(job);

      //somewhere process your scheduled jobs
      Queue.process('now', function(job, done) {
        const { path, data, jobKey } = get(job, 'data.options', { path: '', data: null, jobKey: '' });
        if (path) {
          const method = get(app.models, path);
          if (typeof method === 'function') {
            method(data)
              .then(() => {
                app.models.BackgroundJob.complete(jobKey);
              })
              .catch(e => {
                app.models.BackgroundJob.error(jobKey, e);
              })
              .finally(() => {
                done();
              });
          }
        }
      });
      return jobInfo.id;
    };
  }
};
module.exports = { backoff, init };
