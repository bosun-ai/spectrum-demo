Regression Tests Setup

- Node version: see `.nvmrc` -> 12
- React version: from `package.json` -> ^16.8.4

Installed test dependencies (compatible with Node 12 and React 16):
- msw@0.27.0
- @testing-library/react@11.2.7
- @testing-library/jest-dom@4.2.4
- cross-fetch@4.1.0
- jest@26.6.3 (added to devDependencies; project also pins jest 22 for API tests)

Notes
- Use `nvm use` before running yarn scripts.
- Install monorepo dependencies via `node shared/install-dependencies.js`.

Typical commands
- `nvm use && yarn run test` for jest tests
- Cypress flow per docs in `docs/testing/integration.md`
