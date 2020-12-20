const path = require('path');

const HTMLWebpackplugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const filename = (ext) => isDev ? `[name].${ext}`: `[name].[contenthash].${ext}`;

  const optimization = () => {
      const configObj = {
        splitChunks: {
          chunks: 'all'
        }
      };
      if (isProd) {
        configObj.minimizer = [
          new OptimizeCssAssetWebpackPlugin(),
          new TerserWebpackPlugin()
        ];
      }
      return configObj;
  };

  const plugins = () => {
    const basePlugins = [
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
    }),
    new CopyWebpackPlugin({
      patterns:[
        {
          from:path.resolve(__dirname,'src/assets'),
          to:path.resolve(__dirname,'app'),
        }
      ]
    }),

    ];
    return basePlugins;
  }


module.exports = {
    context: path.resolve(__dirname,'src'),
    mode: 'development',
  entry: './script/index.js',
  output: {
    path: path.resolve(__dirname, 'app'),
    filename: `./script/${filename('js')}`,
    publicPath: ''
  },
    devServer: {
      historyApiFallback:true,
      contentBase: path.resolve(__dirname, 'app'),
      open:true,
      compress: true,
      port: 9000,
      hot:true,
    },
    optimization: optimization(),


  plugins:plugins(),

  devtool: isProd ? false : 'source-map',


  module:{
    rules:[
      {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ,
    {
      test: /\.s[ac]ss$/,
      use: [
              {
                loader:MiniCssExtractPlugin.loader,
                  options: {
                    publicPath:(resourcePath,context) => {
                      return path.relative(path.dirname(resourcePath),context) + '/';
                    },
                  }
              },
              'css-loader',
                'sass-loader'
              
            ],
    },
    {
        test: /\.html$/i,
        loader: 'html-loader',
      },

    {
        test: /\.(?:|gif|png|jpg|jpeg|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: `./images/${filename('[ext]')}`
          },
        }],
        },
        {
          test: /\.(?:|woff2)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: `./fonts/${filename('[ext]')}`
            },
          }],
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              'babel-loader'
            ],
            },
  






    ],
},
};
