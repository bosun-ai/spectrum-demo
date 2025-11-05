Regression tests ensure components continue working after package upgrades.

Run locally:

1. Install dev deps: `yarn add -D @testing-library/react@7 msw@0.35.0` (versions compatible with React 16 + Jest 22)
2. Execute: `jest --config regression-tests/jest.config.js`
