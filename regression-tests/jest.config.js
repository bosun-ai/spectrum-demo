module.exports = {
  rootDir: '.', // paths in this config are relative to the regression-tests directory
  testEnvironment: 'jsdom',
  testURL: 'http://localhost/',
  // For Jest v22, use setupTestFrameworkScriptFile
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  // Transform with Babel 7
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/transform.js',
  },
  testMatch: ['**/*.test.js'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^shared/(.*)$': '<rootDir>/../shared/$1',
    // Stub raw-loader CSS import used by reset.css.js
    '!!raw-loader!./components/rich-text-editor/prism-theme.css':
      '<rootDir>/styleStub.js',
  },
};
