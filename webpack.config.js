const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

/** plugins **/
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPackPlugin = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

/** constants **/
const target = process.env.npm_lifecycle_event;
const TARGET = {
  DEV: 'start',
  PRODUCTION: 'build',
};
const outputPath = path.resolve(__dirname, 'dist');
const publicPath = '/';

const baseConfig = {
  entry: {
    app: './app/index.js',
  },

  output: {
    path: outputPath,
    publicPath: publicPath,
    filename: '[name].[contenthash].js',
    // chunkFilename: "[name].app.[hash].js",
  },

  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'happypack/loader?id=js', include: [/app/, /node_modules/] },
      { test: /\.hbs/, loader: 'handlebars-template-loader' },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            use: 'css-loader!postcss-loader!sass-loader'
        })
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('app.[contenthash].css'),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
      'process.env.NODE_ENV': target === TARGET.DEV ? '"dev"' : '"production"',
    }),
    new HappyPackPlugin({
      id: 'js',
      loaders: [{
        path: 'babel-loader',
        query: {
          "sourceMaps": true,
          "presets": [
            ["es2015", { "loose":true }],
            "stage-2",
            "react",
          ],
          "plugins": [
            ["transform-decorators-legacy"],
          ]
        }
      }],
    }),
    new CleanWebpackPlugin([outputPath], {
      verbose: true,
      dry: false
    }),
    new CopyWebpackPlugin([
      {
        from: './assets',
        to: path.resolve(outputPath, 'assets'),
      },
    ], {}),
    new CopyWebpackPlugin([
      {
        from: './manifest.json',
        to: outputPath,
      },
    ], {}),
    new HtmlWebpackPlugin({
      hash: false,
      filename: './index.html',
      template: './index.hbs',
      inject: 'body',
      chunksSortMode: 'dependency',
    }),
  ],
};

module.exports = function(env) {
  if (target === TARGET.DEV) {
    return webpackMerge.smart(baseConfig, {
      output: {
        path: outputPath,
        publicPath: publicPath,
        filename: '[name].[chunkhash].js',
        chunkFilename: "[name].app.[chunkhash].js",
      },
      watch: true,
      devtool: 'source-map',
      plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
      ],
    });
  }

  else if (target === TARGET.PRODUCTION) {
    return webpackMerge.smart(baseConfig, {
      output: {
        path: outputPath,
        publicPath: publicPath,
        filename: '[name].[chunkhash].js',
      },
      devtool: 'true', // this is to patch ParallelUglifyPlugin as it expects a `devtool` option explicitly but doesn't care what it is
      plugins: [
        new ParallelUglifyPlugin({
          uglifyJS: {
            compress: {
              warnings: false
            }
          }
        }),
      ].concat(env.bundleStats ? [new BundleAnalyzerPlugin()] : []),
      bail: true,
    });
  }

  else
    return baseConfig;
};
