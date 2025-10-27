import os
import sys
import re
import json

# Directories to search for React components
SEARCH_DIRS = [
    "src",
    "shared",
    "hyperion",
    "api"
]
# File extensions to check
EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"]

# Regex patterns for different types of components
CLASS_COMPONENT_RE = re.compile(r"class\\s+([A-Za-z0-9_]+)\\s+extends\\s+React\\.(Component|PureComponent)")
FUNCTION_COMPONENT_RE = re.compile(r"function\\s+([A-Za-z0-9_]+)\\s*\\(.*\\)\\s*{", re.MULTILINE)
ARROW_COMPONENT_RE = re.compile(r"const\\s+([A-Za-z0-9_]+)\\s*=\\s*(?:\\(.*?\\)|[A-Za-z0-9_]+)\\s*=>", re.MULTILINE)

def is_source_file(filename):
    return any(filename.endswith(ext) for ext in EXTENSIONS)

def find_components_in_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception:
        return []
    components = set()
    # Check for class components
    for match in CLASS_COMPONENT_RE.finditer(content):
        components.add(match.group(1))
    # Check for function components
    for match in FUNCTION_COMPONENT_RE.finditer(content):
        components.add(match.group(1))
    # Check for arrow function components
    for match in ARROW_COMPONENT_RE.finditer(content):
        components.add(match.group(1))
    return list(components)

def main():
    repo_root = os.path.dirname(os.path.abspath(__file__))
    result = []
    for search_dir in SEARCH_DIRS:
        abs_search_dir = os.path.join(repo_root, search_dir)
        if not os.path.isdir(abs_search_dir):
            continue
        for root, dirs, files in os.walk(abs_search_dir):
            for file in files:
                if not is_source_file(file):
                    continue
                full_path = os.path.join(root, file)
                # Get relative posix path
                rel_path = os.path.relpath(full_path, repo_root).replace(os.sep, "/")
                comps = find_components_in_file(full_path)
                for comp in comps:
                    result.append({"name": comp, "path": rel_path})
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
