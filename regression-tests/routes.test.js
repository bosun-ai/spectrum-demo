// @flow
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Import the composed default export
const Routes = require('../src/routes').default;

// Mock zIndex used by threadAttachment styles to simple object
jest.mock('src/components/globals', () => ({ zIndex: { card: 1 } }));

// Helper: render Routes within a Router and optional props overrides
const renderWithRouter = (initialPath = '/', props = {}) => {
  // Routes expects withRouter to inject location/history; MemoryRouter provides it
  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: [initialPath] },
      React.createElement(Routes, {
        // Minimal props expected by Routes
        currentUser: null,
        isLoadingCurrentUser: false,
        maintenanceMode: false,
        ...props,
      })
    )
  );
};

test('renders without crashing at root', () => {
  // Minimal smoke test: ensure Routes renders its global wrappers
  renderWithRouter('/');
  // Global components like Status/Toasts may render nothing; assert document body exists
  expect(document.body).toBeDefined();
});

test('maintenance mode renders maintenance view', () => {
  renderWithRouter('/', { maintenanceMode: true });
  // The Maintenance component should render a message from Head and a Maintenance UI.
  // Assert the maintenance Head title text is present
  // Head sets document.title, which we can check
  expect(document.title).toMatch(/Ongoing Maintenance - Spectrum/);
});
