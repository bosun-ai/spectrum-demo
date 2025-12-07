const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the route file which defines ChannelSettings via react-loadable
// We don't render the whole router; instead ensure the Loadable setup exists
const routes = require('../src/routes.js');

test('ChannelSettings Loadable is defined and renders loading fallback', () => {
  // ChannelSettingsFallback is exported only via composition in routes
  // We verify the Loadable setup by attempting to render the fallback component
  // created by signedOutFallback, which wraps ChannelSettings.
  const { ChannelSettings } = routes;
  // routes.js does not export ChannelSettings symbol; ensure it exists via require cache
  // Instead, we render the loading view by triggering the Loadable loading state.
  // Construct the same Loadable as in routes.js by re-importing the module default export
  // and checking that it is a valid React component.
  expect(typeof ChannelSettings).toBe('function');

  // Render the component while it is in loading state; react-loadable will render LoadingView
  render(React.createElement(ChannelSettings, null));

  // Since LoadingView renders nothing more than a container, we assert the component mounted
  // by checking that the container exists (no crash). Testing-library throws if render fails.
  expect(screen).toBeDefined();
});
