#!/usr/bin/env python3
import os
import re
import json

# Search only .js files as per instructions
TARGET_DIRS = ["src"]
JS_EXTENSIONS = {".js"}
MAX_COMPONENTS = 15

# Regex patterns to detect React components
# Function declarations: function ComponentName(...) { return (<div/>); }
FUNC_DECL_RE = re.compile(
    r"^\s*function\s+([A-Z][A-Za-z0-9_]*)\s*\([^)]*\)\s*\{[\s\S]*?return[\s\S]*?<",
    re.MULTILINE,
)

# Arrow functions assigned to const/let: const ComponentName = (...) => { return (<div/>); } or => (<div/>)
ARROW_FUNC_RE = re.compile(
    r"^\s*(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>[\s\S]*?<",
    re.MULTILINE,
)

# Class components: class ComponentName extends React.Component or Component
CLASS_COMP_RE = re.compile(
    r"^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+(?:React\.)?Component",
    re.MULTILINE,
)

# Default export of anonymous arrow/function using filename fallback: export default () => (<div/>)
DEFAULT_ARROW_ANON_RE = re.compile(
    r"export\s+default\s*\([^)]*\)\s*=>[\s\S]*?<",
    re.MULTILINE,
)
DEFAULT_FUNC_ANON_RE = re.compile(
    r"export\s+default\s*function\s*\([^)]*\)\s*\{[\s\S]*?return[\s\S]*?<",
    re.MULTILINE,
)

# Named default export: export default ComponentName
DEFAULT_NAMED_RE = re.compile(
    r"^\s*export\s+default\s+([A-Z][A-Za-z0-9_]*)\b",
    re.MULTILINE,
)

def is_js_file(path: str) -> bool:
    _, ext = os.path.splitext(path)
    return ext in JS_EXTENSIONS

def guess_name_from_filename(path: str) -> str:
    base = os.path.basename(path)
    name = os.path.splitext(base)[0]
    # Convert kebab/snake to PascalCase as a heuristic
    parts = re.split(r"[-_]+", name)
    return "".join(p.capitalize() for p in parts if p)

def detect_components_in_source(source: str, fallback_name: str) -> set:
    names = set()
    for regex in (FUNC_DECL_RE, ARROW_FUNC_RE, CLASS_COMP_RE):
        for m in regex.finditer(source):
            names.add(m.group(1))

    # Handle default export anonymous component: use fallback name
    if DEFAULT_ARROW_ANON_RE.search(source) or DEFAULT_FUNC_ANON_RE.search(source):
        if fallback_name:
            names.add(fallback_name)

    # Handle default export of named symbol
    m = DEFAULT_NAMED_RE.search(source)
    if m:
        names.add(m.group(1))

    return names

def main():
    results = []
    seen = set()
    for root_dir in TARGET_DIRS:
        if not os.path.isdir(root_dir):
            continue
        for dirpath, _, filenames in os.walk(root_dir):
            for fname in filenames:
                path = os.path.join(dirpath, fname)
                if not is_js_file(path):
                    continue
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        source = f.read()
                except Exception:
                    continue

                fallback = guess_name_from_filename(path)
                names = detect_components_in_source(source, fallback)
                for name in names:
                    key = (name, path)
                    if key in seen:
                        continue
                    seen.add(key)
                    results.append({"name": name, "path": path})
                    if len(results) >= MAX_COMPONENTS:
                        print(json.dumps(results))
                        return
    print(json.dumps(results))

if __name__ == "__main__":
    main()
