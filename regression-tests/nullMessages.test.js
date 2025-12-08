// @flow
const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the component using the moduleNameMapper config
const NullMessages = require('src/views/thread/components/nullMessages')
  .default;

test('NullMessages renders null state copy', () => {
  render(React.createElement(NullMessages));
  expect(screen.getByText('No messages yet')).toBeInTheDocument();
});
