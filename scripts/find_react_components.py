#!/usr/bin/env python3
import os
import re
import json

# Directories to skip (build outputs)
SKIP_DIR_NAMES = {"build", "build-src", "build-api", "build-hyperion"}

# File extensions to scan
EXTENSIONS = {".js"}

# Regex patterns for detecting React components
# Class components: class ComponentName extends React.Component or Component
CLASS_COMPONENT_RE = re.compile(r"class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+React\.(Pure)?Component|class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+(Pure)?Component")

# Function components: function ComponentName(...) { return (<JSX> or React.createElement) }
FUNCTION_DECL_RE = re.compile(r"function\s+([A-Z][A-Za-z0-9_]*)\s*\(")

# Arrow function components: const ComponentName = (props) => { return <...> } or (...) => (<...>)
ARROW_DECL_RE = re.compile(r"const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(?[A-Za-z0-9_,\s]*\)?\s*=>")

# Heuristic to check if a function body contains JSX or createElement
JSX_RE = re.compile(r"<\s*[A-Z][A-Za-z0-9]*")
CREATE_ELEMENT_RE = re.compile(r"React\.createElement\s*\(")


def should_skip_dir(dirpath: str) -> bool:
    base = os.path.basename(dirpath)
    if base in SKIP_DIR_NAMES:
        return True
    # Also skip any top-level or nested './build' dir
    return base == "build"


def is_js_file(path: str) -> bool:
    return os.path.splitext(path)[1] in EXTENSIONS


def find_components_in_file(path: str):
    components = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception:
        return components

    # Detect class components
    for match in CLASS_COMPONENT_RE.finditer(content):
        name = match.group(1) or match.group(3)
        if name:
            components.append(name)

    # Detect function declarations with JSX
    for match in FUNCTION_DECL_RE.finditer(content):
        name = match.group(1)
        # crude slice around function to check JSX presence
        # limit search window to reduce false positives
        start = match.start()
        window = content[start : start + 2000]
        if JSX_RE.search(window) or CREATE_ELEMENT_RE.search(window):
            components.append(name)

    # Detect arrow function components
    for match in ARROW_DECL_RE.finditer(content):
        name = match.group(1)
        start = match.start()
        window = content[start : start + 2000]
        if JSX_RE.search(window) or CREATE_ELEMENT_RE.search(window):
            components.append(name)

    # Deduplicate while preserving order
    seen = set()
    unique = []
    for n in components:
        if n not in seen:
            seen.add(n)
            unique.append(n)
    return unique


def main():
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    results = []
    for dirpath, dirnames, filenames in os.walk(project_root):
        # Skip build directories
        dirnames[:] = [d for d in dirnames if not should_skip_dir(os.path.join(dirpath, d))]

        for filename in filenames:
            if not is_js_file(filename):
                continue
            full_path = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(full_path, project_root)
            comps = find_components_in_file(full_path)
            for comp in comps:
                results.append({"name": comp, "path": rel_path})
                if len(results) >= 15:
                    print(json.dumps(results))
                    return

    print(json.dumps(results))


if __name__ == "__main__":
    main()
