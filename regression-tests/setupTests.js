// @flow
require('@testing-library/jest-dom/extend-expect');

// Ensure fetch exists in Node environment for MSW and tests
try {
  // eslint-disable-next-line global-require
  const fetch = require('cross-fetch');
  if (typeof global.fetch === 'undefined') {
    global.fetch = fetch;
  }
} catch (err) {
  // ignore if cross-fetch not available
}

const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Lightweight mocks for modules that are not resolvable in regression env
jest.mock('src/components/tooltip', () => {
  const React = require('react');
  return function Tooltip(props) {
    return React.createElement(React.Fragment, null, props.children);
  };
});

jest.mock('src/components/layout', () => ({
  MIN_WIDTH_TO_EXPAND_NAVIGATION: 1024,
}));

jest.mock('src/components/viewNetworkHandler', () => Comp => Comp);

jest.mock('src/components/error', () => ({
  ErrorBoundary: ({ children }) => children,
}));

jest.mock('shared/graphql/queries/user/getUserCommunityConnection', () => ({
  getCurrentUserCommunityConnection: Comp => Comp,
}));
