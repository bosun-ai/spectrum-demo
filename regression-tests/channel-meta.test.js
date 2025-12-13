const React = require('react');
const { render } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Import the component under test
const {
  ChannelMeta,
} = require('../src/components/entities/profileCards/components/channelMeta');

// Helper to build a minimal ChannelInfoType-like object
function makeChannel(overrides = {}) {
  const base = {
    id: 'channel-1',
    name: 'general',
    slug: 'general',
    description: 'Welcome to the general channel',
    isPrivate: false,
    createdAt: new Date('2020-01-01T00:00:00Z'),
    isArchived: false,
    channelPermissions: {
      isMember: true,
      isPending: false,
      isBlocked: false,
      isOwner: false,
      isModerator: false,
      receiveNotifications: true,
    },
    community: {
      id: 'community-1',
      name: 'Acme',
      slug: 'acme',
      description: 'Acme community',
      website: null,
      memberCount: 1,
      channelCount: 1,
      isPrivate: false,
      createdAt: new Date('2019-01-01T00:00:00Z'),
    },
  };
  return {
    ...base,
    ...overrides,
    community: { ...base.community, ...(overrides.community || {}) },
  };
}

test('renders channel name link and description', () => {
  const channel = makeChannel();
  const element = React.createElement(ChannelMeta, { channel });
  const { getByText } = render(
    React.createElement(MemoryRouter, null, element)
  );

  // Name should render prefixed with '# '
  expect(getByText('# general')).toBeInTheDocument();

  // Description should render when provided
  expect(getByText('Welcome to the general channel')).toBeInTheDocument();
});

test('renders archived badge when isArchived', () => {
  const channel = makeChannel({ isArchived: true });
  const element = React.createElement(ChannelMeta, { channel });
  const { getByText } = render(
    React.createElement(MemoryRouter, null, element)
  );

  expect(getByText('Archived')).toBeInTheDocument();
});

test('does not render description when missing', () => {
  const channel = makeChannel({ description: null });
  const element = React.createElement(ChannelMeta, { channel });
  const utils = render(React.createElement(MemoryRouter, null, element));

  const nameEls = utils.getAllByText('# general');
  expect(nameEls.length).toBeGreaterThan(0);
  // Description should be absent in this render
  expect(utils.queryByText('Welcome to the general channel')).toBeNull();
});
