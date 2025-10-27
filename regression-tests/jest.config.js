// regression-tests/jest.config.js
module.exports = {
  rootDir: '..',
  setupFilesAfterEnv: [
    '<rootDir>/regression-tests/setupTests.js',
    '<rootDir>/regression-tests/server.js',
  ],
  moduleDirectories: ['node_modules', 'shared', 'src'],
  testEnvironment: 'jsdom',
};
