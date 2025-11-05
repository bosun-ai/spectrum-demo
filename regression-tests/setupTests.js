// Ensures React Testing Library custom matchers are available
// and MSW server is set up for tests.
import '@testing-library/jest-dom/extend-expect';
import { server } from './testServer';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios) so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
