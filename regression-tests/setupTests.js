// Jest + RTL + MSW setup for regression tests
import '@testing-library/jest-dom/extend-expect';
import { server } from './testServer';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up once the tests are done.
afterAll(() => server.close());
