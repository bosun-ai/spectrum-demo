const { setupServer } = require('msw/node');
const { handlers } = require('./handlers');

// Set up the MSW server with any handlers defined
const server = setupServer(...handlers);

module.exports = { server };
