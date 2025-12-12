module.exports = {
  rootDir: '.', // paths in this config are relative to the regression-tests directory
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
};
