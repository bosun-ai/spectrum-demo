#!/usr/bin/env python3
import os
import re
import json

# File extensions to scan
EXTENSIONS = {'.js', '.jsx', '.ts', '.tsx'}

# Basic heuristics to identify React components
FUNC_COMPONENT_RE = re.compile(r"^\s*function\s+([A-Z][A-Za-z0-9_]*)\s*\(")
ARROW_COMPONENT_RE = re.compile(r"^\s*const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(.*\)\s*=>")
CLASS_COMPONENT_RE = re.compile(r"^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+React\.Component")
CLASS_COMPONENT_RE2 = re.compile(r"^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+Component")

def is_text_file(path):
    try:
        with open(path, 'rb') as f:
            chunk = f.read(1024)
        # Heuristic: if it contains null byte, skip
        return b'\x00' not in chunk
    except Exception:
        return False

def find_components(root):
    components = []
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip common directories that are not source
        base = os.path.basename(dirpath)
        if base in {'.git', 'node_modules', 'flow-typed', 'public', 'docs', 'cypress'}:
            continue
        for fn in filenames:
            _, ext = os.path.splitext(fn)
            if ext not in EXTENSIONS:
                continue
            full_path = os.path.join(dirpath, fn)
            if not is_text_file(full_path):
                continue
            try:
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                    for line in f:
                        m = FUNC_COMPONENT_RE.search(line)
                        if m:
                            components.append({'name': m.group(1), 'path': os.path.relpath(full_path)})
                            break
                        m = ARROW_COMPONENT_RE.search(line)
                        if m:
                            components.append({'name': m.group(1), 'path': os.path.relpath(full_path)})
                            break
                        m = CLASS_COMPONENT_RE.search(line)
                        if m:
                            components.append({'name': m.group(1), 'path': os.path.relpath(full_path)})
                            break
                        m = CLASS_COMPONENT_RE2.search(line)
                        if m:
                            components.append({'name': m.group(1), 'path': os.path.relpath(full_path)})
                            break
            except Exception:
                # Ignore unreadable files
                pass
            if len(components) >= 15:
                return components[:15]
    return components[:15]

def main():
    comps = find_components('.')
    # Ensure output shape
    print(json.dumps({'components': comps}))

if __name__ == '__main__':
    main()
