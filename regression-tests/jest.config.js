module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  rootDir: '.',
  testURL: 'http://localhost/',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^shared/(.*)$': '<rootDir>/../shared/$1',
    '^!!raw-loader!\\./components/rich-text-editor/prism-theme.css$':
      '<rootDir>/__mocks__/empty.css',
  },
};
