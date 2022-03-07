
# Deploy

## Init System
- ENV Setting
  - NODE_ENV: development/production/...,
  - NODE_INDEX: Update index database on start the instance,
  - NODE_INIT_DATA: Enable/disable all init data,
  - NODE_INIT_CORE_DATA: Init very first data,
  - NODE_INIT_TEST_DATA: Init some test data for testing only,
  - NODE_BACKUP_TEST_DATA: Backup data for testing only,
  - NODE_RESTORE_TEST_DATA: Restore data for testing only,
  - NODE_JOB: Enable/Disable all job,
  - NODE_EMS_LOGGER: Job parse EMS csv data,
  - NODE_EMS_LOGGER_GENERATOR: Generate EMS csv for testing only,
  - NODE_DEBUG_JOB: Console log for debug job,
  - NODE_LOG_STATISTIC_MAT: Statistic material on nms system,
  - NODE_IMPORT_REF_GEO: Import geo template from https://www.gso.gov.vn/dmhc2015/,
  