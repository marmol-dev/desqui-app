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
    './src/main.tsx'
  ],
  output: {
    path: 'dist',
    filename: 'index_bundle.js'
  },
  resolve: {
      modulesDirectories: ["build", "node_modules"],
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  target: 'node',
  module: {
    /*loaders: [
      {
        test: /\.js$/,
        loader: 'react-hot!babel',
        include: __dirname + '/src'
      }
    ]*/
    loaders: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'babel-loader!ts-loader' }
    ]
  },
  externals : [nodeExternals(), 'electron'],
  plugins: [HTMLWebpackPluginConfig/*, HotReloader*/],
  devServer: {
    contentBase: __dirname + '/dist',
    hot: true,
  }
};
