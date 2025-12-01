const { setupServer } = require('msw/node');
const { handlers } = require('./handlers');

// Shared MSW server for tests
const server = setupServer(...handlers);

module.exports = { server };
