var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/index.html',
  hash: true,
  filename: 'index.html',
  inject: 'body'
});
var HotReloader = new webpack.HotModuleReplacementPlugin();

module.exports = {
  devtool: 'source-map',
  entry: [
    //'webpack-dev-server/client?http://localhost:8080',
    //'webpack/hot/dev-server',
    './src/main.js'
  ],
  output: {
    path: 'dist',
    filename: 'index_bundle.js'
  },
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'react-hot!babel',
        include: __dirname + '/src'
      }
    ]
  },
  externals : [nodeExternals(), 'electron'],
  plugins: [HTMLWebpackPluginConfig/*, HotReloader*/],
  devServer: {
    contentBase: __dirname + '/dist',
    hot: true,
  }
};
