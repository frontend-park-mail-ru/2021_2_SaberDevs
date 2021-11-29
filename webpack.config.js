const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './public/main.js'),
  },
  output: {
    filename: '[name].bandle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      inject: 'body',
      scriptLoading: 'blocking',
    }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    fallback: {
      'fs': false,
    },
  },
};
