// Naive transformer to make Flow/ESM tolerable for Jest under Node 8
module.exports = {
  process(src, filename) {
    if (/node_modules/.test(filename)) return src;
    if (filename.endsWith('.js')) {
      let code = src;
      // strip Flow type imports and annotations
      code = code.replace(/\s*\/\/ @flow/g, '');
      code = code.replace(/:\s*\w+/g, ''); // simple type annotations like : string
      code = code.replace(/type\s+\{[\s\S]*?\}\s*=\s*[^;]+;?/g, '');
      code = code.replace(/type\s+\w+\s*=\s*[^;]+;?/g, '');
      code = code.replace(/\|\|/g, '||');
      // transform dynamic import to require
      code = code.replace(/import\(([^)]+)\)/g, 'require($1)');
      // imports
      code = code.replace(
        /import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s+['\"]([^'\"]+)['\"];?/g,
        'const $1 = require("$2");'
      );
      code = code.replace(
        /import\s+([A-Za-z_$][\w$]*)\s+from\s+['\"]([^'\"]+)['\"];?/g,
        'const $1 = require("$2").default || require("$2");'
      );
      code = code.replace(
        /import\s+\{([^}]+)\}\s+from\s+['\"]([^'\"]+)['\"];?/g,
        'const {$1} = require("$2");'
      );
      // exports
      code = code.replace(/export\s+default\s+/g, 'module.exports = ');
      code = code.replace(/export\s+\{[^}]+\};?/g, '');
      // strip Flow generic and exact object types in a naive way
      code = code.replace(/:\s*\{\|/g, ': {');
      code = code.replace(/\|\}/g, '}');
      return code;
    }
    return src;
  },
};
