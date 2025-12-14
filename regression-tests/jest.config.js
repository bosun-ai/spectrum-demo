module.exports = {
  // Provide absolute-like path from project root Jest invocation
  setupTestFrameworkScriptFile: '<rootDir>/regression-tests/setupTests.js',
  testEnvironment: 'jsdom',
  testURL: 'http://localhost/',
  testMatch: ['**/regression-tests/**/*.test.js'],
};
