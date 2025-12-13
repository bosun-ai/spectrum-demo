module.exports = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  // Using Jest v22 in this repo; use setupTestFrameworkScriptFile
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  testURL: 'http://localhost/',
};
