'use strict';
const delay = require('delay');

const initSystemJob = [
  {
    project: 'SYS',
    type: 'SCHEDULE',
    repeat: { cron: '*/15 * * * * *', description: 'Mỗi 15 giây' },
    payload: {},
    functionPath: 'MessageSystem.processMessage',
    status: 'RUNNING',
    key: 'messageSystemJob',
    category: 'DEFAULT',
  },
];

module.exports = JobSystem => {
  JobSystem.defaultJobs = async () => {
    while (!JobSystem.app.bootCompleted) {
      await delay(100);
    }
    // eslint-disable-next-line no-console
    // console.log('Register default jobs');
    // register default jobs here!
    // init MessesageSystem job
    const initJob = await Promise.all(
      initSystemJob.map(async job => {
        const [jobInstance] = await JobSystem.findOrCreate({ where: { key: job.key } }, job);
        return jobInstance;
      }),
    );
    const runningJobs = await JobSystem.find({
      where: { and: [{ status: 'RUNNING' }, { category: { neq: 'DEFAULT' } }] },
    });
    [...initJob, ...runningJobs].forEach(job => JobSystem.registerJob(job));
  };
  JobSystem.defaultJobs();
};
