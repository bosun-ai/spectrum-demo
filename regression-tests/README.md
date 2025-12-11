Regression Tests

This folder is reserved for UI regression tests to guard against breaking changes during package upgrades. Tests use Jest + React Testing Library with jsdom and MSW for network mocking.

Installed tooling (Node 12 compatible):
- msw@0.25.0
- @testing-library/react@12.1.5
- @testing-library/jest-dom@4.2.4
- cross-fetch@4.1.0

Project already configures Jest globally via jest.config.js and shared/testing/setup-test-framework.js.

How to run tests:
- nvm use && yarn run test
