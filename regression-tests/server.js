const { setupServer } = require('msw/node');
const { handlers } = require('./handlers');

// Initialize server with any handlers (empty for now)
const server = setupServer(...handlers);

module.exports = { server };
