// Jest setup for regression tests
require('@testing-library/jest-dom/extend-expect');

const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
