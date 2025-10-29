module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/regression-tests/**/*.test.js'],
  setupTestFrameworkScriptFile: '<rootDir>/regression-tests/setupTests.js',
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/regression-tests/styleMock.js',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
