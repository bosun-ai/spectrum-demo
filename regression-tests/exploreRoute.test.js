const React = require('react');
const { MemoryRouter, Route } = require('react-router');
const { render, screen } = require('@testing-library/react');

// Render the real Routes component and navigate to /explore
describe('Explore Route', () => {
  test('renders Explore view at /explore', async () => {
    const Routes = require('../src/routes.js').default;

    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/explore'] },
        React.createElement(Route, { path: '/', component: Routes })
      )
    );

    // Explore view sets data-cy="explore-page" on ViewGrid
    const explore = await screen
      .findByTestId('explore-page', {}, { timeout: 3000 })
      .catch(() => null);
    const byDataCy =
      explore || document.querySelector('[data-cy="explore-page"]');
    expect(byDataCy).toBeTruthy();
  });
});
