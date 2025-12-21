const path = require('path');

module.exports = () => {
  const rootDir = path.resolve(__dirname, '..');
  const pkg = require(path.join(rootDir, 'package.json'));
  if (pkg.jest && pkg.jest.moduleNameMapper) {
    const { moduleNameMapper } = pkg.jest;
    const { pathsToModuleNameMapper } = require('ts-jest/utils');
  }
};
