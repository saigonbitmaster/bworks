const path = require('path');
const fs = require('fs');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const envVariables = require('ra-loopback3/webpack-config/env-variables');
// const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
//dev
const webpack = require('webpack');

let config = {
  devtool: 'eval-source-map',
  devServer: {
    port: 3001,
    proxy: {
      '/api': 'http://localhost:4001',
      '/static': 'http://localhost:4001',
    },
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, X-Frame-Options, content-type, Authorization',
      'X-Frame-Options': 'sameorigin',
    },
    stats: {
      entrypoints: false,
      modules: false,
      colors: true,
    },
    hot: true,
  },
  entry: ['babel-polyfill', path.resolve(__dirname, './src/index.js')],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      /*  {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader'],
      },*/
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    envVariables,
    new HtmlWebPackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new ManifestPlugin({ serialize: () => fs.readFileSync('./public/manifest.json') }),
    // new ServiceWorkerWebpackPlugin({
    //   entry: path.join(__dirname, './src/serviceWorker.js'),
    //   excludes: ['**/.*', '**/*.map', '*.html'],
    // }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    alias: {
      'ra-loopback3': path.join(__dirname, '..', 'ra-loopback3', 'src'),
    },
  },
};

module.exports = config;
