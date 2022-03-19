const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const commonConfig = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$|tsx/,
        exclude: /node_modules/,
        loader: 'babel-loader'
        //loader: 'ts-loader'
      },
      {
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.json', '.jsx', '.tsx']
  }
};

module.exports = [
  // 1. The Main bundle
  Object.assign(
  {
    target: 'electron-main',
    entry: {main: './main.ts'}
  },
  commonConfig),
  // 2. The Renderer bundle
  Object.assign(
  {
    target: 'electron-renderer',
    entry: {renderer: './renderer.ts'},
    plugins: [
      new FriendlyErrorsWebpackPlugin(),
      // 3. The HTML file 
      // (I converted the old html file to ejs 
      // so Webpack would build here)
      new HtmlWebpackPlugin(
      { 
        filename: 'index.html', 
        template: './index.ejs'         
      })
    ]
  },
  commonConfig)
];
