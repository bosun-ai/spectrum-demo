const { setupServer } = require('msw/node');
const { handlers } = require('./handlers');

// Setup an MSW server with the defined handlers
const server = setupServer(...handlers);

module.exports = { server };
