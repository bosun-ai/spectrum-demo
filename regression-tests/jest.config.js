module.exports = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testMatch: ['**/*.test.js'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1'
  }
};
