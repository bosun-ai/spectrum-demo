## Regression Test Suite Setup

This folder documents the regression testing environment for the React front-end. It provides tooling to discover React components and guidance on running and extending tests under the repository's Node 12 / React 16 stack.

### Node & React Baseline

- Node: `12.22.12` (see `.nvmrc`). Use `nvm use` before running any installs or tests.
- React: `^16.8.4` from the root `package.json`. Keep testing dependencies compatible with React 16 when upgrading.

### Installed Testing Tooling

The following packages were trialed for Node 12 compatibility and pinned in `package.json`:

- `@testing-library/react@11.2.7`
- `@testing-library/jest-dom@5.11.4`
- `jest@26.6.3` (also updated the `resolutions` block for `jest` and `jest-environment-node`)
- `msw@0.28.2`
- `cross-fetch@3.1.5`
- `pretty-format@26.6.2`

When adding new testing utilities use `yarn add -D <pkg>@<version>` and downgrade versions if Node 12 engine or peer dependency conflicts appear.

### React Component Inventory

Use `scripts/find_react_components.py` (Python + tree-sitter) to list candidate components for regression coverage:

```
nvm use
python scripts/find_react_components.py > regression-tests/components.json
```

This script scans `src/` for class/function components returning JSX. The generated `components.json` can be used to plan targeted regression scenarios.

### Running Tests

1. Ensure RethinkDB + Redis are running locally (`rethinkdb`, `redis-server`).
2. Prime the testing DB if needed:
   ```
   yarn run start:api:test
   ```
3. Execute the Jest suite:
   ```
   yarn test --runInBand
   ```
4. For integration/e2e coverage run:
   ```
   yarn test:e2e
   ```

### Adding Regression Cases

- Favor colocated `*.test.js`/`*.spec.js` files alongside components.
- Import `@testing-library/react` helpers and extend Jest with `@testing-library/jest-dom` in `shared/testing/setup-test-framework.js` if custom matchers are needed.
- Mock network calls with `msw` handlers (configure them per test file or via a shared setup once ready).
- When recreating UI flows, seed data via the existing RethinkDB fixtures or MSW mocks to keep tests deterministic.

Document any new commands or tooling decisions in this README to keep the regression suite reproducible.
