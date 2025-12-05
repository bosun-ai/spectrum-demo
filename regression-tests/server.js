const { setupServer } = require('msw/node');
const { handlers } = require('./handlers');

// Setup a request interception server for tests
const server = setupServer(...handlers);

module.exports = { server };
