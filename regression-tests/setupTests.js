// Use the newer import path for jest-dom v5
require('@testing-library/jest-dom');
const { server } = require('./server');
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
