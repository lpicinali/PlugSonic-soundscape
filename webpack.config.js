const path = require('path')

module.exports = {
  entry: ['babel-polyfill', path.resolve(__dirname, 'src/index.js')],
  output: {
    path: path.resolve(__dirname, 'public/assets/js'),
    publicPath: '/assets/js',
    filename: 'app.js',
    sourceMapFilename: '[file].map',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      src: path.resolve('./src'),
      fs: path.resolve('./src/shims/fs.js'),
      '3dti-toolkit': path.resolve('./src/shims/3dti-toolkit.js'),
    },
    extensions: ['.js', '.json'],
  },
  plugins: [],
}
