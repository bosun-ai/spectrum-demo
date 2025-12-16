#!/usr/bin/env python3
import os
import json
import sys
import re

# Directories to skip (built/output folders)
SKIP_DIRS = {"build", "dist", "lib", "umd", "es", "node_modules", ".git", "cypress", "flow-typed", "docs", "public"}

# File extensions to consider
EXTENSIONS = {".js", ".jsx", ".ts", ".tsx"}

# Simple heuristics for JSX presence
JSX_TAG_RE = re.compile(r"<([A-Za-z][A-Za-z0-9_]*)[\s>/]", re.MULTILINE)

DISPLAY_NAME_RE = re.compile(r"(?:static\s+displayName\s*=\s*|\.displayName\s*=\s*)(['\"])(.*?)\1")

CLASS_EXTENDS_RE = re.compile(r"class\s+([A-Za-z_][A-Za-z0-9_]*)\s+extends\s+(?:React\.)?Component")
RENDER_METHOD_RE = re.compile(r"render\s*\([^)]*\)\s*{[\s\S]*?return[\s\S]*?<", re.MULTILINE)

FUNCTION_DECL_RE = re.compile(r"function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*{[\s\S]*?return[\s\S]*?<", re.MULTILINE)

ASSIGNMENT_ARROW_RE = re.compile(r"const\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>[\s\S]*?<", re.MULTILINE)
ASSIGNMENT_FUNC_EXPR_RE = re.compile(r"const\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*function\s*\([^)]*\)\s*{[\s\S]*?return[\s\S]*?<", re.MULTILINE)

EXPORT_DEFAULT_CLASS_RE = re.compile(r"export\s+default\s+class\s+([A-Za-z_][A-Za-z0-9_]*)")
EXPORT_DEFAULT_FUNC_RE = re.compile(r"export\s+default\s+function\s+([A-Za-z_][A-Za-z0-9_]*)")

def is_skipped_dir(path):
    parts = os.path.normpath(path).split(os.sep)
    return any(p in SKIP_DIRS or p.startswith("build-") for p in parts)

def get_component_candidates(content):
    names = set()
    # Class components
    for m in CLASS_EXTENDS_RE.finditer(content):
        names.add(m.group(1))
    # Functions that return JSX
    for m in FUNCTION_DECL_RE.finditer(content):
        names.add(m.group(1))
    for m in ASSIGNMENT_ARROW_RE.finditer(content):
        names.add(m.group(1))
    for m in ASSIGNMENT_FUNC_EXPR_RE.finditer(content):
        names.add(m.group(1))
    # Export defaults
    for m in EXPORT_DEFAULT_CLASS_RE.finditer(content):
        names.add(m.group(1))
    for m in EXPORT_DEFAULT_FUNC_RE.finditer(content):
        names.add(m.group(1))
    return list(names)

def prefer_display_name(content, name):
    # If displayName assignment exists, use it
    m = DISPLAY_NAME_RE.search(content)
    if m:
        return m.group(2)
    return name

def filename_fallback(path):
    base = os.path.basename(path)
    name, ext = os.path.splitext(base)
    # If index file, use parent directory name
    if name == "index":
        parent = os.path.basename(os.path.dirname(path))
        return parent
    return name

def scan_components(root):
    results = []
    for dirpath, dirnames, filenames in os.walk(root):
        # prune skipped dirs
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith("build-")]
        if is_skipped_dir(dirpath):
            continue
        for fname in filenames:
            ext = os.path.splitext(fname)[1]
            if ext not in EXTENSIONS:
                continue
            rel_path = os.path.relpath(os.path.join(dirpath, fname), root)
            try:
                with open(os.path.join(dirpath, fname), "r", encoding="utf-8") as f:
                    content = f.read()
            except Exception:
                continue
            # Require JSX presence
            if not JSX_TAG_RE.search(content):
                continue
            candidates = get_component_candidates(content)
            if not candidates:
                # Fallback: treat file as component by filename
                candidates = [filename_fallback(rel_path)]
            for name in candidates:
                final_name = prefer_display_name(content, name) if name else filename_fallback(rel_path)
                results.append({"name": final_name, "path": rel_path})
    return results

def depth_of_path(p):
    return p.count(os.sep)

def main():
    project_root = os.getcwd()
    # Only scan source-like directories
    roots_to_scan = [
        os.path.join(project_root, "src"),
        os.path.join(project_root, "shared"),
        os.path.join(project_root, "hyperion"),
        os.path.join(project_root, "api"),
    ]
    components = []
    for root in roots_to_scan:
        components.extend(scan_components(root))
    # Sort by deepest path first
    components.sort(key=lambda x: depth_of_path(x["path"]), reverse=True)
    # Deduplicate by (name, path)
    seen = set()
    deduped = []
    for c in components:
        key = (c["name"], c["path"]) 
        if key in seen:
            continue
        seen.add(key)
        deduped.append(c)
    # Limit to 15
    deduped = deduped[:15]
    print(json.dumps({"components": deduped}))

if __name__ == "__main__":
    main()
