// regression-tests/jest.config.js
module.exports = {
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js', '<rootDir>/server.js'],
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js', 'jsx'],
};
