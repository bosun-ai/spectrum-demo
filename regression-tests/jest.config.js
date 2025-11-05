module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/regression-tests'],
  setupTestFrameworkScriptFile: '<rootDir>/regression-tests/setupTests.js',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
};
