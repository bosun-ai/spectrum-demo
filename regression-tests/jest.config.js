module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  rootDir: '.',
  testURL: 'http://localhost/',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^shared/(.*)$': '<rootDir>/../shared/$1',
  },
};
