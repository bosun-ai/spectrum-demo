// Separate Jest config for regression tests
const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  roots: [path.resolve(__dirname, './')],
  setupFilesAfterEnv: [path.resolve(__dirname, './setupTests.js')],
  moduleNameMapper: {
    '^src/(.*)$': path.resolve(__dirname, '../src/$1'),
    '^shared/(.*)$': path.resolve(__dirname, '../shared/$1'),
  },
};
