// @flow
module.exports = {
  testEnvironment: 'jsdom',
  // Jest 22 uses setupTestFrameworkScriptFile instead of setupFilesAfterEnv
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  rootDir: '.',
  testURL: 'http://localhost/',
  moduleDirectories: ['node_modules', '..'],
};
