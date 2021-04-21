const path = require('path');


module.exports = {
  entry: './test/main.js',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.draft\/index\.json$/,
        type: 'javascript/auto',
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
