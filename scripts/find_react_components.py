#!/usr/bin/env python3
import os
import re
import json
from typing import List, Dict, Tuple


JS_EXTS = {'.js', '.jsx', '.ts', '.tsx'}


def is_source_file(path: str) -> bool:
    ext = os.path.splitext(path)[1].lower()
    if ext not in JS_EXTS:
        return False
    # exclude test and snapshot files
    base = os.path.basename(path).lower()
    if base.endswith('.test' + ext) or base.endswith('.spec' + ext):
        return False
    if 'snapshots' in path:
        return False
    return True


def find_components_in_file(path: str) -> List[str]:
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception:
        return []

    names = set()

    # Heuristics to ensure it's a React file
    if not re.search(r"\bfrom\s+['\"]react['\"]", content) and not re.search(r"\brequire\(\s*['\"]react['\"]\s*\)", content):
        # Still allow files that use JSX with React 17+ automatic runtime
        if not re.search(r"<([A-Z][A-Za-z0-9_]*)", content):
            return []

    # Function declarations: function ComponentName(props) { return (<div/>); }
    for m in re.finditer(r"\bfunction\s+([A-Z][A-Za-z0-9_]*)\s*\([^)]*\)\s*{", content):
        names.add(m.group(1))

    # Exported function declarations: export default function ComponentName() {}
    for m in re.finditer(r"export\s+default\s+function\s+([A-Z][A-Za-z0-9_]*)\s*\(", content):
        names.add(m.group(1))

    # Arrow function components: const ComponentName = (props) => { return (<div/>); }
    for m in re.finditer(r"\b(const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>", content):
        names.add(m.group(2))
    # Arrow assigned to function with body using JSX without params: () => (<Foo />)
    for m in re.finditer(r"\b(const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*[^=]*=>\s*\(?<", content):
        names.add(m.group(2))

    # Class components: class ComponentName extends React.Component or extends Component
    for m in re.finditer(r"\bclass\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+([A-Za-z0-9_.]+)", content):
        base = m.group(2)
        if 'Component' in base:
            names.add(m.group(1))

    # Named exports: export const ComponentName = () => (<div />)
    for m in re.finditer(r"export\s+(const|let|var|function)\s+([A-Z][A-Za-z0-9_]*)", content):
        # if function export, name in group 2 for function case, same for const
        names.add(m.group(2))

    # Default export of identifier: export default ComponentName;
    for m in re.finditer(r"export\s+default\s+([A-Z][A-Za-z0-9_]*)\s*;", content):
        names.add(m.group(1))

    # Fallback: infer component name from filename if it appears as JSX
    filename = os.path.splitext(os.path.basename(path))[0]
    if re.match(r"[A-Z][A-Za-z0-9_]*", filename):
        if re.search(r"<%s\b" % re.escape(filename), content):
            names.add(filename)

    return sorted(names)


def walk_project(root: str) -> List[Tuple[str, List[str]]]:
    results = []
    for dirpath, dirnames, filenames in os.walk(root):
        # skip node_modules or build directories if any
        skip_dirs = {'node_modules', '.git', 'dist', 'build'}
        dirnames[:] = [d for d in dirnames if d not in skip_dirs]
        for fn in filenames:
            rel = os.path.join(dirpath, fn)
            if is_source_file(rel):
                comps = find_components_in_file(rel)
                if comps:
                    results.append((rel, comps))
    return results


def main() -> None:
    search_roots = ['src', 'shared', 'hyperion']
    components: List[Dict[str, str]] = []
    seen: set = set()
    for root in search_roots:
        if not os.path.isdir(root):
            continue
        for path, comps in walk_project(root):
            rel_path = path.replace(os.getcwd() + os.sep, '') if path.startswith(os.getcwd()) else path
            for name in comps:
                key = (name, rel_path)
                if key in seen:
                    continue
                components.append({'name': name, 'path': rel_path})
                seen.add(key)
                if len(components) >= 15:
                    break
            if len(components) >= 15:
                break
        if len(components) >= 15:
            break

    print(json.dumps(components))


if __name__ == '__main__':
    main()
