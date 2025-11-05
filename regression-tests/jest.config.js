// Minimal Jest config for regression tests (isolated from main)
const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname),
  testEnvironment: 'jsdom',
  setupFiles: [path.resolve(__dirname, './setupTests.js')],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^shared/(.*)$': '<rootDir>/../shared/$1',
  },
  transform: {
    '^.+\\.(js|jsx)$': require.resolve('babel-jest'),
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};
