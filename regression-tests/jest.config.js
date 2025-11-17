module.exports = {
  rootDir: '..',
  testEnvironment: 'jsdom',
  testMatch: ['**/regression-tests/**/*.test.[jt]s?(x)'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/regression-tests/setupTests.js'],
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/regression-tests/jest.transform.js',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/regression-tests/styleMock.js',
  },
};
