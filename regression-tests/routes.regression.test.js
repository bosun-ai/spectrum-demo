// Regression test for src/routes.js
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');
// Mock heavy style imports to avoid raw-loader resolution errors during tests
jest.mock('src/reset.css.js', () => () => null);
jest.mock('src/components/message/threadAttachment/style', () => ({
  GlobalThreadAttachmentStyles: () => null,
}));
// Mock withCurrentUser HOC to avoid Apollo requirement
jest.mock('src/components/withCurrentUser', () => ({
  withCurrentUser: Comp => Comp,
}));
const Routes = require('src/routes.js').default;

// Helper to render Routes with minimal props expected by HOCs
function renderWithRouter(ui, { initialEntries = ['/'] } = {}) {
  return render(React.createElement(MemoryRouter, { initialEntries }, ui));
}

describe('Routes regression', () => {
  it('renders without crashing at root route', () => {
    renderWithRouter(
      React.createElement(Routes, {
        currentUser: null,
        isLoadingCurrentUser: false,
      })
    );
    // Assert that global containers render into the DOM
    expect(document.body.innerHTML.length).toBeGreaterThan(0);
  });

  it('renders maintenance view when maintenanceMode is true', () => {
    renderWithRouter(
      React.createElement(Routes, {
        maintenanceMode: true,
        currentUser: null,
        isLoadingCurrentUser: false,
      })
    );
    // Maintenance view sets a specific Head title and renders Maintenance component
    expect(document.body.innerHTML).toContain('Ongoing Maintenance');
  });
});
