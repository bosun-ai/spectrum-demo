const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  // Ensure rootDir is the repository root when invoking with -c
  rootDir: path.resolve(__dirname, '..'),
  roots: ['<rootDir>/regression-tests'],
  testMatch: ['**/?(*.)+(test).js?(x)'],
  // Jest 22 requires setupTestFrameworkScriptFile instead of setupFilesAfterEnv
  setupTestFrameworkScriptFile: path.resolve(__dirname, 'setupTests.js'),
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
};
