// Basic Babel transform to handle ES modules in src for Jest
module.exports = {
  process(src, filename) {
    if (/node_modules/.test(filename)) return src;
    if (filename.endsWith('.js')) {
      let code = src;
      // transform dynamic import to require
      code = code.replace(/import\(([^)]+)\)/g, 'require($1)');
      // transform "import * as X from 'y';" to const X = require('y');
      code = code.replace(
        /import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s+['\"]([^'\"]+)['\"];?/g,
        'const $1 = require("$2");'
      );
      // transform default import: import X from 'y'; -> const X = require('y').default || require('y');
      code = code.replace(
        /import\s+([A-Za-z_$][\w$]*)\s+from\s+['\"]([^'\"]+)['\"];?/g,
        'const $1 = require("$2").default || require("$2");'
      );
      // transform named imports: import { A, B } from 'y'; -> const { A, B } = require('y');
      code = code.replace(
        /import\s+\{([^}]+)\}\s+from\s+['\"]([^'\"]+)['\"];?/g,
        'const {$1} = require("$2");'
      );
      // remove any remaining import/export (naive)
      code = code.replace(/export\s+default\s+/g, 'module.exports = ');
      code = code.replace(/export\s+\{[^}]+\};?/g, '');
      return code;
    }
    return src;
  },
};
