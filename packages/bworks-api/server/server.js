'use strict';
/* eslint-disable no-console */

const path = require('path');
const loopback = require('loopback');
const boot = require('loopback-boot');
const sortedUniq = require('lodash/sortedUniq');
const commonServer = require('ra-loopback3/server/server');
const dataConfig = require('./data-config');
const dotenv = require('dotenv');


var app = (module.exports = loopback());
require('loopback-datatype-objectid')(app);
//to use .env in other source files
dotenv.config();
// check env
let envs = Object.keys(process.env).filter(key => /(^NODE)|(^DEBUG)|(^S3)/.test(key) && !!process.env[key]);
envs = sortedUniq(envs);
process.stdout.write('\x1B[2J');
console.log('================ Start Api with Environments =================');
console.log(`NODE VERSION: ${process.version}`);
console.log('----------------------');
console.log(`PORT: ${process.env.PORT || '<default>'}`);
envs.map(env => console.log(`${env}: "${process.env[env]}"`));
console.log('------------------------ Starting... -------------------------');

// init local app data config
app.dataConfig = dataConfig;
app.dirs = {};
app.dirs.root = path.resolve(__dirname, '..');
console.log('root dir:', app.dirs.root);
// init common data config
commonServer.commonConfig(app);

app.start = function() {
  // set view engine for invoice template
  app.set('view engine', 'hbs');

  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, `${explorerPath}/<ModelName>`);
    }
    console.log('========================= Start OK ===========================');
    app.bootCompleted = true;
  });
};

// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;
  // start the server if `$ node server.js`
  if (require.main === module) app.start();
});
