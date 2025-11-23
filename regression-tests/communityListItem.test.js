const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the compiled component path the same way other tests do
const { CommunityListItem } = require('../src/components/listItems');

describe('CommunityListItem', () => {
  const baseCommunity = {
    id: 'c1',
    name: 'Test Community',
    description: 'A place to test things',
    // minimal fields used by CommunityAvatar may include photo or slug, but it guards access
  };

  test('renders community name', () => {
    render(
      React.createElement(CommunityListItem, { community: baseCommunity })
    );
    expect(screen.getByText('Test Community')).toBeInTheDocument();
  });

  test('renders description when showDescription=true', () => {
    render(
      React.createElement(CommunityListItem, {
        community: baseCommunity,
        showDescription: true,
      })
    );
    expect(screen.getByText('A place to test things')).toBeInTheDocument();
  });
});
