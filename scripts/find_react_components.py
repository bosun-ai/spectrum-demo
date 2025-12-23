#!/usr/bin/env python3
"""Scan the repository for React components and emit JSON results."""

import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
EXTENSIONS = {".js", ".jsx", ".ts", ".tsx"}
EXCLUDED_DIRS = {
    "node_modules",
    ".git",
    "build",
    "dist",
    "coverage",
    ".cache",
    "__pycache__",
    "android",
    "ios",
}


NODE_ANALYZER_SOURCE = r"""
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const DEFAULT_PLUGINS = [
  'jsx',
  'classProperties',
  'objectRestSpread',
  'dynamicImport',
  'decorators-legacy',
  'optionalChaining',
  'nullishCoalescingOperator',
  'exportDefaultFrom',
  'exportNamespaceFrom',
  'asyncGenerators',
  'bigInt',
  'optionalCatchBinding',
  'numericSeparator',
  'classPrivateProperties',
  'classPrivateMethods'
];

function getParserPlugins(filePath) {
  const plugins = new Set(DEFAULT_PLUGINS);
  if (/\.tsx?$/.test(filePath)) {
    plugins.add('typescript');
  } else {
    plugins.add('flow');
    plugins.add('flowComments');
  }
  return Array.from(plugins);
}

function isPascalCase(name) {
  return typeof name === 'string' && /^[A-Z]/.test(name);
}

function analyzeFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: getParserPlugins(filePath),
    });
  } catch (err) {
    return [];
  }

  const state = {
    reactAliases: new Set(),
    namedReactImports: new Map(), // local name -> imported name
    components: new Set(),
  };

  function registerReactAlias(name) {
    if (name) {
      state.reactAliases.add(name);
    }
  }

  function registerNamedReact(local, imported) {
    if (local && imported) {
      state.namedReactImports.set(local, imported);
    }
  }

  function isReactHelper(path, helperName) {
    if (!path) {
      return false;
    }
    if (path.isMemberExpression && path.isMemberExpression()) {
      const object = path.get('object');
      const property = path.get('property');
      return (
        !path.node.computed &&
        object.isIdentifier() &&
        state.reactAliases.has(object.node.name) &&
        property.isIdentifier({ name: helperName })
      );
    }
    if (path.isIdentifier && path.isIdentifier()) {
      const imported = state.namedReactImports.get(path.node.name);
      return imported === helperName;
    }
    return false;
  }

  function isReactComponentSuper(superNode) {
    if (!superNode) {
      return false;
    }
    if (superNode.type === 'MemberExpression') {
      return (
        !superNode.computed &&
        superNode.object.type === 'Identifier' &&
        state.reactAliases.has(superNode.object.name) &&
        superNode.property.type === 'Identifier' &&
        (superNode.property.name === 'Component' || superNode.property.name === 'PureComponent')
      );
    }
    if (superNode.type === 'Identifier') {
      const imported = state.namedReactImports.get(superNode.name);
      return imported === 'Component' || imported === 'PureComponent';
    }
    return false;
  }

  function expressionIsCreateElement(node) {
    if (!node || node.type !== 'CallExpression') {
      return false;
    }
    const callee = node.callee;
    if (callee.type === 'MemberExpression') {
      return (
        !callee.computed &&
        callee.object.type === 'Identifier' &&
        state.reactAliases.has(callee.object.name) &&
        callee.property.type === 'Identifier' &&
        callee.property.name === 'createElement'
      );
    }
    if (callee.type === 'Identifier') {
      const imported = state.namedReactImports.get(callee.name);
      return imported === 'createElement';
    }
    return false;
  }

  function functionHasJSX(path) {
    if (path.isArrowFunctionExpression && path.isArrowFunctionExpression()) {
      const body = path.node.body;
      if (body && body.type !== 'BlockStatement' && (body.type === 'JSXElement' || body.type === 'JSXFragment')) {
        return true;
      }
    }
    let found = false;
    path.traverse({
      JSXElement(innerPath) {
        if (innerPath.getFunctionParent() === path) {
          found = true;
          innerPath.stop();
        }
      },
      JSXFragment(innerPath) {
        if (innerPath.getFunctionParent() === path) {
          found = true;
          innerPath.stop();
        }
      },
    });
    return found;
  }

  function functionReturnsCreateElement(path) {
    if (path.isArrowFunctionExpression && path.isArrowFunctionExpression()) {
      const body = path.node.body;
      if (body && body.type !== 'BlockStatement' && expressionIsCreateElement(body)) {
        return true;
      }
    }
    let found = false;
    path.traverse({
      ReturnStatement(innerPath) {
        if (innerPath.getFunctionParent() === path && expressionIsCreateElement(innerPath.node.argument)) {
          found = true;
          innerPath.stop();
        }
      },
    });
    return found;
  }

  function functionLooksLikeComponent(path) {
    return functionHasJSX(path) || functionReturnsCreateElement(path);
  }

  function addComponent(name) {
    if (isPascalCase(name)) {
      state.components.add(name);
    }
  }

  function analyzeFunction(path, explicitName) {
    const name = explicitName || (path.node.id && path.node.id.name);
    if (!isPascalCase(name)) {
      return;
    }
    if (functionLooksLikeComponent(path)) {
      addComponent(name);
    }
  }

  function registerReactRequire(path) {
    const init = path.node.init;
    if (!init || init.type !== 'CallExpression' || init.callee.type !== 'Identifier' || init.callee.name !== 'require') {
      return false;
    }
    const firstArg = init.arguments[0];
    if (!firstArg || firstArg.type !== 'StringLiteral' || firstArg.value !== 'react') {
      return false;
    }
    const id = path.node.id;
    if (id.type === 'Identifier') {
      registerReactAlias(id.name);
      return true;
    }
    if (id.type === 'ObjectPattern') {
      id.properties.forEach(prop => {
        if (prop.type === 'ObjectProperty') {
          const local = prop.value && prop.value.type === 'Identifier' ? prop.value.name : null;
          const importedKey = prop.key && prop.key.type === 'Identifier' ? prop.key.name : null;
          registerNamedReact(local, importedKey);
        }
      });
      return true;
    }
    return false;
  }

  function registerReactDestructureFromAlias(path) {
    const init = path.node.init;
    const id = path.node.id;
    if (!init || !id || id.type !== 'ObjectPattern') {
      return false;
    }
    if (init.type === 'Identifier' && state.reactAliases.has(init.name)) {
      id.properties.forEach(prop => {
        if (prop.type === 'ObjectProperty') {
          const local = prop.value && prop.value.type === 'Identifier' ? prop.value.name : null;
          const importedKey = prop.key && prop.key.type === 'Identifier' ? prop.key.name : null;
          registerNamedReact(local, importedKey);
        }
      });
      return true;
    }
    return false;
  }

  function registerReactMemberAlias(path) {
    const init = path.node.init;
    const id = path.node.id;
    if (!init || init.type !== 'MemberExpression' || init.computed || init.object.type !== 'Identifier') {
      return false;
    }
    if (!state.reactAliases.has(init.object.name) || id.type !== 'Identifier' || init.property.type !== 'Identifier') {
      return false;
    }
    registerNamedReact(id.name, init.property.name);
    return true;
  }

  function isWrapperCall(path) {
    return (
      isReactHelper(path.get('callee'), 'memo') ||
      isReactHelper(path.get('callee'), 'forwardRef') ||
      isReactHelper(path.get('callee'), 'forwardRef') ||
      isReactHelper(path.get('callee'), 'lazy')
    );
  }

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value !== 'react') {
        return;
      }
      path.node.specifiers.forEach(spec => {
        if (spec.type === 'ImportDefaultSpecifier' || spec.type === 'ImportNamespaceSpecifier') {
          registerReactAlias(spec.local.name);
        }
        if (spec.type === 'ImportSpecifier') {
          const importedName = spec.imported && spec.imported.name;
          registerNamedReact(spec.local.name, importedName);
        }
      });
    },
    VariableDeclarator(path) {
      if (registerReactRequire(path)) {
        return;
      }
      if (registerReactDestructureFromAlias(path)) {
        return;
      }
      registerReactMemberAlias(path);

      if (path.node.id.type !== 'Identifier') {
        return;
      }
      const name = path.node.id.name;
      if (!isPascalCase(name)) {
        // even if not component, still inspect for alias registration above
        return;
      }
      const initPath = path.get('init');
      if (!initPath || initPath.node == null) {
        return;
      }
      if (initPath.isClassExpression()) {
        if (isReactComponentSuper(initPath.node.superClass)) {
          addComponent(name);
        }
        return;
      }
      if (initPath.isArrowFunctionExpression() || initPath.isFunctionExpression()) {
        if (functionLooksLikeComponent(initPath)) {
          addComponent(name);
        }
        return;
      }
      if (initPath.isCallExpression() && isWrapperCall(initPath)) {
        const args = initPath.get('arguments');
        if (args && args.length > 0) {
          const firstArg = args[0];
          if (firstArg && (firstArg.isArrowFunctionExpression() || firstArg.isFunctionExpression())) {
            if (functionLooksLikeComponent(firstArg)) {
              addComponent(name);
            }
          }
        }
      }
    },
    ClassDeclaration(path) {
      const name = path.node.id && path.node.id.name;
      if (!isPascalCase(name)) {
        return;
      }
      if (isReactComponentSuper(path.node.superClass)) {
        addComponent(name);
      }
    },
    FunctionDeclaration(path) {
      analyzeFunction(path);
    },
  });

  return Array.from(state.components);
}

function main() {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    raw += chunk;
  });
  process.stdin.on('end', () => {
    let files = [];
    try {
      files = JSON.parse(raw || '[]');
    } catch (err) {
      process.stderr.write('Invalid input to analyzer');
      process.exit(1);
    }
    const results = [];
    files.forEach(filePath => {
      try {
        const names = analyzeFile(filePath);
        names.forEach(name => {
          results.push({ name, path: filePath });
        });
      } catch (err) {
        // Skip files that cannot be analyzed
      }
    });
    process.stdout.write(JSON.stringify(results));
  });
}

main();
"""


def gather_source_files():
    files = []
    for dirpath, dirnames, filenames in os.walk(PROJECT_ROOT):
        dirnames[:] = [
            d
            for d in dirnames
            if d not in EXCLUDED_DIRS and not (d.startswith('.') and d not in {'.', '..'})
        ]
        for filename in filenames:
            path = Path(dirpath) / filename
            if path.suffix in EXTENSIONS:
                files.append(path)
    return files


def run_analyzer(file_paths):
    if not file_paths:
        return []
    with tempfile.NamedTemporaryFile('w', delete=False, suffix='.js', dir=PROJECT_ROOT) as helper:
        helper.write(NODE_ANALYZER_SOURCE)
        helper_path = helper.name
    try:
        proc = subprocess.run(
            ['node', helper_path],
            input=json.dumps([str(path) for path in file_paths]),
            text=True,
            capture_output=True,
            check=True,
            cwd=PROJECT_ROOT,
        )
    finally:
        os.unlink(helper_path)
    stdout = proc.stdout.strip()
    if not stdout:
        return []
    return json.loads(stdout)


def format_results(raw_results):
    seen = set()
    formatted = []
    for entry in raw_results:
        name = entry.get('name')
        file_path = entry.get('path')
        if not name or not file_path:
            continue
        rel_path = os.path.relpath(file_path, PROJECT_ROOT)
        rel_path = rel_path.replace('\\', '/')
        key = (name, rel_path)
        if key in seen:
            continue
        seen.add(key)
        formatted.append({'name': name, 'path': rel_path})
    formatted.sort(key=lambda item: (-item['path'].count('/'), item['path'], item['name']))
    return formatted


def main():
    files = gather_source_files()
    raw_results = run_analyzer(files)
    formatted = format_results(raw_results)
    json.dump(formatted, sys.stdout, indent=2)
    sys.stdout.write('\n')


if __name__ == '__main__':
    main()
