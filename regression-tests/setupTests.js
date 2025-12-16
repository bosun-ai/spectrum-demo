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
  HoverWarnOutlineButton: ({ onClick, children, ...rest }) => {
    const React = require('react');
    return React.createElement('button', { onClick, ...rest }, children);
  },
}));

// Mock styled container to a simple div
jest.mock('../src/components/entities/profileCards/style', () => ({
  ActionsRowContainer: ({ children, ...rest }) => {
    const React = require('react');
    return React.createElement('div', rest, children);
  },
  ChannelCommunityMetaRow: ({ children, ...rest }) => {
    const React = require('react');
    return React.createElement('div', rest, children);
  },
  ChannelCommunityName: ({ children, ...rest }) => {
    const React = require('react');
    return React.createElement('span', rest, children);
  },
}));

// Mock avatar component to a simple img placeholder
jest.mock('src/components/avatar', () => ({
  CommunityAvatar: ({ community, size, isClickable }) => {
    const React = require('react');
    return React.createElement('img', {
      alt: community && community.name ? community.name : 'community',
      'data-testid': 'community-avatar',
      'data-size': String(size || ''),
      'data-clickable': String(!!isClickable),
    });
  },
}));

// Normalize Link to an anchor element for href assertions
jest.mock('react-router-dom', () => ({
  Link: function Link(props) {
    const React = require('react');
    const to = props.to;
    const children = props.children;
    const rest = Object.assign({}, props);
    delete rest.to;
    delete rest.children;
    return React.createElement(
      'a',
      { href: typeof to === 'string' ? to : '#', ...rest },
      children
    );
  },
}));

// Mock react-apollo graphql HOC used by shared/graphql to avoid real Apollo wiring
jest.mock('react-apollo', () => {
  const React = require('react');
  return {
    withApollo: comp => comp,
    graphql: (...args) => comp => comp,
  };
});
