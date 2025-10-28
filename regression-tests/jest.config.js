module.exports = {
  testEnvironment: 'jsdom',
  rootDir: '.',
  setupFilesAfterLoad: ['<rootDir>/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
  },
};
