#!/usr/bin/env python3
"""
Scan the repository for React components and print JSON.

- Searches .js, .jsx, .ts, .tsx files
- Detects class, function, and arrow components heuristically
- Limits results to 15 components
"""

import os
import re
import json
import sys

VALID_EXTS = {'.js', '.jsx', '.ts', '.tsx'}

# Heuristic regexes
CLASS_RE = re.compile(r'^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+(?:React\.)?Component', re.MULTILINE)
FUNCTION_RE = re.compile(r'^\s*function\s+([A-Z][A-Za-z0-9_]*)\s*\(.*\)\s*{', re.MULTILINE)
ARROW_RE = re.compile(r'^\s*(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*(?:\([^)]*\)|[A-Za-z0-9_]+)\s*=>\s*[{(]', re.MULTILINE)
JSX_HEURISTIC_RE = re.compile(r'<[A-Za-z][A-Za-z0-9]*(\s|>|/>)')
REACT_MEMO_RE = re.compile(r'^\s*(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*React\.(?:memo|forwardRef)\b', re.MULTILINE)


def is_text_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            f.read(1024)
        return True
    except Exception:
        return False


def scan_file(path):
    comps = []
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return comps

    # Class components
    for m in CLASS_RE.finditer(content):
        comps.append((m.group(1), path))
    # Function declarations that have JSX in file
    if JSX_HEURISTIC_RE.search(content):
        for m in FUNCTION_RE.finditer(content):
            comps.append((m.group(1), path))
        for m in ARROW_RE.finditer(content):
            comps.append((m.group(1), path))
    # React.memo/forwardRef
    for m in REACT_MEMO_RE.finditer(content):
        comps.append((m.group(1), path))

    # Dedup
    seen = set()
    out = []
    for name, p in comps:
        key = (name, p)
        if key not in seen:
            out.append({'name': name, 'path': os.path.relpath(p)})
            seen.add(key)
    return out


def scan_tree(root, limit=15):
    results = []
    for dirpath, dirnames, filenames in os.walk(root):
        # skip node_modules
        if 'node_modules' in dirpath.split(os.sep):
            continue
        for fname in filenames:
            _, ext = os.path.splitext(fname)
            if ext.lower() in VALID_EXTS:
                full = os.path.join(dirpath, fname)
                if not is_text_file(full):
                    continue
                found = scan_file(full)
                for item in found:
                    results.append(item)
                    if len(results) >= limit:
                        return results
    return results


def main():
    root = '.'
    if len(sys.argv) > 1:
        root = sys.argv[1]
    comps = scan_tree(root, limit=15)
    print(json.dumps(comps))


if __name__ == '__main__':
    main()
