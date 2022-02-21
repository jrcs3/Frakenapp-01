const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.json']
  }
};

module.exports = [
  Object.assign(
  {
    target: 'electron-main',
    entry: {main: './main.ts'}
  },
  commonConfig),
  Object.assign(
  {
    target: 'electron-renderer',
    entry: {renderer: './renderer.ts'},
    plugins: [
      new HtmlWebpackPlugin(
      { 
        filename: `index.html`, 
        template: './index.ejs'         
      })
    ]
  },
  commonConfig)
];
