#!/usr/bin/env python3
import os
import re
import json
import sys


JS_TS_EXTENSIONS = {".js", ".jsx", ".ts", ".tsx"}


def is_source_file(filename: str) -> bool:
    _, ext = os.path.splitext(filename)
    return ext in JS_TS_EXTENSIONS


def list_source_files(root: str):
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip common directories that won't contain React source
        base = os.path.basename(dirpath)
        if base in {"node_modules", ".git", ".yarn", "flow-typed", "cypress"}:
            dirnames[:] = []
            continue
        for fname in filenames:
            if is_source_file(fname):
                yield os.path.join(dirpath, fname)


def find_components_in_content(content: str):
    components = []
    # Basic heuristics to detect React components
    # Function declarations: function ComponentName(...) { return (<div/>|React.createElement)
    func_decl = re.compile(
        r"function\s+([A-Z][A-Za-z0-9_]*)\s*\([^)]*\)\s*{[\s\S]*?return[\s\S]*?(<|React\.createElement)",
        re.MULTILINE,
    )

    # Arrow functions: const ComponentName = (...) => { return (<...)
    # or const ComponentName = props => (<...>)
    arrow_fn = re.compile(
        r"const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\|[A-Za-z_][A-Za-z0-9_]*\)?\s*=>[\s\S]*?(<|React\.createElement)",
        re.MULTILINE,
    )

    # Arrow functions with React.memo: const ComponentName = React.memo(() => (<...))
    arrow_memo = re.compile(
        r"const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*React\.memo\(\s*\([^)]*\)?\s*=>[\s\S]*?(<|React\.createElement)",
        re.MULTILINE,
    )

    # Class components: class ComponentName extends React.Component or Component
    class_comp = re.compile(
        r"class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+(React\.)?Component",
        re.MULTILINE,
    )

    # Export default function ComponentName(...) { ... }
    export_default_func = re.compile(
        r"export\s+default\s+function\s+([A-Z][A-Za-z0-9_]*)\s*\(", re.MULTILINE
    )

    # Export default class ComponentName extends React.Component
    export_default_class = re.compile(
        r"export\s+default\s+class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+(React\.)?Component",
        re.MULTILINE,
    )

    # Named exports: export const ComponentName = () => (<...>)
    export_const_arrow = re.compile(
        r"export\s+const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)?\s*=>[\s\S]*?(<|React\.createElement)",
        re.MULTILINE,
    )

    # Collect matches
    for rx in (
        func_decl,
        arrow_fn,
        arrow_memo,
        class_comp,
        export_default_func,
        export_default_class,
        export_const_arrow,
    ):
        for m in rx.finditer(content):
            name = m.group(1)
            if name:
                components.append(name)

    # Deduplicate while preserving order
    seen = set()
    unique = []
    for c in components:
        if c not in seen:
            seen.add(c)
            unique.append(c)
    return unique


def main():
    root = os.getcwd()
    results = []
    try:
        for path in list_source_files(root):
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                comps = find_components_in_content(content)
                for name in comps:
                    results.append({"name": name, "path": os.path.relpath(path, root)})
            except Exception:
                # Skip unreadable files silently to avoid debug output
                continue
    except Exception:
        pass

    # Limit to 15 components
    results = results[:15]

    # Output JSON only
    print(json.dumps(results))


if __name__ == "__main__":
    main()
