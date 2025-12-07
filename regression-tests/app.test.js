const React = require('react');
const { render } = require('@testing-library/react');

// The App component is defined in src/index.js; this test ensures
// it renders without crashing within the regression harness.
// We import the default export if present, otherwise grab App off module.
const indexModule = require('../src/index.js');
const App = indexModule.default || indexModule.App || indexModule;

test('App renders basic shell', () => {
  // Provide a root element for ReactDOM render/hydrate target
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);

  // Render App; it should mount providers and RedirectHandler
  const { container } = render(React.createElement(App));

  // Basic assertion: container is attached and not empty
  expect(container).toBeInTheDocument();
  expect(container.firstChild).toBeTruthy();
});
