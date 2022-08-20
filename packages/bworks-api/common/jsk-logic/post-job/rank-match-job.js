//rank the bids from job seekers for a posted job
//select matched jobs for a job seeker
'use strict';
const moment = require('moment-timezone');
module.exports = PostJob => {
  PostJob.rankMatchJob = async (jobId, jobSeekerId, filter
  ) => {
    const jobs = await PostJob.app.models.Test.find({});
    return jobs;
  };

  PostJob.remoteMethod('rankMatchJob', {
    accepts: [
      { arg: 'jobId', type: 'string', required: true },
      { arg: 'jobSeekerId', type: 'string', required: true },
      { arg: 'filter', type: 'object' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
