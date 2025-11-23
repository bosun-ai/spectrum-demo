#!/usr/bin/env python3
import os
import re
import json
from typing import List, Dict


JS_TS_EXTENSIONS = {'.js', '.jsx', '.ts', '.tsx'}


def is_react_file(path: str) -> bool:
    ext = os.path.splitext(path)[1]
    return ext in JS_TS_EXTENSIONS


def extract_components_from_source(source: str) -> List[str]:
    names = set()
    # Function components: function Name(props) { return (<div/>); }
    func_comp = re.findall(r"\bfunction\s+([A-Z][A-Za-z0-9_]*)\s*\([^)]*\)\s*{", source)
    for n in func_comp:
        names.add(n)

    # Arrow function components: const Name = (props) => { return (<div/>); }
    arrow_comp = re.findall(r"\b(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>\s*{", source)
    for n in arrow_comp:
        names.add(n)

    # Concise body arrow returning JSX: const Name = props => (<div/>);
    arrow_concise = re.findall(r"\b(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*[^=]*=>\s*\(", source)
    for n in arrow_concise:
        names.add(n)

    # Class components: class Name extends React.Component or Component
    class_comp = re.findall(r"\bclass\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+(?:React\.)?Component\b", source)
    for n in class_comp:
        names.add(n)

    # Default export anonymous function/class with name in filename isn't reliable; skip.

    return list(names)


def scan_project(root: str) -> List[Dict[str, str]]:
    results: List[Dict[str, str]] = []
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip node_modules and similar heavy dirs
        base = os.path.basename(dirpath)
        if base in {'.git', 'node_modules', 'flow-typed', 'cypress'}:
            dirnames[:] = []
            continue
        for fname in filenames:
            path = os.path.join(dirpath, fname)
            if not is_react_file(path):
                continue
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    src = f.read()
            except Exception:
                continue
            comps = extract_components_from_source(src)
            rel = os.path.relpath(path, root)
            for name in comps:
                results.append({'name': name, 'path': rel})
            if len(results) >= 15:
                return results[:15]
    return results[:15]


def main():
    project_root = os.getcwd()
    # Prefer src directory as primary React app location
    scan_root = os.path.join(project_root, 'src')
    if not os.path.isdir(scan_root):
        scan_root = project_root
    components = scan_project(scan_root)
    print(json.dumps(components))


if __name__ == '__main__':
    main()
