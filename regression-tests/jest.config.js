module.exports = {
  rootDir: '.', // paths in this config are relative to the regression-tests directory
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testMatch: ['**/*.test.js'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^shared/(.*)$': '<rootDir>/../shared/$1',
  },
};
