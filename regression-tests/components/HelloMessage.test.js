// @flow
const React = require('react');
const { render, screen } = require('@testing-library/react');
const HelloMessage = require('./HelloMessage');

describe('HelloMessage component', () => {
  it('renders greeting with provided name', () => {
    const name = 'Regression Suite';

    render(
      React.createElement(HelloMessage, {
        name,
      })
    );

    expect(screen.getByText(`Hello, ${name}!`)).toBeInTheDocument();
  });
});
