// regression-tests/jest.config.js
const path = require('path');

module.exports = {
  rootDir: '..',
  setupFilesAfterEnv: ['<rootDir>/regression-tests/setupTests.js'],
  moduleDirectories: [
    'node_modules',
    path.resolve(__dirname, '../shared'),
    path.resolve(__dirname, '../src'),
    path.resolve(__dirname, '../'),
  ],
  moduleNameMapper: {
    '^shared/(.*)$': '<rootDir>/shared/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/', '/api/'],
};
