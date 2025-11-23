const babel = require('babel-jest');

module.exports = babel.createTransformer({
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
    'transform-dynamic-import',
    'transform-class-properties',
    ['transform-object-rest-spread', { useBuiltIns: true }],
  ],
});
