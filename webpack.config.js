const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const UnusedFilesWebpackPlugin = require('unused-files-webpack-plugin')['default'];
const ExtractCSSChunks = require('extract-css-chunks-webpack-plugin');

const ExtractModules = new ExtractCSSChunks('stylesheets/[name]-modules.css');
const ExtractGlobal = new ExtractCSSChunks('stylesheets/[name]-global.css');
const ExtractVendor = new ExtractCSSChunks('stylesheets/[name]-vendor.css');

const isDevelopment = process.env.NODE_ENV !== 'production';
const buildPath = path.resolve('public');
const appPath = path.resolve('src', 'app.js');
const srcPath = path.resolve('src');

const webpackConfig = {
  stats: {
    warning: false,
  },
  entry: {
    app: appPath,
    vendor: ['react', 'react-dom', 'react-router-dom'],
  },
  output: {
    publicPath: '/assets/',
    path: buildPath,
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.json?$/,
        loaders: ['json-loader'],
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loaders: ['file-loader'],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ExtractVendor.extract({
          use: 'css-loader!postcss-loader',
        }),
      },
      {
        test: /(global-styles\.s?css)$/,
        exclude: /node_modules/,
        use: ExtractGlobal.extract({
          use: 'css-loader!postcss-loader',
        }),
      },
      {
        test: /\.s?css$/,
        exclude: [/(global-styles\.s?css)$/, /node_modules/],
        use: ExtractModules.extract({
          use: 'css-loader?modules&importLoaders=1&localIdentName=[name]-[local]-[hash:base64]!postcss-loader',
        }),
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./index.tpl.html'),
      chunksSortMode: 'dependency',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CaseSensitivePathsPlugin(),
    ExtractGlobal,
    ExtractModules,
    ExtractVendor,
  ],
  resolve: {
    modules: [
      path.resolve(srcPath),
      'node_modules',
    ],
  },
};

if (isDevelopment) {
  webpackConfig.plugins = webpackConfig.plugins.concat([
    new UnusedFilesWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: JSON.stringify('true'),
    }),
  ]);
} else {
  webpackConfig.output.filename = '[name].bundle.[chunkhash].js';
  webpackConfig.output.chunkFilename = '[name].bundle.[chunkhash].js';
  webpackConfig.plugins = webpackConfig.plugins.concat([
    new CleanWebpackPlugin([buildPath]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      __DEV__: '""',
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ]);
}

module.exports = webpackConfig;
