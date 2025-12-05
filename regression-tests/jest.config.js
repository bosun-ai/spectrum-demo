module.exports = {
  testEnvironment: 'jsdom',
  // Jest 22 uses setupTestFrameworkScriptFile instead of setupFilesAfterEnv
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  rootDir: '.',
  // Ensure jsdom has a valid URL to avoid opaque origin issues
  testURL: 'http://localhost/',
};
