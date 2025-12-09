// For jest@23, extend-expect attaches matchers via import side-effects
require('@testing-library/jest-dom/extend-expect');
const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
