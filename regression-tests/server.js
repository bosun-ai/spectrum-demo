const { setupServer } = require('msw/node');
const { handlers } = require('./handlers');

// Initialize the MSW server with the provided handlers
const server = setupServer(...handlers);

module.exports = { server };
