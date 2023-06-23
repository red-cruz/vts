const path = require('path');

module.exports = {
  entry: {
    config: './src/config.js',
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  watch: true,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
};
