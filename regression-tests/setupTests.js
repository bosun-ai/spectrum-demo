// Support both v5 and v6 of jest-dom
try {
  require('@testing-library/jest-dom/extend-expect');
} catch (e) {
  try {
    require('@testing-library/jest-dom');
  } catch (e2) {
    // noop if not available
  }
}
// MSW server is optional; guard require for older Node/Jest
let server;
try {
  server = require('./server').server;
} catch (e) {
  server = null;
}

if (server) {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
