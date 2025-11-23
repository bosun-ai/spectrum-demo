// Transform dynamic import() to require() for tests running on Node 8
module.exports = {
  process(src, filename) {
    if (filename.endsWith('.js')) {
      // crude replacement for import('module') -> require('module')
      return src.replace(/import\(([^)]+)\)/g, 'require($1)');
    }
    return src;
  },
};
