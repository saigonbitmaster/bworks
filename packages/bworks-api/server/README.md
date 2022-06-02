## Server

https://loopback.io/doc/en/lb3/Environment-specific-configuration.html#getting-values-from-environment-variables

LoopBack will always load the following configuration files, if they exist:

server/config.json.
server/config.local.json or server/config.local.js. 
server/datasources.json
server/datasources.local.json or server/datasources.local.js
server/model-config.json
server/model-config.local.json or server/model-config.local.js
server/middleware.json
server/middleware.local.json or server/middleware.local.js
server/component-config.json
server/component-config.local.json or server/component-config.local.js
Additionally, when the NODE_ENV environment variable is set, LoopBack will load configuration from:

server/config.env.json/js
server/datasources.env.json/js
server/model-config.env.json/js
server/middleware.env.json/js
server/component-config.env.json/js
where env is the value of NODE_ENV (typically “development,” “staging,” or “production”). This enables you to set up configurations for development, staging, and production environments. 

 Note:

A LoopBack application can load multiple configuration files, that can potentially conflict with each other. The value set by the file with the highest priority will always take effect. The priorities are:

Environment-specific configuration, based on the value of NODE_ENV; for example, server/config.staging.json.
Local configuration file; for example, server/config.local.json.
Default configuration file; for example, server/config.json.