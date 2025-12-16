require('@testing-library/jest-dom/extend-expect');
const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock aliased UI components used by tested components to avoid bundler aliases
// Use relative path to avoid Jest moduleNameMapper for src/* aliases
jest.mock('../src/components/button', () => ({
  OutlineButton: ({ to, children, ...rest }) => {
    const React = require('react');
    return React.createElement(
      'a',
      { href: typeof to === 'string' ? to : '#', ...rest },
      children
    );
  },
}));

// Mock styled container to a simple div
jest.mock('../src/components/entities/profileCards/style', () => ({
  ActionsRowContainer: ({ children, ...rest }) => {
    const React = require('react');
    return React.createElement('div', rest, children);
  },
}));
