module.exports = {
  rootDir: '.', // paths in this config are relative to the regression-tests directory
  testEnvironment: 'jsdom',
  testURL: 'http://localhost/',
  // Jest v22 uses setupTestFrameworkScriptFile; keep it only
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testMatch: ['**/*.test.js'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^shared/(.*)$': '<rootDir>/../shared/$1',
    // Stub raw-loader CSS import used by reset.css.js
    '!!raw-loader!./components/rich-text-editor/prism-theme.css':
      '<rootDir>/styleStub.js',
  },
};
