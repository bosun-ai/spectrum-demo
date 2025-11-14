// regression-tests/server.js
// This sets up Mock Service Worker in case API mocking is needed later.
import { setupServer } from 'msw/node';
// Example handler; add actual ones as needed
import { rest } from 'msw';

// No handlers for now - infrastructure only
export const server = setupServer();

// Establish API mocking before all tests, and clean up after
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
