const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import component via moduleNameMapper alias
const ChannelListItem =
  require('src/components/listItems/channel').default ||
  require('src/components/listItems/channel');

// Create a minimal ChannelInfoType-like object
const mockChannel = {
  id: 'channel-1',
  name: 'General',
  slug: 'general',
  community: {
    id: 'community-1',
    name: 'Acme',
    slug: 'acme',
  },
};

test('ChannelListItem renders channel name and link', () => {
  // Render with children content to verify ChannelActions
  render(
    React.createElement(
      ChannelListItem,
      { channel: mockChannel },
      React.createElement('span', { 'data-testid': 'child-action' }, 'Action')
    )
  );

  // Link is mocked to an anchor in setupTests.js
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', '/acme/general');

  // Channel name text should be visible
  expect(screen.getByText('General')).toBeInTheDocument();

  // Children should render inside actions container
  expect(screen.getByTestId('child-action')).toHaveTextContent('Action');
});
