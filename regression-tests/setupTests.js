// Setup for React Testing Library and MSW
import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';
import { server } from './testServer';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
