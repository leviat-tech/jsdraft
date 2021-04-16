const path = require('path');


module.exports = {
  entry: './test/main.js',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.draft\/index\.js$/,
        use: [
          {
            loader: path.resolve('loader.js'),
            options: {},
          },
        ],
      },
    ],
  },
};
