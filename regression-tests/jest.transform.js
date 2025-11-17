const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [
    [
      'env',
      {
        targets: { node: '12' },
      },
    ],
    'react',
  ],
});
