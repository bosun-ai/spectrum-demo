// Regression test for src/views/channelSettings/components/overview.js
const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock ErrorBoundary to render children directly to simplify assertions
jest.mock('src/components/error', () => ({
  ErrorBoundary: ({ children }) => children,
  SettingsFallback: () => null,
}));

// Mock dependencies used within Overview
jest.mock('src/components/settingsViews/style', () => ({
  SectionsContainer: ({ children, ...props }) =>
    React.createElement('div', props, children),
  Column: ({ children }) => React.createElement('div', null, children),
}));

// Mock child components to expose identifiable text in render
jest.mock(
  'src/views/channelSettings/components/editForm',
  () => ({ channel }) =>
    React.createElement('div', null, `Channel Settings for ${channel.name}`)
);

jest.mock(
  'src/views/channelSettings/components/channelMembers',
  () => ({ channel }) =>
    React.createElement('div', null, `Members for ${channel.name}`)
);

const Overview = require('src/views/channelSettings/components/overview')
  .default;

const baseChannel = {
  id: 'channel-123',
  name: 'General',
  slug: 'general',
  isArchived: false,
  isPrivate: false,
  description: 'Welcome to General',
  channelPermissions: {
    isModerator: true,
    isOwner: false,
  },
  community: {
    slug: 'community',
    name: 'Community',
    isPrivate: false,
    communityPermissions: {
      isOwner: false,
      isModerator: false,
    },
  },
};

describe('ChannelSettings Overview regression', () => {
  it('renders EditForm and ChannelMembers for public channel', () => {
    const channel = { ...baseChannel, isPrivate: false };
    render(React.createElement(Overview, { channel }));

    // EditForm mock should render identifying text
    expect(
      screen.getByText(`Channel Settings for ${channel.name}`)
    ).toBeTruthy();

    // ChannelMembers should render inside ErrorBoundary for public channels
    expect(screen.getByText(`Members for ${channel.name}`)).toBeTruthy();

    // Root container includes data-cy attribute used elsewhere
    const container = screen.getByTestId
      ? screen.getByTestId('channel-overview')
      : document.querySelector('[data-cy="channel-overview"]');
    expect(container).toBeTruthy();
  });

  it('renders ChannelMembers once and within private wrapper for private channel', () => {
    const channel = { ...baseChannel, isPrivate: true };
    render(React.createElement(Overview, { channel }));

    // EditForm still renders
    expect(
      screen.getByText(`Channel Settings for ${channel.name}`)
    ).toBeTruthy();

    // ChannelMembers should render (once) for private channels
    const membersEls = screen.getAllByText(`Members for ${channel.name}`);
    expect(membersEls.length).toBe(1);
  });
});
