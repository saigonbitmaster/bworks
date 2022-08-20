//rank the bids from job seekers for a posted job
//select matched jobs for a job seeker
'use strict';
const moment = require('moment-timezone');
module.exports = BiddingJob => {
  BiddingJob.rankBid = async (jobId, filter
  ) => {
    const jobs = await BiddingJob.app.models.PostJob.app.models.Test.find({});
    return jobs;
  };

  BiddingJob.remoteMethod('rankBid', {
    accepts: [
      { arg: 'jobId', type: 'string', required: true },
      { arg: 'filter', type: 'object' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
