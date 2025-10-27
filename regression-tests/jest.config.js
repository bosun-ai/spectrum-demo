module.exports = {
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.[jt]sx?$': [require.resolve('babel-jest'), { rootMode: 'upward' }],
  },
  modulePaths: ['<rootDir>/../src', '<rootDir>/../node_modules'],
  moduleDirectories: ['node_modules', '../node_modules'],
};
