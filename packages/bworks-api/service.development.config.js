'use strict';
/* eslint-disable camelcase */
module.exports = {
  apps: [
    {
      name: 'bworks[dev]',
      cwd: `${process.env.HOME}/auto-deploy/water/packages/bworks-api`,
      script: 'server/server.js',
      restart_delay: 600000,
      watch: false,
      instance_var: 'INSTANCE_ID',
      env: {
        NODE_ENV: 'development',
        NODE_INDEX: '',
        NODE_INIT_DATA: '',
        NODE_JOB: '',
        NODE_DEBUG_JOB: '',
        NODE_PRODUCT_DB: 'bWorksTest',
      },
    },
  ],
};
