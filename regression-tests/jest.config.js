module.exports = {
  root: false,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/regression-tests/setupTests.js'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
