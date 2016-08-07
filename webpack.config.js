var path = require('path');
var webpack = require('webpack');

var CleanWebpackPlugin = require('clean-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

var ENV = process.env.NODE_ENV;
var IS_PRODUCTION = ENV === 'production';
var VERSION = JSON.stringify(require('./package.json').version);

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

module.exports = {

  context: root(),
  debug: true,
  devtool: 'cheap-module-eval-source-map',

  resolve: {
    extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
    // root: root('src'),
    modules: [
      'node_modules',
      root('src')
    ]
  },

  entry: {
    'app': './src/app.ts',
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts'
  },

  devServer: {
    // contentBase: './src',
    port: 9999,
    inline: false,
    historyApiFallback: true,
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },

  output: {
    path: root('dist'),
    // publicPath: '/dist/',
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'source-map'
      },
      {
        test: /\.ts$/,
        loader: 'tslint'
      }
    ],
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: /(node_modules)/
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
      }
    ]
  },

  plugins: [
    new ForkCheckerPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'polyfills'],
      minChunks: Infinity
    }),

    new webpack.DefinePlugin({
      'ENV': JSON.stringify(ENV),
      'IS_PRODUCTION': IS_PRODUCTION,
      'APP_VERSION': VERSION
    }),

    new WebpackNotifierPlugin({
      excludeWarnings: true
    }),

    new CleanWebpackPlugin(['dist'], {
      root: root(),
      verbose: false,
      dry: false
    })
  ],

  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src'
  }
};
