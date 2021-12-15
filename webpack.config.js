const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

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
    // https://developers.google.com/web/tools/workbox/guides/generate-service-worker/webpack
    // Do not precache images
    // exclude: [/\.(?:png|jpg|jpeg|svg)$/],

    // Define runtime caching rules.
    // runtimeCaching: [{
    //   // Match any request that ends with .png, .jpg, .jpeg or .svg.
    //   urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

    //   // Apply a cache-first strategy.
    //   handler: 'CacheFirst',

    //   options: {
    //     // Use a custom cache name.
    //     cacheName: 'images',

    //     // Only cache 10 images.
    //     expiration: {
    //       maxEntries: 10,
    //     },
    //   },
    // }],
    // importScripts: ['./public/pushEventListener.js'],
    // }),

    new CopyPlugin({
      patterns: [
        {
          from: './public/static/img/user_icon_loading.svg',
          to: 'img/',
        },
        {
          from: './public/serviceWorker.js',
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
