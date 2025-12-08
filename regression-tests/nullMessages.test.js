// @flow
const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the component using the moduleNameMapper config
const NullMessages = require('src/views/thread/components/nullMessages')
  .default;

// Mock styled components used in thread/style to avoid undefined errors
jest.mock('src/views/thread/style.js', () => {
  const ReactLocal = require('react');
  const Fragment = ReactLocal.Fragment;
  const passthrough = ({ children }) =>
    ReactLocal.createElement(Fragment, null, children);
  return {
    NullMessagesWrapper: passthrough,
    Content: passthrough,
  };
});

test('NullMessages renders null state copy', () => {
  render(React.createElement(NullMessages));
  expect(screen.getByText('No messages yet')).toBeInTheDocument();
});
