Regression Tests

- Purpose: Verify critical React component behavior remains unchanged across dependency upgrades.
- How to run locally:
  - nvm use && node shared/install-dependencies.js
  - nvm use && yarn run test:regression
- In CI: hook test:regression into your CI job before/after unit tests.

Notes
- Uses Jest from repo with @testing-library/react for DOM assertions.
- MSW available for future network mocking; cross-fetch installed for node.
