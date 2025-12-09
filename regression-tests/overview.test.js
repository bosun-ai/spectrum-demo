const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the Overview component
const Overview = require('../src/views/channelSettings/components/overview.js')
  .default;

// Stub child components that Overview renders to avoid deep dependencies
jest.mock(
  '../src/views/channelSettings/components/editForm',
  () =>
    function EditFormStub(props) {
      return React.createElement(
        'div',
        { 'data-testid': 'edit-form' },
        'EditForm'
      );
    }
);

jest.mock(
  '../src/views/channelSettings/components/channelMembers',
  () =>
    function ChannelMembersStub(props) {
      return React.createElement(
        'div',
        { 'data-testid': 'channel-members-stub' },
        `ChannelMembers:${props.id}`
      );
    }
);

jest.mock('../src/components/error', () => ({
  ErrorBoundary: ({ children }) => children,
  SettingsFallback: function SettingsFallbackStub() {
    return React.createElement(
      'div',
      { 'data-testid': 'settings-fallback' },
      'Fallback'
    );
  },
}));

test('Overview renders EditForm and ChannelMembers when channel is public', () => {
  const channel = { id: 'chan-public', isPrivate: false };
  const props = { channel, community: {}, communitySlug: 'comm' };

  render(React.createElement(Overview, props));

  // Container should exist
  const container = screen.getByTestId('edit-form');
  expect(container).toBeInTheDocument();

  // ChannelMembers should render once for public channel
  const members = screen.getAllByTestId('channel-members-stub');
  expect(members.length).toBe(1);
  expect(members[0]).toHaveTextContent('ChannelMembers:chan-public');
});

test('Overview renders ChannelMembers within private-only branch when channel is private', () => {
  const channel = { id: 'chan-private', isPrivate: true };
  const props = { channel, community: {}, communitySlug: 'comm' };

  render(React.createElement(Overview, props));

  // EditForm should always render
  expect(screen.getByTestId('edit-form')).toBeInTheDocument();

  // For private channel, ChannelMembers should still render (inside private branch)
  const members = screen.getAllByTestId('channel-members-stub');
  expect(members.length).toBe(1);
  expect(members[0]).toHaveTextContent('ChannelMembers:chan-private');
});
