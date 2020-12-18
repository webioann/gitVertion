const path = require('path');

const HTMLWebpackplugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const filename = (ext) => isDev ? `[name].${ext}`: `[name].[contenthash].${ext}`;


module.exports = {
    context: path.resolve(__dirname,'src'),
    mode: 'development',
  entry: './script/index.js',
  output: {
    path: path.resolve(__dirname, 'app'),
    filename: `./script/${filename('js')}`
  },
  plugins:[
      new HTMLWebpackplugin({
          template:path.resolve(__dirname, 'src/index.html'),
          filename:'index.html',
          minify: {
              collapseWhitespace:isProd
          }
      }),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename:`./style/${filename('css')}`
      })
  ],
  module:{
    rules:[
      {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ,
  ],
},
};
