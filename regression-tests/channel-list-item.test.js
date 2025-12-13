const React = require('react');
const { render } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Component under test
// Import the unwrapped component to avoid Apollo context from withCurrentUser
const channelModule = require('../src/components/entities/listItems/channel');
const Channel =
  channelModule.default ||
  channelModule.Channel ||
  channelModule.ChannelListItem?.WrappedComponent ||
  channelModule.ChannelListItem;

// Build minimal ChannelInfoType-like object used by the component
function makeChannel(overrides = {}) {
  const base = {
    id: 'channel-1',
    name: 'general',
    slug: 'general',
    description: 'Welcome to the general channel',
    isPrivate: false,
    isArchived: false,
    createdAt: new Date('2020-01-01T00:00:00Z'),
    community: {
      id: 'community-1',
      name: 'Acme',
      slug: 'acme',
    },
  };
  return {
    ...base,
    ...overrides,
    community: { ...base.community, ...(overrides.community || {}) },
  };
}

test('renders channel name, description, and link', () => {
  const channel = makeChannel();
  const element = React.createElement(
    Channel,
    {
      channel,
      id: channel.id,
      name: channel.name,
      description: channel.description,
      isActive: true,
    },
    React.createElement('span', { 'data-testid': 'child-action' }, 'Child')
  );

  const { getByText, getByTestId, container } = render(
    React.createElement(MemoryRouter, null, element)
  );

  // Name should render prefixed with '# '
  expect(getByText('# general')).toBeInTheDocument();

  // Description should render
  expect(getByText('Welcome to the general channel')).toBeInTheDocument();

  // Child actions should render in ChannelActions area
  expect(getByTestId('child-action')).toBeInTheDocument();

  // Link should point to /{community.slug}/{channel.slug}?tab=posts
  const link = container.querySelector('a[href="/acme/general?tab=posts"]');
  expect(link).toBeTruthy();
});

test('shows private icon when channel is private and hides description when no description', () => {
  const channel = makeChannel({ isPrivate: true, description: null });
  const element = React.createElement(Channel, {
    channel,
    id: channel.id,
    name: channel.name,
  });

  const { container, queryByText } = render(
    React.createElement(MemoryRouter, null, element)
  );

  // Icon from Icon component should render with class .icon
  const iconEl = container.querySelector('.icon');
  expect(iconEl).toBeTruthy();

  // Description should not render
  expect(queryByText('Welcome to the general channel')).toBeNull();
});

test('returns null when channel prop is missing', () => {
  const element = React.createElement(Channel, {
    channel: null,
    id: 'missing',
    name: 'noop',
  });

  const { container } = render(
    React.createElement(MemoryRouter, null, element)
  );

  // Nothing should render inside the ErrorBoundary wrapper
  expect(container.innerHTML.trim()).toBe('');
});
