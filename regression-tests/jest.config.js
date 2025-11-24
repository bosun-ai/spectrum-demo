module.exports = {
  testEnvironment: 'jsdom',
  // Jest v22 uses setupTestFrameworkScriptFile
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  rootDir: '.',
  // Ensure jsdom has a non-opaque origin to allow localStorage
  testURL: 'http://localhost/',
};
