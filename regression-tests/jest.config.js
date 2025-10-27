module.exports = {
  rootDir: '.',
  // Jest v26 doesn't like arrays for transform value, so revert to string key only
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.[jt]sx?$': require.resolve('babel-jest'),
  },
  modulePaths: ['<rootDir>/../src', '<rootDir>/../node_modules'],
  moduleDirectories: ['node_modules', '../node_modules'],
};
