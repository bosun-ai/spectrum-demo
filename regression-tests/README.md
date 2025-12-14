# Regression Tests

Purpose:
- Isolate React component regression tests to catch breaking changes from package upgrades.

How to run:
- Use repo Node: nvm use
- Install deps: nvm use && node ../shared/install-dependencies.js
- Run Jest: nvm use && yarn run jest --config ./regression-tests/jest.config.js

Notes:
- This suite uses msw and @testing-library. Keep versions compatible with Node 12 and React 16.8.
- Avoid DB usage; mock network via msw.
