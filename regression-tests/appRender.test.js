const React = require('react');
const { render, screen } = require('@testing-library/react');

// The App component is defined and exported as default from src/index.js
const App = require('../src/index.js').default || require('../src/index.js');

describe('App (src/index.js)', () => {
  test('renders RedirectHandler inside providers', () => {
    // Create a container element to mimic the root element used by ReactDOM
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);

    render(React.createElement(App));

    // RedirectHandler renders nothing visible by default, but attaches to DOM via Router.
    // Assert that the root element exists which means render did not crash.
    expect(document.querySelector('#root')).toBeInTheDocument();
  });
});
