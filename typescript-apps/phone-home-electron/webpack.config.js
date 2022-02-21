const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs')

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
        extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
    }
}

const guiEntries = ['renderer.js'];

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
        //entry: guiEntries,
        entry: {renderer: './renderer.ts'},
        plugins: [
            //new CleanWebpackPlugin(['dist'], { exclude: ['main.js'] }),
            //new webpack.SourceMapDevToolPlugin({ filename: '[name].js.map' }),
            new HtmlWebpackPlugin({ filename: `index.html`, template: './index.ejs' })
          ]
    },
    commonConfig)
]