module.exports = {
  apps: [
    {
      name: 'bworks[staging]',
      cwd: `${process.env.HOME}/auto-deploy/bworks/packages/bworks-api`,
      script: 'server/server.js',
      restart_delay: 600000,
      watch: false,
      instance_var: 'INSTANCE_ID',
      env: {
        NODE_ENV: 'production',
        NODE_INDEX: 'true',
        NODE_INIT_DATA: '',
        NODE_JOB: 'true',
        NODE_DEBUG_JOB: 'true',
        NODE_PRODUCT_DB: 'bWorks',
      },
    },
  ],
};
