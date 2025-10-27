#!/usr/bin/env python3
import os
import re
import json
from pathlib import Path

# Directories likely to contain React source files
SEARCH_DIRS = [
    "src",
    "shared",
    "hyperion",
    "api"
]

EXTENSIONS = {".js", ".jsx", ".ts", ".tsx"}

# regexes
# Function component (named export or declaration): function MyComponent(...)
FUNC_COMPONENT = re.compile(r"^function\\s+([A-Z][A-Za-z0-9_]*)\\s*\\(", re.MULTILINE)
# Arrow function component: const MyComponent = (...) => or export const MyComponent = ...
ARROW_COMPONENT = re.compile(r"^(?:const|let|var|export\\s+const)\\s+([A-Z][A-Za-z0-9_]*)\\s*=\\s*(?:\\([^)]+\\)|[A-Za-z0-9_]+)?\\s*=>", re.MULTILINE)
# Class component: class MyComponent extends React.Component
CLASS_COMPONENT = re.compile(r"^class\\s+([A-Z][A-Za-z0-9_]*)\\s+extends\\s+[A-Za-z0-9_.]+", re.MULTILINE)

def find_react_components(search_dirs):
    components = []
    for base in search_dirs:
        if not os.path.isdir(base):
            continue
        for root, _, files in os.walk(base):
            for file in files:
                ext = Path(file).suffix
                if ext not in EXTENSIONS:
                    continue
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                except Exception:
                    continue  # skip unreadable files
                for regex in [FUNC_COMPONENT, ARROW_COMPONENT, CLASS_COMPONENT]:
                    for match in regex.finditer(content):
                        name = match.group(1)
                        components.append({"name": name, "file": file_path})
    return components

def main():
    components = find_react_components(SEARCH_DIRS)
    print(json.dumps(components, indent=2))

if __name__ == "__main__":
    main()
