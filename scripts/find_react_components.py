#!/usr/bin/env python3
import os
import re
import json
from typing import List, Dict

# Scan .js files for React components (Flow-typed allowed). Exclude common folders
EXCLUDE_DIRS = {
    'node_modules', 'dist', 'build', '.git', 'cypress', 'docs', 'flow-typed', 'regression-tests'
}

# Simple heuristics to identify React components
FUNC_COMPONENT_RE = re.compile(r"^\s*function\s+([A-Z][A-Za-z0-9_]*)\s*\(.*\)\s*{", re.MULTILINE)
ARROW_COMPONENT_RE = re.compile(r"^\s*const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(?.*\)?\s*=>\s*{", re.MULTILINE)
ARROW_COMPONENT_IMPLICIT_RE = re.compile(r"^\s*const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(?.*\)?\s*=>\s*\(?\s*<", re.MULTILINE)
CLASS_COMPONENT_RE = re.compile(r"^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+React\.Component", re.MULTILINE)
CLASS_COMPONENT_RE2 = re.compile(r"^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+Component", re.MULTILINE)

def is_js_file(path: str) -> bool:
    return path.endswith('.js')

def should_exclude(dirpath: str) -> bool:
    parts = dirpath.split(os.sep)
    return any(p in EXCLUDE_DIRS for p in parts)

def find_components_in_file(path: str) -> List[str]:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return []

    names = set()

    for regex in (
        FUNC_COMPONENT_RE,
        ARROW_COMPONENT_RE,
        ARROW_COMPONENT_IMPLICIT_RE,
        CLASS_COMPONENT_RE,
        CLASS_COMPONENT_RE2,
    ):
        for m in regex.finditer(content):
            names.add(m.group(1))

    # Heuristic: default export of capitalized identifier
    for m in re.finditer(r"export\s+default\s+([A-Z][A-Za-z0-9_]*)", content):
        names.add(m.group(1))

    return list(names)

def scan_project(root: str) -> List[Dict[str, str]]:
    results: List[Dict[str, str]] = []
    seen = set()
    for dirpath, dirnames, filenames in os.walk(root):
        # mutate dirnames to skip excluded dirs
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        if should_exclude(dirpath):
            continue
        for fname in filenames:
            fpath = os.path.join(dirpath, fname)
            if not is_js_file(fpath):
                continue
            rel = os.path.relpath(fpath, root)
            comps = find_components_in_file(fpath)
            for name in comps:
                key = (name, rel)
                if key in seen:
                    continue
                seen.add(key)
                results.append({"name": name, "path": rel})
                if len(results) >= 15:
                    return results
    return results

def main():
    root = os.getcwd()
    components = scan_project(root)
    print(json.dumps(components))

if __name__ == '__main__':
    main()
