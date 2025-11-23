const React = require('react');
const { render } = require('@testing-library/react');

// Mock modules that cause side effects or require fetch/websocket
jest.mock('shared/graphql', () => ({
  client: {},
}));
jest.mock(
  'shared/graphql',
  () => ({
    client: {},
    wsLink: { subscriptionClient: { on: () => {} } },
  }),
  { virtual: true }
);
jest.mock('offline-plugin/runtime', () => ({ install: () => ({}) }));
jest.mock('src/helpers/web-push-manager', () => ({ set: () => {} }));

// Now require after mocks applied
const App = require('../src/index.js').default || require('../src/index.js');

describe('App (src/index.js)', () => {
  test('renders without crashing', () => {
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);

    render(React.createElement(App));

    expect(document.querySelector('#root')).toBeInTheDocument();
  });
});
