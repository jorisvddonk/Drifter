const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

var plugins = [
  new HtmlWebpackPlugin({
    template: 'index.html',
    inject: 'head'
  })
];
if (
  process.env.NODE_ENV === 'production' ||
  process.env.npm_lifecycle_event === 'webpack'
) {
  plugins.unshift(new UglifyJsPlugin({}));
}

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve('./dist/'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      }
    ]
  },
  plugins: plugins
};
