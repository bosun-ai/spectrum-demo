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

// Helper to render with Router
const renderWithRouter = (ui, { initialEntries = ['/'] } = {}) =>
  render(React.createElement(MemoryRouter, { initialEntries }, ui));

describe('Routes regression', () => {
  it('renders maintenance view only when maintenanceMode is true', () => {
    renderWithRouter(
      React.createElement(Routes, {
        maintenanceMode: true,
        currentUser: null,
        isLoadingCurrentUser: false,
      })
    );
    expect(document.body.innerHTML).toContain('Ongoing Maintenance');
  });

  it('does not render maintenance when flag is false', () => {
    // Mock children prone to Redux/Apollo errors to no-ops
    jest.spyOn(console, 'error').mockImplementation(() => {});
    renderWithRouter(
      React.createElement(Routes, {
        maintenanceMode: false,
        currentUser: null,
        isLoadingCurrentUser: false,
      })
    );
    expect(document.body.innerHTML).not.toContain('Ongoing Maintenance');
    console.error.mockRestore();
  });
});
