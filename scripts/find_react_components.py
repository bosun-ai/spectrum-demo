#!/usr/bin/env python3
import os
import re
import json
import sys

# Minimal scanning strategy per provided context:
# - Limit traversal to src/ and shared/
# - Scan only .js files

ROOTS = ["src", "shared"]
MAX_COMPONENTS = 15

# Regex patterns to detect React components
CLASS_COMPONENT_RE = re.compile(r"class\s+(\w+)\s+extends\s+React\.Component")
FUNC_COMPONENT_RE = re.compile(r"function\s+(\w+)\s*\([^)]*\)\s*{[\s\S]*?return[\s\S]*?<\w+", re.MULTILINE)
ARROW_COMPONENT_RE = re.compile(r"const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{[\s\S]*?return[\s\S]*?<\w+", re.MULTILINE)
ARROW_IMPLICIT_RE = re.compile(r"const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*<\w+", re.MULTILINE)

def is_js_file(path: str) -> bool:
    return path.endswith(".js")

def scan_file(path: str):
    comps = []
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception:
        return comps

    # Quick gate: check for React-like imports/usages
    if 'react' not in content.lower() and '<' not in content:
        return comps

    # Collect names from patterns
    for regex in (CLASS_COMPONENT_RE, FUNC_COMPONENT_RE, ARROW_COMPONENT_RE, ARROW_IMPLICIT_RE):
        for m in regex.finditer(content):
            name = m.group(1)
            if name and name not in comps:
                comps.append(name)

    # Also look for default export of a named identifier which might be a component
    for m in re.finditer(r"export\s+default\s+(\w+)", content):
        name = m.group(1)
        if name and name not in comps:
            comps.append(name)

    return comps

def main():
    results = []
    for root in ROOTS:
        if not os.path.isdir(root):
            continue
        for dirpath, dirnames, filenames in os.walk(root):
            # Skip flow-typed and node_modules-like dirs if present
            base = os.path.basename(dirpath)
            if base in ("flow-typed", "node_modules", "dist", "build"):
                continue
            for fn in filenames:
                full = os.path.join(dirpath, fn)
                if not is_js_file(full):
                    continue
                names = scan_file(full)
                if names:
                    for n in names:
                        results.append({"name": n, "path": full})
                        if len(results) >= MAX_COMPONENTS:
                            print(json.dumps(results))
                            return
    print(json.dumps(results))

if __name__ == "__main__":
    main()
