module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: { node: 'current' },
          useBuiltIns: true,
          exclude: [
            'babel-plugin-transform-regenerator',
            'transform-async-to-generator',
          ],
        },
      ],
    ],
    plugins: [
      'babel-plugin-transform-class-properties',
      ['styled-components', { ssr: true }],
      'transform-flow-strip-types',
      'transform-object-rest-spread',
      'babel-plugin-transform-react-jsx',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-syntax-async-generators',
      'transform-async-generator-functions',
      'babel-plugin-inline-import-graphql-ast',
    ],
  };
};
