#!/usr/bin/env python3
import os
import re
import json

# Scan .js files for React components (function, class, arrow)
# Heuristics:
# - Class components: class <Name> extends React.Component or Component
# - Function components: function <Name>(...) { return (<JSX>) }
# - Arrow components: const/let <Name> = (...) => { return (<JSX>) } or => (<JSX>)
# - Also handle exported components: export default function Name ... ; export default class Name ...

JSX_PATTERN = re.compile(r"<([A-Za-z][A-Za-z0-9]*)[\s>/]", re.MULTILINE)

CLASS_COMPONENT_PATTERN = re.compile(
    r"class\s+(?P<name>[A-Za-z_][A-Za-z0-9_]*)\s+extends\s+(React\.)?Component",
    re.MULTILINE,
)

FUNCTION_COMPONENT_PATTERN = re.compile(
    r"function\s+(?P<name>[A-Za-z_][A-Za-z0-9_]*)\s*\([\s\S]*?\)\s*\{[\s\S]*?return\s*\(",
    re.MULTILINE,
)

ARROW_COMPONENT_PATTERN = re.compile(
    r"(const|let|var)\s+(?P<name>[A-Za-z_][A-Za-z0-9_]*)\s*=\s*\([\s\S]*?\)\s*=>\s*(\{|\()",
    re.MULTILINE,
)

EXPORT_DEFAULT_CLASS_PATTERN = re.compile(
    r"export\s+default\s+class\s+(?P<name>[A-Za-z_][A-Za-z0-9_]*)",
    re.MULTILINE,
)

EXPORT_DEFAULT_FUNCTION_PATTERN = re.compile(
    r"export\s+default\s+function\s+(?P<name>[A-Za-z_][A-Za-z0-9_]*)",
    re.MULTILINE,
)

def contains_jsx(source: str) -> bool:
    return bool(JSX_PATTERN.search(source))

def find_components_in_source(source: str):
    names = set()

    # Class components
    for m in CLASS_COMPONENT_PATTERN.finditer(source):
        names.add(m.group('name'))

    # Function components with explicit return JSX
    for m in FUNCTION_COMPONENT_PATTERN.finditer(source):
        # ensure file contains JSX to reduce false positives
        if contains_jsx(source):
            names.add(m.group('name'))

    # Arrow function components
    for m in ARROW_COMPONENT_PATTERN.finditer(source):
        if contains_jsx(source):
            names.add(m.group('name'))

    # Export default class/function (named)
    for m in EXPORT_DEFAULT_CLASS_PATTERN.finditer(source):
        names.add(m.group('name'))
    for m in EXPORT_DEFAULT_FUNCTION_PATTERN.finditer(source):
        if contains_jsx(source):
            names.add(m.group('name'))

    return list(names)

def scan_project(root_dir: str):
    components = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Skip some folders that are clearly not app source
        skip_dirs = {'.git', 'node_modules', 'flow-typed', 'cypress', 'docs', 'public'}
        dirnames[:] = [d for d in dirnames if d not in skip_dirs]
        for fname in filenames:
            if not fname.endswith('.js'):
                continue
            path = os.path.join(dirpath, fname)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    src = f.read()
            except Exception:
                continue
            names = find_components_in_source(src)
            for name in names:
                components.append({
                    'name': name,
                    'path': os.path.relpath(path, root_dir)
                })
                if len(components) >= 15:
                    return components
    return components

if __name__ == '__main__':
    result = scan_project('.')
    print(json.dumps(result))
