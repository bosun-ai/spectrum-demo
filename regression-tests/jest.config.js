module.exports = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testMatch: ['**/*.test.js'],
  testURL: 'http://localhost/',
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/transform.js',
  },
};
