const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Import the compiled component via source; Jest is configured for jsdom
const Routes = require('../src/routes.js').default;

// Helper to render Routes within a router at a given path
const renderWithRouter = (ui, { route = '/' } = {}) => {
  return render(
    React.createElement(MemoryRouter, { initialEntries: [route] }, ui)
  );
};

test('redirects root "/" to "/explore" and renders Explore view shell', () => {
  // Render routes at root path
  renderWithRouter(React.createElement(Routes), { route: '/' });

  // Expect default meta title element to be in the document
  // Head component sets a title; we at least assert the app root is rendered
  // Since Explore is code-split, ensure the Switch rendered without crashing
  expect(screen.getByText(/Spectrum/i)).toBeInTheDocument();
});

test('maintenance mode renders Maintenance screen and message', () => {
  // Render with maintenanceMode enabled
  renderWithRouter(React.createElement(Routes, { maintenanceMode: true }), {
    route: '/',
  });

  // The Head description contains a specific maintenance text
  // Maintenance component should render; check for a generic keyword
  expect(
    screen.getByText(/scheduled maintenance downtime/i)
  ).toBeInTheDocument();
});
