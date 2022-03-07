'use strict';
/* eslint-disable camelcase */
module.exports = {
  apps: [
    {
      name: 'water[srctest]',
      cwd: `${process.env.HOME}/hau-deploy/water/packages/water-api`,
      script: 'server/server.js',
      restart_delay: 600000,
      watch: false,
      instance_var: 'INSTANCE_ID',
      env: {
        PORT: '6001',
        NODE_ENV: 'development',
        // "NODE_INIT_DATA_DMA_QUALITY": "hourly",
        NODE_INDEX: 'true',
        NODE_INIT_DATA: 'true', // init config data src & nms
        NODE_INIT_DATA_NMS: '', //init data nms(full)
        NODE_INIT_DATA_SIMPLE_NMS: '', // init data(material detail type, export, stock, dma) nms
        NODE_BACKUP_TEST_DATA: '',
        NODE_RESTORE_TEST_DATA: '',
        NODE_EMS_LOGGER: '',
        NODE_EMS_LOGGER_GENERATOR: '',
        NODE_JOB: '',
        NODE_DEBUG_JOB: '',
        NODE_LOG_STATISTIC_MAT: '',
        NODE_PRODUCT_DB: '',
        NODE_INIT_DATA_WATER_SOURCE: 'true', // init data src
        NODE_INIT_LOG_WATER_SOURCE: 'true', // init log src
        NODE_PUSH_NOTIFICATIONS: '',
        NODE_PARSE_DATALOGGER: '',
        NODE_CONVERSATION_TEST: '',
        NODE_INIT_DATA_QUALITY_NMS: '', // init log chat luong nuoc nms
      },
    },
  ],
};
