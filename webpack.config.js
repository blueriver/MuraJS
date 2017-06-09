var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var env = process.env.WEBPACK_ENV;
var plugins = [];

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = 'mura.min.js';
} else {
  outputFile = 'mura.js';
}

module.exports = {
  entry: './src/mura.js',
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
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },
  plugins: plugins
};
