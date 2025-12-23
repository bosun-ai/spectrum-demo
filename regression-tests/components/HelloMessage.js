// @flow
const React = require('react');

function HelloMessage({ name }: { name: string }) {
  return React.createElement(
    'div',
    { className: 'hello-message' },
    `Hello, ${name}!`
  );
}

module.exports = HelloMessage;
