const _ = require('lodash');
const webpack = require('webpack');
const variables = {};
_.each(process.env, (val, key) => {
  if (key.indexOf('NODE_') === 0) {
    variables[key] = JSON.stringify(val);
  }
});
module.exports = new webpack.DefinePlugin({ 'process.env': variables });
