'use trict';

const defaultNotifyJob = require('./process-ctm-notify');
const defaultEmailJob = require('./process-ctm-email');

module.exports = JobSystem => {
  JobSystem.observe('before save', (ctx, next) => {
    try {
      const job = ctx.instance;
      if (job) {
        if (ctx.isNewInstance) {
          const { category, functionPath } = job;
          if (!functionPath) {
            switch (category) {
              case 'NOTIFY': {
                // set(job, 'instance.functionPath', JobName);
                if (job.functionPath !== defaultNotifyJob.JobName) {
                  job.functionPath = defaultNotifyJob.JobName;
                }
                break;
              }
              case 'EMAIL': {
                if (job.functionPath !== defaultEmailJob.JobName) {
                  job.functionPath = defaultEmailJob.JobName;
                }
                break;
              }
            }
          }
        }
        job.lastTimeUpdatedDate = new Date();
        next();
      }
    } catch (e) {
      throw e;
    }
  });

  JobSystem.observe('after save', async ctx => {
    const job = ctx.instance;
    if (job && job.status === 'RUNNING') {
      if (!ctx.isNewInstance) {
        const { id, functionPath, type } = job;
        if (type === JobSystem.JOB_TYPE.SCHEDULE || type === JobSystem.JOB_TYPE.CUSTOM) {
          const previousJob = await JobSystem.findById(id);
          if (functionPath && previousJob && previousJob.repeat) {
            await JobSystem.removeRepeatableJob(functionPath, { ...previousJob.repeat, jobId: id.toString() }, type);
          }
        }
      }
      await JobSystem.registerJob(job);
    }
    const currentJob = ctx.currentInstance;
    if (currentJob) {
      if (ctx.data && ctx.data.status) {
        const { functionPath, type, repeat, status, id } = currentJob;
        if (status === 'RUNNING') {
          if (type === JobSystem.JOB_TYPE.SCHEDULE || type === JobSystem.JOB_TYPE.CUSTOM) {
            if (functionPath && repeat) {
              await JobSystem.removeRepeatableJob(functionPath, { ...repeat, jobId: id.toString() }, type);
            }
          }
        }
        if (ctx.data.status === 'RUNNING') {
          await JobSystem.registerJob(currentJob, true);
        }
      }
    }
  });
};
