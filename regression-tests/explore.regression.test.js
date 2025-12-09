/**
 * Regression test for Explore view at src/views/explore/index.js
 * Ensures it renders Head and Charts within ViewGrid and dispatches titlebar action.
 */

const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the Explore component (default export from compose)
const Explore = require('../src/views/explore/index.js').default;

// Mock Head to avoid react-helmet-async usage and expose props
jest.mock('../src/components/head', () => {
  const ReactLocal = require('react');
  return function HeadMock(props) {
    return ReactLocal.createElement(
      'div',
      {
        'data-testid': 'head',
        title: props.title,
        description: props.description,
      },
      null
    );
  };
});

// Mock ViewGrid to render a simple container with the data-cy attribute preserved
jest.mock('../src/components/layout', () => {
  const ReactLocal = require('react');
  return {
    ViewGrid: function ViewGridMock(props) {
      return ReactLocal.createElement(
        'div',
        { 'data-cy': props['data-cy'], 'data-testid': 'view-grid' },
        props.children
      );
    },
  };
});

// Mock ErrorBoundary to pass through children
jest.mock('../src/components/error', () => {
  const ReactLocal = require('react');
  return {
    ErrorBoundary: ({ children }) =>
      ReactLocal.createElement(ReactLocal.Fragment, null, children),
  };
});

// Mock Charts to a simple marker component
jest.mock('../src/views/explore/view', () => {
  const ReactLocal = require('react');
  return {
    Charts: function ChartsMock() {
      return ReactLocal.createElement('div', { 'data-testid': 'charts' });
    },
  };
});

// Mock withCurrentUser HOC to pass-through
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: Comp => Comp,
}));

// Mock react-redux connect to inject a stub dispatch
jest.mock('react-redux', () => {
  return {
    connect: () => Comp =>
      function Connected(props) {
        const dispatch = jest.fn();
        return React.createElement(Comp, { ...props, dispatch });
      },
  };
});

// Spy on setTitlebarProps to validate it is called with expected payload
const titlebar = require('../src/actions/titlebar');
jest.spyOn(titlebar, 'setTitlebarProps');

// Ensure a #main element exists for potential scroll operations in child components
beforeEach(() => {
  const main = document.createElement('div');
  main.id = 'main';
  document.body.appendChild(main);
});

afterEach(() => {
  const main = document.querySelector('#main');
  if (main) main.remove();
  jest.clearAllMocks();
});

// Tests

test('Explore renders ViewGrid with Head and Charts', () => {
  render(React.createElement(Explore));

  // View container present
  expect(screen.getByTestId('view-grid')).toBeInTheDocument();
  // data-cy used by e2e remains intact
  expect(screen.getByTestId('view-grid')).toHaveAttribute(
    'data-cy',
    'explore-page'
  );

  // Head and Charts markers present
  expect(screen.getByTestId('head')).toBeInTheDocument();
  expect(screen.getByTestId('charts')).toBeInTheDocument();
});

test('Explore dispatches titlebar props on mount', () => {
  render(React.createElement(Explore));
  // Verify the action creator was called with expected payload
  expect(titlebar.setTitlebarProps).toHaveBeenCalledTimes(1);
  expect(titlebar.setTitlebarProps).toHaveBeenCalledWith({ title: 'Explore' });
});
