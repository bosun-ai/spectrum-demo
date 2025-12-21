#!/usr/bin/env python3
"""Scan the repository for React components and emit JSON results."""

from __future__ import annotations

import json
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Optional, Tuple


RE_COMPONENT_EXT = re.compile(r"\.(js|jsx|ts|tsx)$", re.IGNORECASE)


FUNCTION_COMPONENT_RE = re.compile(
    r"^\s*(?:export\s+)?function\s+([A-Z][A-Za-z0-9_]*)\s*(?:\(|<)", re.MULTILINE
)


ARROW_COMPONENT_RE = re.compile(
    r"^\s*(?:export\s+)?(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\((?:[^)]+|)\)\s*=>",
    re.MULTILINE,
)


ARROW_COMPONENT_SIMPLE_RE = re.compile(
    r"^\s*(?:export\s+)?(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*[^=]*=>",
    re.MULTILINE,
)


CLASS_COMPONENT_RE = re.compile(
    r"^\s*(?:export\s+)?class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+React\.Component",
    re.MULTILINE,
)


CLASS_COMPONENT_SHORT_RE = re.compile(
    r"^\s*(?:export\s+)?class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+Component",
    re.MULTILINE,
)


DISPLAY_NAME_RE = re.compile(
    r"^\s*([A-Za-z0-9_.]+)\.displayName\s*=\s*['\"]([A-Za-z0-9_]+)['\"]",
    re.MULTILINE,
)


JSX_RETURN_RE = re.compile(r"return\s*\(.*?<", re.DOTALL)


IGNORED_DIRS = {
    "node_modules",
    "flow-typed",
    ".git",
    "cypress",
    "docs",
    "public",
    "docker",
    "api",
    "shared",
    "scripts",
}


SCAN_ROOTS = ["src", "lib", "es", "dist", "umd", "hyperion"]


@dataclass
class ComponentRecord:
    name: str
    path: str
    depth: int


def find_files(base_path: Path) -> Iterable[Path]:
    for root, dirs, files in os.walk(base_path):
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
        for filename in files:
            if RE_COMPONENT_EXT.search(filename):
                yield Path(root) / filename


def path_depth(path: Path) -> int:
    return len(path.parts)


def extract_components(file_path: Path) -> List[Tuple[str, int]]:
    try:
        text = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return []

    components: List[Tuple[str, int]] = []

    for pattern in (
        FUNCTION_COMPONENT_RE,
        ARROW_COMPONENT_RE,
        ARROW_COMPONENT_SIMPLE_RE,
        CLASS_COMPONENT_RE,
        CLASS_COMPONENT_SHORT_RE,
    ):
        for match in pattern.finditer(text):
            name = match.group(1)
            components.append((name, _match_start_line(text, match.start())))

    for match in DISPLAY_NAME_RE.finditer(text):
        display_name = match.group(2)
        components.append((display_name, _match_start_line(text, match.start())))

    return components


def _match_start_line(text: str, index: int) -> int:
    return text.count("\n", 0, index) + 1


def gather_components(base_dirs: List[str]) -> List[ComponentRecord]:
    records: List[ComponentRecord] = []
    seen = set()
    root = Path.cwd()

    for base in base_dirs:
        base_path = root / base
        if not base_path.exists():
            continue
        for file_path in find_files(base_path):
            relative_path = file_path.relative_to(root)
            depth = path_depth(relative_path)
            comps = extract_components(file_path)
            for component_name, _line in comps:
                key = (component_name, str(relative_path))
                if key in seen:
                    continue
                seen.add(key)
                records.append(
                    ComponentRecord(
                        name=component_name,
                        path=str(relative_path),
                        depth=depth,
                    )
                )

    records.sort(key=lambda rec: (-rec.depth, rec.path, rec.name))
    return records


def main(argv: Optional[List[str]] = None) -> int:
    components = gather_components(SCAN_ROOTS)
    output = [
        {
            "name": record.name,
            "path": record.path,
        }
        for record in components
    ]
    json.dump(output, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
