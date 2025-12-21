#!/usr/bin/env python3
"""Scan the repository for React components and output them as JSON.

The script looks for class, function, and arrow-function components that appear to
return JSX (or call React.createElement). Results are ordered so the most deeply
nested files appear first, which makes it easier to focus on leaf-level
components during follow-up processing.
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path
from typing import Iterable, List, Sequence, Tuple


SUFFIXES: Tuple[str, ...] = (".js", ".jsx", ".ts", ".tsx")
SKIP_DIR_NAMES = {
    ".git",
    ".yarn",
    "node_modules",
    "build",
    "dist",
}
SKIP_DIR_PREFIXES = ("build-", "dist-")

CLASS_RE = re.compile(
    r"\bclass\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+(?:React\.)?(?:Component|PureComponent)\b"
)
FUNCTION_RE = re.compile(
    r"(?:export\s+default\s+|export\s+)?function\s+([A-Z][A-Za-z0-9_]*)\s*\([^)]*\)\s*{",
    re.MULTILINE,
)
ARROW_BLOCK_RE = re.compile(
    r"(?:export\s+default\s+|export\s+)?(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)" r"\s*=\s*"
    r"(?:async\s*)?(?:\([^)]*\)|[A-Za-z0-9_$]+)\s*=>\s*{",
    re.MULTILINE,
)
ARROW_CONCISE_RE = re.compile(
    r"(?:export\s+default\s+|export\s+)?(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)" r"\s*=\s*"
    r"(?:async\s*)?(?:\([^)]*\)|[A-Za-z0-9_$]+)\s*=>\s*(?:\(|<)",
    re.MULTILINE,
)


def should_skip_dir(dir_name: str) -> bool:
    if dir_name in SKIP_DIR_NAMES:
        return True
    return any(dir_name.startswith(prefix) for prefix in SKIP_DIR_PREFIXES)


def iter_source_files(root: Path) -> Iterable[Path]:
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if not should_skip_dir(d)]
        for filename in filenames:
            if filename.endswith(SUFFIXES):
                yield Path(dirpath) / filename


def extract_block(text: str, brace_start: int) -> str:
    if brace_start < 0 or brace_start >= len(text) or text[brace_start] != "{":
        return ""
    depth = 0
    for index in range(brace_start, len(text)):
        char = text[index]
        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return text[brace_start + 1 : index]
    return text[brace_start + 1 :]


def contains_jsx_or_create_element(snippet: str) -> bool:
    jsx_return = re.search(r"return\s+(?:\(|<)\s*<", snippet, re.DOTALL)
    if jsx_return:
        return True
    return "React.createElement" in snippet


def detect_components_in_text(text: str) -> Sequence[str]:
    candidates = set()
    lowered = text.lower()
    if "react" not in lowered:
        return []

    for match in CLASS_RE.finditer(text):
        candidates.add(match.group(1))

    for match in FUNCTION_RE.finditer(text):
        brace_start = match.end() - 1
        body = extract_block(text, brace_start)
        if contains_jsx_or_create_element(body):
            candidates.add(match.group(1))

    for match in ARROW_BLOCK_RE.finditer(text):
        brace_start = match.end() - 1
        body = extract_block(text, brace_start)
        if contains_jsx_or_create_element(body):
            candidates.add(match.group(1))

    for match in ARROW_CONCISE_RE.finditer(text):
        candidates.add(match.group(1))

    return sorted(candidates)


def components_with_paths(files: Iterable[Path], root: Path) -> List[dict]:
    components = []
    seen = set()
    for path in files:
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            text = path.read_text(encoding="utf-8", errors="ignore")
        names = detect_components_in_text(text)
        if not names:
            continue
        rel_path = path.relative_to(root)
        for name in names:
            key = (name, str(rel_path))
            if key in seen:
                continue
            seen.add(key)
            components.append({"name": name, "path": str(rel_path)})
    components.sort(
        key=lambda item: (
            -len(Path(item["path"]).parts),
            item["path"].lower(),
            item["name"].lower(),
        )
    )
    return components


def main() -> None:
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    files = iter_source_files(root)
    components = components_with_paths(files, root)
    json.dump(components, sys.stdout, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
