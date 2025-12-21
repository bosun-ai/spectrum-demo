const React = require('react');
const { useState } = React;

function SimpleComponent(props) {
  const initial = props.initialCount || 0;
  const [count, setCount] = useState(initial);

  const increment = () => {
    setCount((value) => value + 1);
  };

  return React.createElement(
    'div',
    { 'data-testid': 'counter-wrapper' },
    React.createElement('span', { 'data-testid': 'counter-value' }, count),
    React.createElement(
      'button',
      {
        type: 'button',
        onClick: increment,
        'data-testid': 'counter-button',
      },
      'Increment'
    )
  );
}

module.exports = { SimpleComponent };
