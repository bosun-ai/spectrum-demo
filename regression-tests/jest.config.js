module.exports = {
  testEnvironment: 'jsdom',
  testURL: 'http://localhost/',
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  rootDir: '.',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^shared/(.*)$': '<rootDir>/../shared/$1',
    // Mock raw-loader CSS imports in jsdom
    '^!!raw-loader!.*$': '<rootDir>/styleMock.js',
  },
};
