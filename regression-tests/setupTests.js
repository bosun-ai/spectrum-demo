// Avoid @testing-library/jest-dom due to Node 12 engine constraints in transitive deps
// Basic MSW server lifecycle; can be expanded later if handlers are added
try {
  const { server } = require('./server');
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
} catch (err) {
  // If MSW is not available, continue without network mocking
}
