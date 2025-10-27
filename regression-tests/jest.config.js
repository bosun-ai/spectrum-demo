module.exports = {
  rootDir: '.',
  // Jest 26-27 uses setupFilesAfterEnv, but older uses setupFiles - we include both to be safe
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  setupFiles: ['<rootDir>/setupTests.js'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  // Use the project .babelrc with babel-jest
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      { configFile: require('path').resolve(__dirname, '../.babelrc') },
    ],
  },
  // Make sure src is resolved in modulePaths
  modulePaths: ['<rootDir>/../src', '<rootDir>/../node_modules'],
  // Respect import from one level above
  moduleDirectories: ['node_modules', '../node_modules'],
};
