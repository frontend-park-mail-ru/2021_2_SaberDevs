const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: path.resolve(__dirname, './public/main.js'),
  },
  output: {
    filename: '[name].bandle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: 'static/[name][ext][query]',
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './public/index.html'),
      inject: 'body',
      scriptLoading: 'blocking',
    }),
    new HTMLWebpackPlugin({
      filename: '404.html',
      template: path.resolve(__dirname, './public/404.html'),
      inject: 'body',
      scriptLoading: 'blocking',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        type: 'asset',
        generator: {
          filename: 'img/[hash][ext][query]',
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
      {
        test: /\.(js)$/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    fallback: {
      'fs': false,
    },
    alias: {
      Static: path.resolve(__dirname, 'public/static/'),
    },
  },
};
