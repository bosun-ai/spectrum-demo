require('@testing-library/jest-dom/extend-expect');
const { server } = require('./server');

afterEach(() => server.resetHandlers());
afterAll(() => server.close());
