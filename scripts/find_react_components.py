#!/usr/bin/env python3
import os
import re
import json
from typing import List, Dict

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# File extensions to scan
EXTENSIONS = {'.js', '.jsx', '.ts', '.tsx'}

# Regex patterns to detect React components
RE_CLASS_COMPONENT = re.compile(r'class\s+(?P<name>[A-Z][A-Za-z0-9_]*)\s+extends\s+React\.Component')
RE_CLASS_COMPONENT_NO_PREFIX = re.compile(r'class\s+(?P<name>[A-Z][A-Za-z0-9_]*)\s+extends\s+Component')
RE_FUNCTION_COMPONENT = re.compile(r'function\s+(?P<name>[A-Z][A-Za-z0-9_]*)\s*\(')
RE_ARROW_COMPONENT = re.compile(r'const\s+(?P<name>[A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>')
RE_ARROW_COMPONENT_NO_PARENS = re.compile(r'const\s+(?P<name>[A-Z][A-Za-z0-9_]*)\s*=\s*[A-Za-z_$][A-Za-z0-9_$]*\s*=>')
RE_EXPORT_DEFAULT_NAMED = re.compile(r'export\s+default\s+class\s+(?P<name>[A-Z][A-Za-z0-9_]*)')
RE_EXPORT_DEFAULT_FUNC = re.compile(r'export\s+default\s+function\s+(?P<name>[A-Z][A-Za-z0-9_]*)')

# Heuristic: JSX presence indicates a component if paired with a capitalized function/const
RE_JSX_TAG = re.compile(r'<[A-Za-z][^>]*>')

def is_source_file(path: str) -> bool:
    _, ext = os.path.splitext(path)
    return ext in EXTENSIONS

def scan_file(path: str) -> List[str]:
    names = []
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception:
        return names

    # Quick filter: if no React import or JSX, still try but prefer matches
    has_react_import = ('from "react"' in content) or ("from 'react'" in content) or ('require("react")' in content) or ("require('react')" in content)

    # Class components
    for m in RE_CLASS_COMPONENT.finditer(content):
        names.append(m.group('name'))
    for m in RE_CLASS_COMPONENT_NO_PREFIX.finditer(content):
        names.append(m.group('name'))

    # Function components
    for m in RE_FUNCTION_COMPONENT.finditer(content):
        # Heuristic: ensure it likely returns JSX
        func_name = m.group('name')
        if has_react_import or RE_JSX_TAG.search(content):
            names.append(func_name)

    # Arrow function components
    for m in RE_ARROW_COMPONENT.finditer(content):
        if has_react_import or RE_JSX_TAG.search(content):
            names.append(m.group('name'))
    for m in RE_ARROW_COMPONENT_NO_PARENS.finditer(content):
        if has_react_import or RE_JSX_TAG.search(content):
            names.append(m.group('name'))

    # Default exports of classes/functions
    for m in RE_EXPORT_DEFAULT_NAMED.finditer(content):
        names.append(m.group('name'))
    for m in RE_EXPORT_DEFAULT_FUNC.finditer(content):
        names.append(m.group('name'))

    # Deduplicate while preserving order
    seen = set()
    unique = []
    for n in names:
        if n not in seen:
            seen.add(n)
            unique.append(n)
    return unique

def scan_directory(start_dir: str, limit: int = 15) -> List[Dict[str, str]]:
    results: List[Dict[str, str]] = []
    for root, dirs, files in os.walk(start_dir):
        # Skip node_modules and tests where applicable
        skip_dirs = {"node_modules", "flow-typed", ".git"}
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for fname in files:
            path = os.path.join(root, fname)
            if not is_source_file(path):
                continue
            names = scan_file(path)
            for name in names:
                results.append({"name": name, "path": os.path.relpath(path, ROOT_DIR)})
                if len(results) >= limit:
                    return results
    return results

def main():
    # Prefer scanning src/ directory for React components
    src_path = os.path.join(ROOT_DIR, 'src')
    start_dir = src_path if os.path.isdir(src_path) else ROOT_DIR
    components = scan_directory(start_dir, limit=15)
    print(json.dumps(components))

if __name__ == '__main__':
    main()
