# Regression Test Suite

This directory documents how to exercise Spectrum's existing automated test suites after dependency upgrades. Spectrum relies on two major suites:

- **Unit/API tests (Jest)** – verify server and shared utilities.
- **Integration/E2E tests (Cypress)** – verify the web app against a running API.

## Prerequisites

1. Use the repository's Node version: `nvm use` (Node 12 per `.nvmrc`).
2. Install workspaces: `nvm use && node shared/install-dependencies.js`.
3. Ensure the regression helpers are installed:

   ```bash
   nvm use && yarn add --dev msw@2.12.4 @testing-library/react@12.1.0 @testing-library/jest-dom@5.17.0 cross-fetch@4.1.0
   ```

   These versions are compatible with Node 12 and React 16.

## Running Unit/API Tests

1. Start RethinkDB locally (the suite creates/uses the `testing` database automatically).
2. Run migrations and tests in one step:

   ```bash
   nvm use && yarn run test
   ```

   This seeds dummy data, executes Jest, and tears down the database (see `docs/testing/unit.md`).

## Running Integration (Cypress) Tests

1. Build the API: `nvm use && yarn run build:api`.
2. Start the API in test mode: `nvm use && yarn run start:api:test`.
3. Start the client: `nvm use && yarn run dev:web`.
4. In a new terminal, launch Cypress:

   ```bash
   nvm use && yarn run cypress:open
   ```

   or run headless via `yarn run cypress:run`.

## Suite Expectations

- Both suites run in CI for every commit (see `docs/testing/intro.md`).
- Keep these commands green after installing or upgrading dependencies to ensure regression coverage.
