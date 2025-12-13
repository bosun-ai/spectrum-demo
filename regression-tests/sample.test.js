const React = require('react');
const { render } = require('@testing-library/react');

function Hello(props) {
  const name = props && props.name ? props.name : '';
  return React.createElement('div', null, `Hello, ${name}`);
}

test('renders stable greeting', () => {
  const element = React.createElement(Hello, { name: 'World' }, null);
  const { getByText } = render(element);
  expect(getByText('Hello, World')).toBeInTheDocument();
});
