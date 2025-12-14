#!/usr/bin/env python3
import os
import re
import json
from pathlib import Path

ROOT = Path('.')
SCAN_ROOT = ROOT / 'src'

# File extensions to consider
EXTS = {'.js', '.jsx', '.ts', '.tsx'}

# Directories to exclude
EXCLUDE_DIRS = {
    'node_modules', 'dist', 'build', 'coverage', '.git', '.github', 'cypress',
    'flow-typed', 'docs', 'public', 'scripts', 'api'
}

component_patterns = [
    # function components: function Name(...) { return (<div/>); }
    re.compile(r"^\s*function\s+([A-Z][A-Za-z0-9_]*)\s*\([^)]*\)\s*\{[\s\S]*?return\s*\(<", re.MULTILINE),
    # arrow function components: const Name = (...) => { return (<div/>); } or () => (<div/>)
    re.compile(r"^\s*(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>\s*(?:\{[\s\S]*?return\s*\(<|\(<)", re.MULTILINE),
    # class components: class Name extends React.Component or Component
    re.compile(r"^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+(?:React\.)?Component", re.MULTILINE),
    # memo/forwardRef: const Name = React.memo(...), React.forwardRef(...)
    re.compile(r"^\s*(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*React\.(?:memo|forwardRef)\(", re.MULTILINE),
]

def is_source_file(path: Path) -> bool:
    return path.suffix in EXTS

def compute_depth(path: Path) -> int:
    # Depth as number of directories under SCAN_ROOT
    try:
        rel = path.relative_to(SCAN_ROOT)
    except ValueError:
        rel = path
    return len(rel.parts) - 1  # exclude filename

def find_components_in_file(path: Path):
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        return []

    # quick filter: must reference React or contain JSX markers
    if '<' not in text and 'React' not in text:
        return []

    names = set()
    for pat in component_patterns:
        for m in pat.finditer(text):
            names.add(m.group(1))

    # Additional heuristic: default export of arrow/function without name
    # export default function Name() { ... }
    m = re.search(r"export\s+default\s+function\s+([A-Z][A-Za-z0-9_]*)\s*\(", text)
    if m:
        names.add(m.group(1))

    return sorted(names)

def should_exclude_dir(dirname: str) -> bool:
    return dirname in EXCLUDE_DIRS or dirname.startswith('.')

def scan_components(root: Path):
    results = []
    for dirpath, dirnames, filenames in os.walk(root):
        # prune excluded dirs
        dirnames[:] = [d for d in dirnames if not should_exclude_dir(d)]
        for fname in filenames:
            p = Path(dirpath) / fname
            if not is_source_file(p):
                continue
            comps = find_components_in_file(p)
            if comps:
                for name in comps:
                    results.append({
                        'name': name,
                        'path': str(p.relative_to(ROOT))
                    })
    return results

def dedupe_preserve_deepest(components):
    # If same name appears in multiple files, prefer deeper file path under SCAN_ROOT
    best = {}
    for comp in components:
        name = comp['name']
        path = Path(comp['path'])
        depth = compute_depth(path)
        prior = best.get(name)
        if not prior or compute_depth(Path(prior['path'])) < depth:
            best[name] = comp
    return list(best.values())

def main():
    root = SCAN_ROOT if SCAN_ROOT.exists() else ROOT
    comps = scan_components(root)
    comps = dedupe_preserve_deepest(comps)
    # sort deepest first; tie-break by path length then name
    comps.sort(key=lambda c: (
        -compute_depth(Path(c['path'])), -len(c['path']), c['name']
    ))
    comps = comps[:15]
    print(json.dumps({'components': comps}, ensure_ascii=False))

if __name__ == '__main__':
    main()
