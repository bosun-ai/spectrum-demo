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

// Mock raw-loader imports used by reset.css.js for prism theme
jest.mock(
  '!!raw-loader!./components/rich-text-editor/prism-theme.css',
  () => '',
  { virtual: true }
);

// Mock src/views/pages/style to avoid styled-components constructing with undefined components
jest.mock('src/views/pages/style', () => {
  const React = require('react');
  const Stub = ({ children }) => React.createElement('div', null, children);
  return {
    Tagline: Stub,
    Copy: Stub,
    ViewGrid: Stub,
    StyledViewGrid: Stub,
  };
});

// Mock globals used by Maintenance
jest.mock('src/components/globals', () => {
  const React = require('react');
  const Stub = ({ children }) => React.createElement('div', null, children);
  return { FlexCol: Stub };
});

// Mock themedSection used by Maintenance
jest.mock('src/components/themedSection', () => {
  const React = require('react');
  const Stub = ({ children }) => React.createElement('div', null, children);
  return Stub;
});

// Mock shared/globals tint/hexa utilities used by styles to simple pass-throughs
jest.mock('src/components/globals', () => {
  const React = require('react');
  const Stub = ({ children }) => React.createElement('div', null, children);
  // Provide tint and hexa as identity functions to satisfy styled-components interpolations
  const tint = (c, a) => c;
  const hexa = (c, a) => c;
  return { FlexCol: Stub, tint, hexa };
});

// Mock src/views/pages/style to avoid styled-components constructing with undefined ViewGrid
jest.mock('src/views/pages/style', () => {
  const React = require('react');
  const Stub = ({ children }) => React.createElement('div', null, children);
  return {
    ViewGrid: Stub,
    StyledViewGrid: Stub,
  };
});
