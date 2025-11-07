module.exports = {
  roots: ['<rootDir>/regression-tests'],
  testEnvironment: 'jsdom',
  setupFilesAfterCleanup: [],
  setupFilesAfterEnv: ['<rootDir>/regression-tests/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^shared/(.*)$': '<rootDir>/shared/$1',
  },
};
