#!/usr/bin/env python3
import os
import re
import json
from typing import List, Dict, Tuple


EXTENSIONS = {".js", ".jsx", ".ts", ".tsx"}


def is_source_file(path: str) -> bool:
    _, ext = os.path.splitext(path)
    return ext in EXTENSIONS


def read_file_safe(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except Exception:
        return ""


def detect_components(code: str) -> List[str]:
    names = set()

    # Heuristics for React components
    # 1) Function declarations: function MyComponent(...) { return (<div/>); }
    func_decl = re.compile(r"function\s+([A-Z][A-Za-z0-9_]*)\s*\(.*?\)\s*{", re.S)

    # 2) Arrow function const MyComponent = (props) => { return (<div/>); }
    arrow_func = re.compile(
        r"const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>\s*{",
        re.S,
    )

    # 3) Arrow function concise body returning JSX: const MyComponent = () => (<Div/>)
    arrow_concise = re.compile(
        r"const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>\s*\(",
        re.S,
    )

    # 4) Class components: class MyComponent extends React.Component ... or extends Component
    class_comp = re.compile(
        r"class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+(React\.)?Component",
        re.S,
    )

    # 5) Function assigned without const (let/var)
    arrow_let_var = re.compile(
        r"(let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>",
        re.S,
    )

    # 6) Named exports of components: export function MyComponent(...) { ... }
    export_func = re.compile(r"export\s+function\s+([A-Z][A-Za-z0-9_]*)\s*\(", re.S)

    # 7) Default export of declarations: export default function MyComponent(...) { ... }
    export_default_func = re.compile(
        r"export\s+default\s+function\s+([A-Z][A-Za-z0-9_]*)\s*\(", re.S
    )

    # 8) export default class MyComponent extends React.Component
    export_default_class = re.compile(
        r"export\s+default\s+class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+(React\.)?Component",
        re.S,
    )

    # 9) React.memo assigned: const MyComponent = React.memo(() => ...)
    react_memo = re.compile(
        r"const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*React\.memo\s*\(",
        re.S,
    )

    # 10) ensure JSX presence to reduce false positives
    has_jsx = re.search(r"<[A-Z][A-Za-z0-9]*(\.|:)?[A-Za-z0-9]*", code) is not None

    for rx in [
        func_decl,
        arrow_func,
        arrow_concise,
        class_comp,
        arrow_let_var,
        export_func,
        export_default_func,
        export_default_class,
        react_memo,
    ]:
        for m in rx.finditer(code):
            # pick proper group for arrow_let_var
            name = m.group(1)
            if rx is arrow_let_var:
                name = m.group(2)
            names.add(name)

    # If names are found but no JSX, they might not be React components.
    if not has_jsx:
        # Keep class components as they don't require inline JSX necessarily
        names = {n for n in names if class_comp.search(code)}

    return sorted(names)


def scan_directory(root: str) -> List[Tuple[str, List[str]]]:
    results = []
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip node_modules and other heavy dirs
        base = os.path.basename(dirpath)
        if base in {"node_modules", ".git", ".next", "dist", "build"}:
            continue
        for fname in filenames:
            path = os.path.join(dirpath, fname)
            if not is_source_file(path):
                continue
            code = read_file_safe(path)
            if not code:
                continue
            names = detect_components(code)
            if names:
                results.append((path, names))
    return results


def main():
    root = os.getcwd()
    findings = scan_directory(root)
    components: List[Dict[str, str]] = []
    for path, names in findings:
        for name in names:
            components.append({"name": name, "path": os.path.relpath(path, root)})
            if len(components) >= 15:
                break
        if len(components) >= 15:
            break

    print(json.dumps(components, ensure_ascii=False))


if __name__ == "__main__":
    main()
