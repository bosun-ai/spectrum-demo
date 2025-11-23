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
// Avoid importing real routes with dynamic imports inside RedirectHandler
jest.mock('../src/routes', () => ({ __esModule: true, default: () => null }));
jest.mock('../src/hot-routes', () => ({
  __esModule: true,
  default: () => null,
}));

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
