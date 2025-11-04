module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/regression-tests'],
  setupFilesAfterEnv: ['<rootDir>/regression-tests/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^shared/(.*)$': '<rootDir>/shared/$1',
  },
};
