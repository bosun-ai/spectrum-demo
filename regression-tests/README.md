Regression Test Suite

- Location: this folder lives at monorepo root to orchestrate API + Web.
- Setup files:
  - regression-tests/jest.setup.js: loads cross-fetch polyfill and jest-dom.
  - regression-tests/msw.server.js: optional MSW server bootstrap for Jest.

Run locally with existing scripts (ensure Node via nvm):
- nvm use && node shared/install-dependencies.js
- Unit/Integration (Jest): nvm use && yarn run test:ci
- E2E (Cypress):
  - nvm use && yarn run build:api
  - nvm use && yarn run start:api:test
  - nvm use && yarn run dev:web
  - nvm use && yarn run test:e2e

Base URLs (per docs):
- Web: http://localhost:3000
- API: http://localhost:3001/api

Notes:
- Node version is 12 (from .nvmrc). Yarn v1 is required.
- Installed testing libs pinned for Node 12 and React 16.
