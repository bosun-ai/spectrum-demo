module.exports = {
  rootDir: '.',
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  setupFiles: ['<rootDir>/server.js'],
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    '^shared/(.*)$': '<rootDir>/../shared/$1',
    '^src/(.*)$': '<rootDir>/../src/$1',
  },
};
