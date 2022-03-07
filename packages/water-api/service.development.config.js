'use strict';
/* eslint-disable camelcase */
module.exports = {
  apps: [
    {
      name: 'water[dev]',
      cwd: `${process.env.HOME}/auto-deploy/water/packages/water-api`,
      script: 'server/server.js',
      restart_delay: 600000,
      watch: false,
      instance_var: 'INSTANCE_ID',
      env: {
        NODE_ENV: 'development',
        NODE_INDEX: '',
        NODE_INIT_DATA: '',
        NODE_INIT_DATA_NMS: '',
        NODE_BACKUP_TEST_DATA: '',
        NODE_RESTORE_TEST_DATA: '',
        NODE_EMS_LOGGER: 'true',
        NODE_EMS_LOGGER_GENERATOR: 'true',
        NODE_JOB: '',
        NODE_DEBUG_JOB: '',
        NODE_LOG_STATISTIC_MAT: 'true',
        NODE_PRODUCT_DB: '',
      },
    },
  ],
};
