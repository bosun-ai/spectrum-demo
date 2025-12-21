module.exports = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  testURL: 'http://localhost/',
  moduleDirectories: ['node_modules', '<rootDir>/../node_modules'],
};
