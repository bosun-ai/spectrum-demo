module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/regression-tests'],
  setupFilesAfterEnv: ['<rootDir>/regression-tests/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/regression-tests/styleMock.js',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
