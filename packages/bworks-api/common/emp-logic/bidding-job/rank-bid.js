
const utilCommon = require('../../utils/common');


module.exports = BiddingJob => {
  BiddingJob.rankBid = async (filter, res, options
  ) => {
    let jobId = filter.where.jobId

    const { limit, skip, order } = filter;
    const username = await BiddingJob.app.models.AppUser.findById(options.accessToken.userId);
    console.log(username);

    const jobs = await BiddingJob.app.models.Test.find()
    


    let dataTmp = utilCommon.splitPage(jobs, limit, skip);
    let dataSort = utilCommon.sort(dataTmp, order);
    res.header('content-range', jobs.length); // tong record
    return dataSort;

  };

  BiddingJob.remoteMethod('rankBid', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      {arg: "options", type: "object", http: "optionsFromRequest"}
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });

  BiddingJob.observe('access', function(ctx, next) {
    let a = true
    if(a) {
      next(new Error('Access denied'));
    } else {
      next()
    }
  });
};
