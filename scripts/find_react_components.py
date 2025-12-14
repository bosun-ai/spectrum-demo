#!/usr/bin/env python3
import os
import re
import json
from typing import List, Dict, Tuple

# Detect React components in JS/TS files
COMPONENT_EXTS = {'.js', '.jsx', '.ts', '.tsx'}

# Regexes to identify component declarations
FUNC_COMPONENT_RE = re.compile(r"^\s*function\s+([A-Z][A-Za-z0-9_]*)\s*\(")
ARROW_COMPONENT_RE = re.compile(r"^\s*const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>")
CLASS_COMPONENT_RE = re.compile(r"^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+React\.Component")
CLASS_COMPONENT_RE2 = re.compile(r"^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+Component")

def is_source_file(path: str) -> bool:
    _, ext = os.path.splitext(path)
    return ext in COMPONENT_EXTS

def file_depth(path: str) -> int:
    # Depth: number of path segments
    return len([p for p in path.split(os.sep) if p])

def detect_components_in_file(path: str) -> List[str]:
    names: List[str] = []
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                # quick skip non-likely lines
                if '(' not in line and 'class ' not in line:
                    continue
                for regex in (FUNC_COMPONENT_RE, ARROW_COMPONENT_RE, CLASS_COMPONENT_RE, CLASS_COMPONENT_RE2):
                    m = regex.search(line)
                    if m:
                        names.append(m.group(1))
    except Exception:
        pass
    # De-duplicate while preserving order
    seen = set()
    uniq = []
    for n in names:
        if n not in seen:
            seen.add(n)
            uniq.append(n)
    return uniq

def collect_files(root: str) -> List[str]:
    files: List[str] = []
    for dirpath, dirnames, filenames in os.walk(root):
        # skip common build dirs
        base = os.path.basename(dirpath)
        if base in {'.git', 'node_modules', 'dist', 'build', 'lib', 'es', 'umd'}:
            dirnames[:] = []
            continue
        for fname in filenames:
            fp = os.path.join(dirpath, fname)
            if is_source_file(fp):
                files.append(fp)
    return files

def find_components(project_root: str) -> List[Dict[str, str]]:
    # Prefer src/ first, but include others at root level
    search_roots = []
    if os.path.isdir(os.path.join(project_root, 'src')):
        search_roots.append(os.path.join(project_root, 'src'))
    # include top-level JS files as fallback
    search_roots.append(project_root)

    all_files: List[str] = []
    for r in search_roots:
        all_files.extend(collect_files(r))

    components: List[Tuple[str, str]] = []  # (name, relpath)
    for fp in all_files:
        rel = os.path.relpath(fp, project_root)
        names = detect_components_in_file(fp)
        for n in names:
            components.append((n, rel))

    # Sort by depth descending, then by name for stability
    components.sort(key=lambda t: (file_depth(t[1]), t[0]))
    components = components[::-1]  # deepest first

    # Limit to 15
    limited = components[:15]
    return [{'name': n, 'path': p} for n, p in limited]

def main():
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    comps = find_components(project_root)
    print(json.dumps(comps))

if __name__ == '__main__':
    main()
