module.exports = {
  testEnvironment: 'jsdom',
  testURL: 'http://localhost/',
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  rootDir: '.',
  moduleNameMapper: {
    'react-loadable': '<rootDir>/react-loadable.mock.js',
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^shared/(.*)$': '<rootDir>/../shared/$1',
  },
  transform: {
    '^.+\\.js$': '<rootDir>/transform-esm.js',
  },
};
