// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  target: 'webworker',
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  resolve: {
    fallback: {
      fs: false,
    },
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  performance: {
    hints: false,
  },
};