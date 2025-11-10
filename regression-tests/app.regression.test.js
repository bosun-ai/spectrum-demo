import React from 'react';
import * as ReactDOM from 'react-dom';

// Mock modules that cause side effects in the entry
jest.mock('offline-plugin/runtime', () => ({
  install: jest.fn(),
  applyUpdate: jest.fn(),
}));
jest.mock('react-loadable', () => {
  const mod = () => ({ preload: () => {} });
  mod.preloadReady = () => Promise.resolve();
  return mod;
});
// Mock shared/graphql wsLink to avoid real websocket attempts
jest.mock('shared/graphql', () => {
  const original = jest.requireActual('shared/graphql');
  return {
    ...original,
    wsLink: {
      subscriptionClient: {
        on: jest.fn(),
      },
    },
  };
});

// Ensure a root element exists for the App to render/hydrate into
beforeEach(() => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
});

afterEach(() => {
  const root = document.getElementById('root');
  if (root) root.remove();
});

test('App renders into #root without crashing', () => {
  // Pretend server rendered state so entry chooses hydrate
  // and avoids certain client-only branches in tests
  // $FlowIgnore
  window.__SERVER_STATE__ = {};
  // Spy on ReactDOM.render and hydrate to avoid actual DOM updates and side effects
  const renderSpy = jest.spyOn(ReactDOM, 'render').mockImplementation(() => {});
  const hydrateSpy = jest
    .spyOn(ReactDOM, 'hydrate')
    .mockImplementation(() => {});

  // Import the entry file which defines and triggers rendering of App
  // Note: the module will choose render vs hydrate depending on window.__SERVER_STATE__
  // Use CommonJS require to avoid Node v12 dynamic import issues
  const entry = require('../src/index.js');

  // Verify that our render target exists
  const root = document.querySelector('#root');
  expect(root).toBeInTheDocument();

  // One of render or hydrate should have been called with a React element and the root
  const wasCalled = renderSpy.mock.calls.length + hydrateSpy.mock.calls.length;
  expect(wasCalled).toBeGreaterThan(0);

  // Ensure the second argument to render/hydrate is our root element
  const call = renderSpy.mock.calls[0] || hydrateSpy.mock.calls[0];
  expect(call[1]).toBe(root);

  // Clean up spies
  renderSpy.mockRestore();
  hydrateSpy.mockRestore();
});
