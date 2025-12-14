const path = require('path');
module.exports = {
  // Use absolute path to avoid jest 22 resolution issues
  setupTestFrameworkScriptFile: path.resolve(__dirname, 'setupTests.js'),
  testEnvironment: 'jsdom',
  testURL: 'http://localhost/',
  testMatch: ['**/regression-tests/**/*.test.js'],
};
