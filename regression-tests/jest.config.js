const path = require('path');
module.exports = {
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: path.resolve(__dirname, './setupTests.js'),
  testMatch: ['**/*.test.js'],
  rootDir: '.',
};
