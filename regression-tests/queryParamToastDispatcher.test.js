// @flow
const React = require('react');
const { render } = require('@testing-library/react');
const { Provider } = require('react-redux');
const { createStore } = require('redux');
const { Router } = require('react-router');
const createHistory = require('history').createMemoryHistory;

// Import the connected component
const QueryParamToastDispatcher = require('../src/views/queryParamToastDispatcher')
  .default;

// Minimal reducer to capture dispatched toast actions
const initialState = {};
function reducer(state = initialState, action) {
  // just return state; we will inspect actions via a custom dispatch
  return state;
}

test('dispatches toast on mount and cleans query params', () => {
  // Set up history with toast query params
  const history = createHistory({
    initialEntries: [
      '/path?toastType=success&toastMessage=Hello%20World&other=1',
    ],
  });

  // Wrap store dispatch to capture actions
  const store = createStore(reducer);
  const actions = [];
  const originalDispatch = store.dispatch;
  store.dispatch = action => {
    actions.push(action);
    return originalDispatch(action);
  };

  // Render component within Router and Provider
  render(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        Router,
        { history },
        React.createElement(QueryParamToastDispatcher, null)
      )
    )
  );

  // Verify toast action dispatched
  const toastAction =
    actions.find(a => a && a.type && a.type.includes('TOAST')) || actions[0];
  expect(actions.length).toBeGreaterThan(0);
  // The action creator addToastWithTimeout returns an object; ensure payload matches
  // We can't import it directly here without coupling, so check common fields
  expect(JSON.stringify(actions)).toContain('Hello World');
  expect(JSON.stringify(actions)).toMatch(/success/i);

  // Verify search params cleaned (toast params removed, other preserved)
  expect(history.location.search).toBe('?other=1');
});

test('does not dispatch if invalid toastType', () => {
  const history = createHistory({
    initialEntries: ['/path?toastType=invalid&toastMessage=Nope'],
  });
  const store = createStore(reducer);
  const actions = [];
  const originalDispatch = store.dispatch;
  store.dispatch = action => {
    actions.push(action);
    return originalDispatch(action);
  };

  render(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        Router,
        { history },
        React.createElement(QueryParamToastDispatcher, null)
      )
    )
  );

  // No actions should have been dispatched
  expect(actions.length).toBe(0);
  // Location should remain unchanged
  expect(history.location.search).toBe('?toastType=invalid&toastMessage=Nope');
});

test('dispatches on update when toastMessage changes', () => {
  const history = createHistory({ initialEntries: ['/path'] });
  const store = createStore(reducer);
  const actions = [];
  const originalDispatch = store.dispatch;
  store.dispatch = action => {
    actions.push(action);
    return originalDispatch(action);
  };

  const { rerender } = render(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        Router,
        { history },
        React.createElement(QueryParamToastDispatcher, null)
      )
    )
  );

  // Update location to include toast params
  history.push('/path?toastType=neutral&toastMessage=Updated');
  // Re-render to trigger componentDidUpdate with new router props
  rerender(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        Router,
        { history },
        React.createElement(QueryParamToastDispatcher, null)
      )
    )
  );

  // Verify a toast action was dispatched
  expect(JSON.stringify(actions)).toContain('Updated');
  expect(JSON.stringify(actions)).toMatch(/neutral/i);
  // Verify search cleaned
  expect(history.location.search).toBe('');
});
