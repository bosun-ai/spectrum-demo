module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  rootDir: '.',
  testURL: 'http://localhost/',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^shared/(.*)$': '<rootDir>/../shared/$1',
    // Stub raw-loader imports and CSS modules to silence non-JS assets
    '^!!raw-loader!.*$': '<rootDir>/__mocks__/raw-loader.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
};
