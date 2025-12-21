module.exports = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  testURL: 'http://localhost/',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^shared/(.*)$': '<rootDir>/../shared/$1',
  },
  transform: {
    '^.+\\.js$': '<rootDir>/transform.js',
  },
};
