'use strict';
const backRestore = require('../../testData/backup-restore');
const testData = require('../../testData');
module.exports = async app => {
  if (process.env.NODE_INIT_DATA_NMS) {
    console.log('start run init data nms');
    await testData(app);
  } else if (process.env.NODE_BACKUP_TEST_DATA) {
    await backRestore.backup(app);
  } else if (process.env.NODE_RESTORE_TEST_DATA) {
    await backRestore.restore(app);
  }
};
