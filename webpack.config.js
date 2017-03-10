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
  DLL: 'build-dll',
};
const outputPath = path.resolve(__dirname, 'dist');
const publicPath = '/static/';

const baseConfig = {
  entry: {
    app: './app/index.js',
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'happypack/loader?id=js',
        include: [/app/, /node_modules/],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
      // __ROOT_PATH__: JSON.stringify(ROOT_PATH),
      'process.env.NODE_ENV': target === TARGET.DEV ? '"dev"' : '"production"',
    }),
    new HappyPackPlugin({
      id: 'js',
      loaders: [{
        path: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-2'],
        },
      }],
    }),
  ],
};

module.exports = function(env) {
  if (target === TARGET.DEV) {
    return webpackMerge.smart(baseConfig, {
      entry: {
        app: [
          './app/index.js',
        ],
      },

      output: {
        filename: 'app.js',
        publicPath: publicPath,
        sourceMapFilename: '[name].js.map',
      },

      devtool: 'source-map',

      plugins: [
        new webpack.HotModuleReplacementPlugin(),
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
        chunkFilename: "[name].app.[chunkhash].js",
      },
      module: {
        loaders: [
          // sadly we cannot use happypack here as ExtractTextPlugin is not supported https://github.com/amireh/happypack/issues/12
          // { test: /\.scss$/, loader: ExtractTextPlugin.extract('css-loader!postcss-loader!sass-loader'), },
          { test: /\.hbs/, loader: 'handlebars-template-loader', },
        ],
      },
      devtool: 'true', // this is to patch ParallelUglifyPlugin as it expects a `devtool` option explicitly but doesn't care what it is
      plugins: [
        // new webpack.SourceMapDevToolPlugin('[file].map', '//# sourceMappingURL=' + ROOT_DOMAIN + '/assets/[url]'),
        // new ExtractTextPlugin('app.[contenthash].css'),
        new ParallelUglifyPlugin({
          uglifyJS: {
            compress: {
              warnings: false
            }
          }
        }),
        new CleanWebpackPlugin([outputPath], {
          verbose: true,
          dry: false,
        }),
        new HtmlWebpackPlugin({
          hash: false,
          filename: './index.html',
          template: './index.hbs',
          inject: 'body',
          chunksSortMode: 'dependency',
        }),
      ].concat(env.bundleStats ? [new BundleAnalyzerPlugin()] : []),
      bail: true,
      recordsPath: path.resolve(__dirname, '.webpack-path-record'),
    });
  }


  else
    return baseConfig;
};
