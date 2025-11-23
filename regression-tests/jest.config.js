module.exports = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  roots: ['<rootDir>'],
  // Map project module aliases for non-relative imports.
  moduleNameMapper: {
    // src-based aliases
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^components/(.*)$': '<rootDir>/../src/components/$1',
    // shared alias used by button styles: shared/theme, shared/colors, etc
    '^shared/(.*)$': '<rootDir>/../shared/$1',
    // styled-components should resolve to its real package
    '^styled-components$': require.resolve('styled-components'),
    // Add mapper for !!raw-loader imports
    '^!!raw-loader!.*$': '<rootDir>/__mocks__/rawLoaderMock.js',
    // Any other aliases can be added here as needed.
  },
};
