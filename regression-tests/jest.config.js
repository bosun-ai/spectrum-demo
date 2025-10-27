module.exports = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/../src/$1',
    '^components/(.*)': '<rootDir>/../src/components/$1',
    '^styled-components': require.resolve('styled-components'),
  },
};
