var path = require('path');
var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var env = process.env.WEBPACK_ENV;
var plugins = [];

if (env === 'build') {
	mode = 'production';
	minimize = true;
  outputFile = 'mura.min.js';
} else {
	mode = 'development';
	minimize = false;
  outputFile = 'mura.js';
}

plugins.push(
  new webpack.IgnorePlugin(/request/)
);

/*
plugins.push(
  new BundleAnalyzerPlugin()
);
*/


module.exports = {
	mode: mode,
	optimization: {
    minimize: minimize
  },
  entry: ['babel-polyfill','./index.js'],
  devtool: 'source-map',
  output: {
    filename: outputFile,
    path: path.resolve(__dirname, 'dist'),
    library:'Mura',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    modules: [
      path.resolve('./'),
      path.resolve('./node_modules')
    ]
  },
  plugins: plugins
};
