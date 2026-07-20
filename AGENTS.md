# Repository Guidelines

## Project Structure & Module Organization

Spectrum is a JavaScript monorepo. `src/` contains the React single-page app; organize UI by feature under `src/components/` and client state/API code under `src/actions/` and `src/api/`. `api/` is the Express/Apollo GraphQL service, with models, resolvers (`queries/`, `mutations/`, `subscriptions/`), routes, and migrations. `hyperion/` provides server-side rendering. Reusable cross-service code lives in `shared/`; static browser assets are in `public/`. Keep technical documentation in `docs/`. Jest tests are colocated in `api/test/`, `api/models/test/`, `shared/test/`, or feature-specific `test/` directories; Cypress specs live in `cypress/integration/`.

## Build, Test, and Development Commands

Use Yarn; the root lockfile is authoritative.

- `node shared/install-dependencies.js` installs dependencies for the workers.
- `yarn dev:api` and `yarn dev:web` run the API and frontend locally; RethinkDB and Redis must be running.
- `yarn build:web`, `yarn build:api`, and `yarn build:hyperion` create production builds.
- `yarn test:ci` runs Jest once for CI. `yarn test` runs Jest in watch mode.
- `yarn test:e2e` runs Cypress end-to-end tests; `yarn cypress:open` opens its UI.
- `yarn lint` runs ESLint and `yarn flow` performs Flow checks.
- `yarn db:migrate`, `yarn db:seed`, and `yarn db:reset` manage the local RethinkDB data.

## Coding Style & Naming Conventions

Write Flow-typed JavaScript: new `.js` files begin with `// @flow`, and exported functions should have useful types. Use ES modules, React functional components where appropriate, and the existing `index.js` directory entry pattern for components. Follow Prettier (`singleQuote`, ES5 trailing commas); the pre-commit hook formats staged JavaScript and applies ESLint fixes. Run `yarn lint` before submitting. Do not commit `console.log`; use the `debug` module for development logging or `console.error` for errors.

## Testing Guidelines

Add or update Jest tests for behavior changes, using descriptive `*.test.js` names such as `deleteChannel.test.js`. Keep API tests grouped by domain under `api/test/`; use Cypress for browser workflows. Run the narrow relevant test first, then `yarn test:ci`, `yarn lint`, and `yarn flow`. CI also runs end-to-end tests; no standalone coverage threshold is configured.

## Commit & Pull Request Guidelines

Use short imperative commit subjects, e.g. `Fix flow errors` or `Remove unused import`. Keep commits focused. Follow `.github/PULL_REQUEST_TEMPLATE.md`: set review status, identify deployments and migrations, include user-facing release notes and linked issues when applicable. Attach desktop and mobile screenshots or recordings for UI changes, and state the validation performed.
