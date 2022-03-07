module.exports = {
  apps: [
    {
      name: 'water[bacninh]',
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
        NODE_EMS_LOGGER: '',
        NODE_EMS_LOGGER_GENERATOR: '',
        NODE_JOB: 'true',
        NODE_DEBUG_JOB: '',
        NODE_LOG_STATISTIC_MAT: '',
        NODE_IMPORT_REF_GEO: '',
        NODE_PRODUCT_DB: 'bacninh',
      },
    },
  ],
};
