const React = require('react');
const { render } = require('@testing-library/react');

// Minimal mocks to render Routes without crashing
jest.mock('../src/components/error', () => ({
  ErrorBoundary: ({ children }) => children,
}));
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: C => C,
}));
jest.mock('react-redux', () => ({ connect: () => C => C }));
jest.mock('react-helmet-async', () => ({ Helmet: () => null }));
jest.mock('../src/components/appViewWrapper', () => {
  const React = require('react');
  return props => React.createElement('div', props);
});
jest.mock('../src/components/scrollManager', () => {
  const React = require('react');
  return props => React.createElement('div', props);
});
jest.mock('../src/components/modals/modalRoot', () => () => null);
jest.mock('../src/components/gallery', () => () => null);
jest.mock('../src/components/toasts', () => () => null);
jest.mock('../src/components/announcementBanner', () => () => null);
jest.mock('../src/views/navigation', () => () => null);
jest.mock('../src/views/status', () => () => null);
jest.mock('../src/views/globalTitlebar', () => () => null);
jest.mock('../src/views/thread', () => ({ ThreadView: () => null }));
jest.mock('../src/views/threadSlider', () => () => null);
jest.mock('../src/views/explore', () => ({ default: () => null }));
jest.mock('../src/views/channel', () => () => null);
jest.mock('../src/views/community', () => () => null);
jest.mock('../src/views/user', () => () => null);
jest.mock('../src/views/userSettings', () => () => null);
jest.mock('../src/views/communitySettings', () => () => null);
jest.mock('../src/views/channelSettings', () => () => null);
jest.mock('../src/views/login', () => () => null);
jest.mock('../src/views/queryParamToastDispatcher', () => () => null);
jest.mock('../src/components/message/threadAttachment/style', () => ({
  GlobalThreadAttachmentStyles: () => null,
}));
jest.mock('../src/reset.css.js', () => () => null);
// Mock dynamic business pages loader to return sync component
jest.mock('../src/views/pages', () => ({
  default: require('../src/views/pages').default,
}));
// Mock Loadable to return the loader() result directly
jest.mock('react-loadable', () => config => {
  // if given plain loader function, try to return its default export
  const mod = config && config.loader ? config.loader() : null;
  if (mod && mod.default) return mod.default;
  return () => null;
});

// Use memory history to push locations into the router
const { createMemoryHistory } = require('history');
const { Router } = require('react-router');

describe('Pages routes', () => {
  let originalHref;
  beforeEach(() => {
    // Stub window.location to observe href changes from componentDidMount
    originalHref = global.window.location.href;
    delete global.window.location;
    global.window.location = { href: '' };
  });
  afterEach(() => {
    // Restore minimal location object
    global.window.location = { href: originalHref };
  });

  test('navigating to /terms triggers redirect to GitHub Terms', () => {
    const Routes = require('../src/routes').default;
    const history = createMemoryHistory({ initialEntries: ['/terms'] });
    render(
      React.createElement(Router, { history }, React.createElement(Routes))
    );
    expect(global.window.location.href).toBe(
      'https://help.github.com/en/github/site-policy/github-terms-of-service'
    );
  });

  test('navigating to /privacy triggers redirect to GitHub Privacy', () => {
    const Routes = require('../src/routes').default;
    const history = createMemoryHistory({ initialEntries: ['/privacy'] });
    render(
      React.createElement(Router, { history }, React.createElement(Routes))
    );
    expect(global.window.location.href).toBe(
      'https://help.github.com/en/github/site-policy/github-privacy-statement'
    );
  });
});
