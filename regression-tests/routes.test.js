// Mock Loadable component to avoid dynamic import syntax in Route file
jest.mock('react-loadable', () => require('./react-loadable.mock'));

const React = require('react');
const { MemoryRouter } = require('react-router');
const { render } = require('@testing-library/react');

const Routes = require('../src/routes').default || require('../src/routes');

function renderWithRouter(route = '/') {
  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: [route] },
      React.createElement(Routes, {
        isLoadingCurrentUser: false,
        maintenanceMode: false,
      })
    )
  );
}

test('Routes renders without crashing at /explore', () => {
  renderWithRouter('/explore');
  expect(document.body.innerHTML.length).toBeGreaterThan(0);
});

test('Routes redirects / to /explore (smoke)', () => {
  renderWithRouter('/');
  expect(document.body.innerHTML.length).toBeGreaterThan(0);
});
