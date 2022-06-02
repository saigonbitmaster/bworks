const moment = require('moment-timezone');
const funcLogs = {
  // eslint-disable-next-line
  demoJob: async function({ app, options }) {
    try {
      // eslint-disable-next-line
      console.log('=== START demoJob ===', moment().format('YYYY/MM/DD HH:mm:ss'));
      // eslint-disable-next-line
      console.log('=== END demoJob ===');
    } catch (e) {
      // eslint-disable-next-line
      console.log('=== ERROR demoJob: ', e);
      throw e;
    }
  },
};
module.exports = funcLogs;