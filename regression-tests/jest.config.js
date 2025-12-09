module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/regression-tests/setupTests.js'],
  testMatch: ['**/*.test.js'],
  rootDir: '.',
};
