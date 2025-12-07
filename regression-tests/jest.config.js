module.exports = {
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  rootDir: '.',
  testURL: 'http://localhost/',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^shared/(.*)$': '<rootDir>/../shared/$1',
    '^!!raw-loader!.*$': '<rootDir>/styleMock.js',
  },
};
