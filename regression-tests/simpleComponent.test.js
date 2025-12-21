const React = require('react');
const { render, fireEvent } = require('@testing-library/react');
const { SimpleComponent } = require('./simpleComponent');

describe('SimpleComponent', () => {
  it('increments count when button is clicked', () => {
    const { getByTestId } = render(
      React.createElement(SimpleComponent, { initialCount: 2 })
    );

    const valueNode = getByTestId('counter-value');
    const buttonNode = getByTestId('counter-button');

    expect(valueNode.textContent).toBe('2');

    fireEvent.click(buttonNode);
    fireEvent.click(buttonNode);

    expect(valueNode.textContent).toBe('4');
  });
});
