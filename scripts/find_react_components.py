import os
import json
from tree_sitter import Parser
from tree_sitter_languages import get_parser

SOURCE_ROOT = os.path.join(os.getcwd(), 'src')
EXCLUDED_DIRS = {'build', 'dist', 'node_modules', '.git', '.idea', '.vscode', '.cache'}
JS_EXTENSIONS = {'.js', '.jsx', '.ts', '.tsx'}

parser_tsx = get_parser('tsx')
parser_js = get_parser('javascript')


class ComponentCollector:
    def __init__(self):
        self.components = []

    def scan_file(self, path):
        _, ext = os.path.splitext(path)
        if ext not in JS_EXTENSIONS:
            return
        rel_path = os.path.relpath(path)
        with open(path, 'rb') as f:
            source = f.read()
        if ext in {'.ts', '.tsx'}:
            tree = parser_tsx.parse(source)
        else:
            tree = parser_js.parse(source)
        self.visit(tree.root_node, source, rel_path)

    def visit(self, node, source, path):
        method = getattr(self, f'visit_{node.type}', None)
        if method:
            method(node, source, path)
        for child in node.children:
            self.visit(child, source, path)

    def visit_function_declaration(self, node, source, path):
        name_node = node.child_by_field_name('name')
        if not name_node:
            return
        name = source[name_node.start_byte:name_node.end_byte].decode('utf-8')
        if not name or not name[0].isupper():
            return
        if self._returns_jsx(node.child_by_field_name('body'), source):
            self._record(name, path)

    def visit_class_declaration(self, node, source, path):
        name_node = node.child_by_field_name('name')
        if not name_node:
            return
        name = source[name_node.start_byte:name_node.end_byte].decode('utf-8')
        if not name or not name[0].isupper():
            return
        body = node.child_by_field_name('body')
        if not body:
            return
        for child in body.children:
            if child.type == 'method_definition':
                key = child.child_by_field_name('name')
                if key and source[key.start_byte:key.end_byte].decode('utf-8') == 'render':
                    if self._returns_jsx(child.child_by_field_name('body'), source):
                        self._record(name, path)
                        break

    def visit_variable_declarator(self, node, source, path):
        name_node = node.child_by_field_name('name')
        value = node.child_by_field_name('value')
        if not name_node or not value:
            return
        name = source[name_node.start_byte:name_node.end_byte].decode('utf-8')
        if not name or not name[0].isupper():
            return
        if value.type in ('arrow_function', 'function'):
            if self._returns_jsx(value.child_by_field_name('body'), source):
                self._record(name, path)

    def _returns_jsx(self, body, source):
        if body is None:
            return False
        if body.type in ('jsx_element', 'jsx_self_closing_element', 'jsx_fragment'):
            return True
        if body.type == 'statement_block':
            for child in body.children:
                if child.type == 'return_statement':
                    expr = child.child_by_field_name('argument')
                    if expr and self._returns_jsx(expr, source):
                        return True
        return False

    def _record(self, name, path):
        self.components.append({'name': name, 'path': path})


def walk_source():
    collector = ComponentCollector()
    for root, dirs, files in os.walk(SOURCE_ROOT):
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        for file in files:
            if os.path.splitext(file)[1] in JS_EXTENSIONS:
                collector.scan_file(os.path.join(root, file))
    return collector.components


def main():
    components = walk_source()
    components.sort(key=lambda c: (c['path'].count(os.sep), c['path']))
    print(json.dumps(components, indent=2))


if __name__ == '__main__':
    main()
