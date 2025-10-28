import os
import re
import json

# Directories to scan for React components
directories = [
    'src',
    'shared',
    'api',
    'hyperion',
]

extensions = {'.js', '.jsx', '.ts', '.tsx'}

# Regex patterns to detect React components
component_patterns = [
    # function declaration: function MyComponent(...)
    re.compile(r'^\s*function\s+([A-Z][A-Za-z0-9_]*)\s*\(', re.MULTILINE),
    # class component: class MyComponent extends React.Component ...
    re.compile(r'^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+React\.Component', re.MULTILINE),
    re.compile(r'^\s*class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+Component', re.MULTILINE),
    # arrow function assignment (const MyComponent = ...)
    re.compile(r'\bconst\s+([A-Z][A-Za-z0-9_]*)\s*=\s*(\([^)]+\)|[A-Z][A-Za-z0-9_]*)?\s*=>', re.MULTILINE),
    re.compile(r'\bexport\s+default\s+function\s+([A-Z][A-Za-z0-9_]*)\s*\(', re.MULTILINE),
    # export default class ...
    re.compile(r'\bexport\s+default\s+class\s+([A-Z][A-Za-z0-9_]*)', re.MULTILINE),
]

results = []

for base_dir in directories:
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            ext = os.path.splitext(file)[-1]
            if ext not in extensions:
                continue
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception:
                continue
            found_names = set()
            for pat in component_patterns:
                for m in pat.finditer(content):
                    component_name = m.group(1)
                    if component_name and component_name not in found_names:
                        found_names.add(component_name)
                        results.append({
                            'name': component_name,
                            'path': file_path
                        })

print(json.dumps(results, indent=2))
