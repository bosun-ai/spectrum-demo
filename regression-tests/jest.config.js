module.exports = {
  testEnvironment: 'jsdom',
  // Older Jest version expects setupTestFrameworkScriptFile
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testURL: 'http://localhost/',
  testMatch: ['**/*.test.js'],
  rootDir: '.',
};
