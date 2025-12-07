#!/usr/bin/env python3
import os
import re
import json

# File extensions to scan
EXTS = {".js", ".jsx", ".ts", ".tsx"}

# Simple heuristics to detect React components
# - Function declarations: function Name(props) { return (<div/>); }
# - Arrow functions: const Name = (props) => { return (<div/>); } OR implicit return
# - Class components: class Name extends React.Component / Component

FUNC_DECL_RE = re.compile(r"^\s*function\s+([A-Z][A-Za-z0-9_]*)\s*\(.*\)\s*{", re.MULTILINE)
ARROW_CONST_RE = re.compile(
    r"^\s*(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(?[^=]*\)?\s*=>",
    re.MULTILINE,
)
CLASS_RE = re.compile(
    r"^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+(?:React\.)?Component",
    re.MULTILINE,
)

# Additional indicator that the function likely returns JSX
JSX_HINT_RE = re.compile(r"<([A-Za-z][A-Za-z0-9:_-]*)(\s|>)")

def is_source_file(path: str) -> bool:
    _, ext = os.path.splitext(path)
    return ext in EXTS

def scan_file(path: str):
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    except Exception:
        return []

    components = set()

    # Quick filter: must reference React or JSX to be worth scanning further
    if "React" not in content and "import React" not in content and not JSX_HINT_RE.search(content):
        # Still may be components without explicit React import (new JSX runtimes), keep scanning
        pass

    # Class components
    for m in CLASS_RE.finditer(content):
        components.add(m.group(1))

    # Function declarations
    for m in FUNC_DECL_RE.finditer(content):
        name = m.group(1)
        # Heuristic: ensure JSX appears in function body nearby
        start = m.end()
        body_snippet = content[start:start+500]
        if JSX_HINT_RE.search(body_snippet):
            components.add(name)

    # Arrow function components
    for m in ARROW_CONST_RE.finditer(content):
        name = m.group(1)
        # Check following text for JSX
        start = m.end()
        snippet = content[start:start+500]
        if JSX_HINT_RE.search(snippet):
            components.add(name)

    # Export default anonymous arrow/function assigned to default export
    # Attempt to capture `export default function Name` or `export default class Name`
    default_func_re = re.compile(r"export\s+default\s+function\s+([A-Z][A-Za-z0-9_]*)")
    default_class_re = re.compile(r"export\s+default\s+class\s+([A-Z][A-Za-z0-9_]*)")
    for m in default_func_re.finditer(content):
        components.add(m.group(1))
    for m in default_class_re.finditer(content):
        components.add(m.group(1))

    # Named exports like `export const Name = () => <div />`
    export_arrow_re = re.compile(
        r"export\s+(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(?[^=]*\)?\s*=>"
    )
    for m in export_arrow_re.finditer(content):
        # verify JSX shortly after
        start = m.end()
        snippet = content[start:start+300]
        if JSX_HINT_RE.search(snippet):
            components.add(m.group(1))

    return sorted(components)

def main():
    results = []
    for root, dirs, files in os.walk("."):
        # Skip node_modules and flow-typed and docs by default; they are not source components
        skip_dirs = {"node_modules", ".git", "flow-typed", "docs"}
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for fname in files:
            path = os.path.join(root, fname)
            if not is_source_file(path):
                continue
            rel = os.path.relpath(path, ".")
            names = scan_file(path)
            for name in names:
                results.append({"name": name, "path": rel})
                if len(results) >= 15:
                    print(json.dumps(results))
                    return
    print(json.dumps(results))

if __name__ == "__main__":
    main()
