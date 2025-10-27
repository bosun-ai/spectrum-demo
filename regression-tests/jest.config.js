// regression-tests/jest.config.js
module.exports = {
  setupFilesAfterEnv: [
    '<rootDir>/../regression-tests/setupTests.js',
    '<rootDir>/../regression-tests/server.js',
  ],
  testEnvironment: 'jsdom',
};
