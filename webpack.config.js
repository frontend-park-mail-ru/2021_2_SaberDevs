const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
    // new WorkboxPlugin.GenerateSW({

    new CopyPlugin({
      patterns: [
        {
          from: './public/static/img/',
          to: 'img/',
        },
        {
          from: './public/serviceWorker.js',
          to: '.',
        },
        {
          from: './public/favicon.ico',
          to: '.',
        },
      ],
    }),
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
      filename: '[name].css',
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
          filename: 'img/[name][ext][query]',
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset',
        generator: {
          filename: 'fonts/[name][ext][query]',
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
