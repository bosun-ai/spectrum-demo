const { setupServer } = require('msw/node');
const { handlers } = require('./handlers');

// Initialize MSW server with our handlers
const server = setupServer(...handlers);

module.exports = { server };
