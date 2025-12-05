const { setupServer } = require('msw/node');
const { handlers } = require('./handlers');

// Setup an MSW server for Node test environment
const server = setupServer(...handlers);

module.exports = { server };
