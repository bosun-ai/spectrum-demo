const path = require('path');
module.exports = {
  testEnvironment: 'jsdom',
  setupTestFrameworkScriptFile: path.resolve(__dirname, 'setupTests.js'),
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^react-dom$': '@hot-loader/react-dom',
    '\\.(css|less|scss)$': '<rootDir>/regression-tests/styleMock.js',
    '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/regression-tests/fileMock.js',
  },
  roots: ['<rootDir>/regression-tests'],
};
