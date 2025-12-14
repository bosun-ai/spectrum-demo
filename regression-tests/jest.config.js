module.exports = {
  // In Jest 22, this path is resolved from CWD; use relative path
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  rootDir: 'regression-tests',
  testEnvironment: 'jsdom',
  testURL: 'http://localhost/',
  testMatch: ['**/*.test.js'],
};
