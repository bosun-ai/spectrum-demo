#!/usr/bin/env python3
import os
import re
import json
from typing import List, Dict, Tuple

# File extensions to scan
EXTENSIONS = {'.js', '.jsx', '.ts', '.tsx'}

# Directories to exclude (node_modules not present but be safe)
EXCLUDE_DIRS = {'.git', 'node_modules', 'flow-typed', 'docs', 'cypress', '.github'}

COMPONENT_PATTERNS = [
    # function declarations: function MyComponent(props) { return (<div/>); }
    re.compile(r"function\s+([A-Z][A-Za-z0-9_]*)\s*\([^)]*\)\s*{", re.MULTILINE),
    # class components: class MyComponent extends React.Component { ... }
    re.compile(r"class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+React\.Component", re.MULTILINE),
    re.compile(r"class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+Component", re.MULTILINE),
    # arrow function components assigned to const/let: const MyComponent = (props) => { return (<div/>); }
    re.compile(r"(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>\s*{", re.MULTILINE),
    # arrow concise body returning JSX: const MyComponent = props => (<div/>);
    re.compile(r"(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*[^=]*=>\s*\([^)]*<", re.MULTILINE),
]

# Helper to check if file likely contains JSX/React usage
JSX_HINTS = ["import React", "from 'react'", 'from "react"', '<']

def is_source_file(path: str) -> bool:
    _, ext = os.path.splitext(path)
    return ext in EXTENSIONS

def should_exclude_dir(dirname: str) -> bool:
    base = os.path.basename(dirname)
    return base in EXCLUDE_DIRS or base.startswith('.')

def scan_file(path: str) -> List[str]:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return []
    # quick filter: only consider files that have JSX/React hints to reduce false positives
    if not any(hint in content for hint in JSX_HINTS):
        return []
    names = set()
    for pat in COMPONENT_PATTERNS:
        for m in pat.finditer(content):
            names.add(m.group(1))
    # Additional heuristic: default export of a Capitalized identifier
    for m in re.finditer(r"export\s+default\s+([A-Z][A-Za-z0-9_]*)", content):
        names.add(m.group(1))
    return sorted(names)

def compute_depth(path: str) -> int:
    # Depth relative to project root
    rel = os.path.relpath(path)
    parts = rel.split(os.sep)
    return len(parts)

def find_components(root: str) -> List[Dict[str, str]]:
    results: List[Tuple[int, str, str]] = []  # (depth, name, path)
    for dirpath, dirnames, filenames in os.walk(root):
        # prune excluded dirs
        dirnames[:] = [d for d in dirnames if not should_exclude_dir(os.path.join(dirpath, d))]
        for fname in filenames:
            fpath = os.path.join(dirpath, fname)
            if not is_source_file(fpath):
                continue
            names = scan_file(fpath)
            if not names:
                continue
            relpath = os.path.relpath(fpath, root)
            depth = compute_depth(relpath)
            for name in names:
                results.append((depth, name, relpath))
    # Sort by depth descending (most deeply nested first), then by name
    results.sort(key=lambda t: (-t[0], t[1].lower()))
    # Deduplicate by (name, path)
    seen = set()
    components: List[Dict[str, str]] = []
    for _, name, rel in results:
        key = (name, rel)
        if key in seen:
            continue
        seen.add(key)
        components.append({"name": name, "path": rel})
        if len(components) >= 15:
            break
    return components

def main():
    root = os.getcwd()
    components = find_components(root)
    print(json.dumps({"components": components}))

if __name__ == '__main__':
    main()
