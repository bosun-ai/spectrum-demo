// regression-tests/jest.config.js
module.exports = {
  rootDir: '..',
  setupFilesAfterEnv: [
    '<rootDir>/regression-tests/setupTests.js',
    // Don't add server.js as it imports ESM and breaks for now
  ],
  moduleDirectories: ['node_modules', 'shared', 'src'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/', '/api/'],
};
