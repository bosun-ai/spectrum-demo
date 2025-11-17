module.exports = {
  rootDir: '..',
  testEnvironment: 'jsdom',
  testURL: 'http://localhost/',
  testMatch: ['**/regression-tests/**/*.test.[jt]s?(x)'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  setupTestFrameworkScriptFile: '<rootDir>/regression-tests/setupTests.js',
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/regression-tests/jest.transform.js',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/regression-tests/styleMock.js',
  },
};
