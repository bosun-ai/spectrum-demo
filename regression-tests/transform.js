const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [
    [
      'env',
      {
        targets: { node: '8' },
        modules: 'commonjs',
      },
    ],
    'react',
    'flow',
  ],
  plugins: [
    'syntax-dynamic-import',
    'transform-class-properties',
    ['transform-object-rest-spread', { useBuiltIns: true }],
  ],
});
