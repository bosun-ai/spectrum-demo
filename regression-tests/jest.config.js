module.exports = {
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  modulePaths: ['<rootDir>/../src', '<rootDir>/../node_modules'],
  moduleDirectories: ['node_modules', '../node_modules'],
};
