/* eslint-disable import/no-commonjs */
const { setupServer } = require('msw/node');
const { handlers } = require('./testHandlers');

// Setup requests interception using the given handlers.
const server = setupServer(...handlers);
module.exports = { server };
