import os
import re
import json

EXTENSIONS = {".js", ".jsx", ".ts", ".tsx"}

# Regex patterns to detect React components
FUNCTION_COMPONENT_RE = re.compile(r"^\s*function\s+([A-Z][A-Za-z0-9_]*)\s*\(", re.MULTILINE)
CLASS_COMPONENT_RE = re.compile(r"^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+React\.Component", re.MULTILINE)
CLASS_COMPONENT_RE2 = re.compile(r"^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+Component", re.MULTILINE)
ARROW_COMPONENT_RE = re.compile(r"^\s*(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>", re.MULTILINE)
ARROW_COMPONENT_RE2 = re.compile(r"^\s*(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*[^=]*=>", re.MULTILINE)

def is_react_file(content: str) -> bool:
    # quick heuristic: if file imports react or uses jsx pragma
    return "from 'react'" in content or 'from "react"' in content or 'import React' in content or '<' in content and '/>' in content

def find_components_in_file(path: str) -> list:
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception:
        return []

    if not is_react_file(content):
        return []

    names = set()
    for regex in (
        FUNCTION_COMPONENT_RE,
        CLASS_COMPONENT_RE,
        CLASS_COMPONENT_RE2,
        ARROW_COMPONENT_RE,
        ARROW_COMPONENT_RE2,
    ):
        for m in regex.finditer(content):
            names.add(m.group(1))

    # Also detect default exports of named functions/classes
    default_func = re.findall(r"export\s+default\s+function\s+([A-Z][A-Za-z0-9_]*)", content)
    default_class = re.findall(r"export\s+default\s+class\s+([A-Z][A-Za-z0-9_]*)", content)
    names.update(default_func)
    names.update(default_class)

    return [{"name": n, "path": path} for n in names]

def scan_project(root: str, limit: int = 15) -> list:
    results = []
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip common non-source dirs
        rel = os.path.relpath(dirpath, root)
        if rel.startswith(('.git', 'node_modules', 'flow-typed', 'cypress', 'docs', 'public', 'docker', '.circleci', '.github', 'regression-tests')):
            continue
        for fn in filenames:
            _, ext = os.path.splitext(fn)
            if ext in EXTENSIONS:
                full = os.path.join(dirpath, fn)
                comps = find_components_in_file(full)
                for c in comps:
                    results.append({"name": c["name"], "path": os.path.relpath(c["path"], root)})
                    if len(results) >= limit:
                        return results
    return results

if __name__ == '__main__':
    components = scan_project(os.getcwd(), limit=15)
    print(json.dumps(components))
