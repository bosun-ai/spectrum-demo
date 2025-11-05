#!/usr/bin/env python3
import os
import re
import json
from typing import List, Dict


EXTENSIONS = {".js", ".jsx", ".ts", ".tsx"}


def is_source_file(path: str) -> bool:
    _, ext = os.path.splitext(path)
    return ext in EXTENSIONS


def find_files(root: str) -> List[str]:
    files = []
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip node_modules and test folders for performance/noise
        skip_dirs = {"node_modules", "flow-typed", ".git"}
        dirnames[:] = [d for d in dirnames if d not in skip_dirs]
        for f in filenames:
            full = os.path.join(dirpath, f)
            if is_source_file(full):
                files.append(full)
    return files


def extract_components_from_source(source: str, filepath: str) -> List[Dict[str, str]]:
    components: List[Dict[str, str]] = []

    # Heuristics for React components
    # 1) Function declarations that return JSX
    func_decl = re.compile(r"function\s+([A-Z][A-Za-z0-9_]*)\s*\([^{]*\)\s*{", re.MULTILINE)
    # 2) Arrow functions assigned to const/let with PascalCase names
    arrow_func = re.compile(r"(const|let)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>\s*{?", re.MULTILINE)
    # 3) Class components extending React.Component or Component
    class_comp = re.compile(r"class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+(React\.)?Component", re.MULTILINE)
    # 4) Default exported anonymous arrow/function with PascalCase filename guess
    default_export_arrow = re.compile(r"export\s+default\s*\([^)]*\)\s*=>")
    default_export_func = re.compile(r"export\s+default\s*function\s*\(")

    # Helper to detect JSX presence
    has_jsx = re.search(r"<\w+|React\.createElement\(", source) is not None

    # 1) Function declarations
    for m in func_decl.finditer(source):
        name = m.group(1)
        # Ensure it looks like a component by checking body contains JSX
        # Roughly capture the function body following the declaration line
        start = m.end()
        body = source[start:start + 2000]  # sample chunk
        if re.search(r"return\s*\(|return\s*<", body) and has_jsx:
            components.append({"name": name, "path": filepath})

    # 2) Arrow functions
    for m in arrow_func.finditer(source):
        name = m.group(2)
        tail = source[m.end():m.end() + 1000]
        if has_jsx and re.search(r"=>\s*\(?<|return\s*<", tail):
            components.append({"name": name, "path": filepath})

    # 3) Class components
    for m in class_comp.finditer(source):
        name = m.group(1)
        if re.search(r"render\s*\(\)\s*{[\s\S]*return\s*<", source):
            components.append({"name": name, "path": filepath})

    # 4) Default export anonymous inferred from filename
    base = os.path.splitext(os.path.basename(filepath))[0]
    inferred = base[0].upper() + base[1:] if base else base
    if has_jsx and (default_export_arrow.search(source) or default_export_func.search(source)):
        if inferred and inferred[0].isupper():
            components.append({"name": inferred, "path": filepath})

    # Deduplicate by name within file
    seen = set()
    unique = []
    for c in components:
        key = (c["name"], c["path"]) 
        if key not in seen:
            seen.add(key)
            unique.append(c)
    return unique


def scan_project(root: str) -> List[Dict[str, str]]:
    results: List[Dict[str, str]] = []
    for f in find_files(root):
        try:
            with open(f, "r", encoding="utf-8", errors="ignore") as fh:
                src = fh.read()
            comps = extract_components_from_source(src, f)
            results.extend(comps)
        except Exception:
            # Skip unreadable files quietly
            continue
    # Limit to 15 results
    return results[:15]


def main():
    # Prefer src/ if present, else scan repo
    scan_root = "src" if os.path.isdir("src") else "."
    components = scan_project(scan_root)
    print(json.dumps(components, ensure_ascii=False))


if __name__ == "__main__":
    main()
