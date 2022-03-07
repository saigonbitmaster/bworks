module.exports = {
  apps: [
    {
      name: 'water[staging]',
      cwd: `${process.env.HOME}/auto-deploy/water/packages/water-api`,
      script: 'server/server.js',
      restart_delay: 600000,
      watch: false,
      instance_var: 'INSTANCE_ID',
      env: {
        NODE_ENV: 'production',
        NODE_INDEX: 'true',
        NODE_INIT_DATA: '',
        NODE_INIT_DATA_NMS: '',
        NODE_BACKUP_TEST_DATA: '',
        NODE_RESTORE_TEST_DATA: '',
        NODE_EMS_LOGGER: 'true',
        NODE_EMS_LOGGER_GENERATOR: 'true',
        NODE_JOB: 'true',
        NODE_DEBUG_JOB: 'true',
        NODE_LOG_STATISTIC_MAT: 'true',
        NODE_PRODUCT_DB: 'quangninh',
        NODE_INIT_DATA_WATER_SOURCE: 'true',
      },
    },
  ],
};
