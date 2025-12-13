module.exports = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  // Jest v24+ uses setupFilesAfterEnv; older setupTestFrameworkScriptFile is deprecated
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testMatch: ['**/*.test.js'],
  testURL: 'http://localhost/',
};
