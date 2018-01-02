var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'dist/bundle.js'
  },
  plugins: [
    new LiveReloadPlugin({})
  ]
};