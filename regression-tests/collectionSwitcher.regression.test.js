const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Import the component under test
const ExploreView = require('../src/views/explore/view.js');
const { Charts } = ExploreView;

// Stub heavy child components used by CategoryList to keep test lightweight
jest.mock('../src/components/entities', () => {
  const ReactLocal = require('react');
  return {
    CommunityProfileCard: function CommunityProfileCardStub(props) {
      const name = props.community && props.community.name;
      return ReactLocal.createElement(
        'div',
        { 'data-testid': 'community-card' },
        name || 'CommunityCard'
      );
    },
  };
});

jest.mock('../shared/graphql/queries/community/getCommunities', () => {
  // Provide a HOC that injects predictable communities data
  return {
    getCommunitiesBySlug: Component => props => {
      const ReactLocal = require('react');
      const mockCommunities = [
        { id: '1', slug: 'spectrum', name: 'Spectrum' },
        { id: '2', slug: 'react', name: 'React' },
        { id: '3', slug: 'codesandbox', name: 'CodeSandbox' },
      ];
      const injected = {
        data: { communities: mockCommunities },
        isLoading: false,
      };
      return ReactLocal.createElement(Component, { ...props, ...injected });
    },
  };
});

jest.mock('../src/components/withCurrentUser', () => {
  // Pass-through HOC
  return {
    withCurrentUser: Component => props =>
      React.createElement(Component, props),
  };
});

jest.mock('../src/components/viewNetworkHandler', () => {
  // Pass-through HOC
  return Component => props => React.createElement(Component, props);
});

jest.mock('../src/components/segmentedControl', () => {
  const ReactLocal = require('react');
  // Render simple clickable buttons instead of styled segments
  return {
    SegmentedControl: ({ children }) =>
      ReactLocal.createElement(
        'div',
        { 'data-testid': 'segmented-control' },
        children
      ),
    Segment: ({ isActive, onClick, children }) =>
      ReactLocal.createElement(
        'button',
        {
          'data-testid': isActive ? 'segment-active' : 'segment',
          onClick,
        },
        children
      ),
  };
});

// Provide a minimal root element for scroll behavior in componentDidMount/componentDidUpdate
beforeEach(() => {
  const main = document.createElement('div');
  main.id = 'main';
  // jsdom doesn't implement scrollTop fully, but property presence is enough
  Object.defineProperty(main, 'scrollTop', { writable: true, value: 0 });
  document.body.appendChild(main);
});

afterEach(() => {
  const main = document.getElementById('main');
  if (main) main.remove();
});

test('CollectionSwitcher renders segments and switches active view', () => {
  render(React.createElement(Charts));

  // There should be a segmented control with multiple segments from collections
  const control = screen.getByTestId('segmented-control');
  expect(control).toBeInTheDocument();

  // Active segment should exist initially (default is top-communities-by-members)
  const active = screen.getByTestId('segment-active');
  expect(active).toBeInTheDocument();
  expect(active).toHaveTextContent('Top Communities');

  // Cards for filtered communities should render
  const cardsBefore = screen.getAllByTestId('community-card');
  expect(cardsBefore.length).toBeGreaterThan(0);

  // Click a different segment (e.g., Design)
  const segments = screen.getAllByTestId('segment');
  const designButton = segments.find(el => el.textContent === 'Design');
  expect(designButton).toBeTruthy();
  fireEvent.click(designButton);

  // After click, active segment should change to Design
  const newActive = screen.getByTestId('segment-active');
  expect(newActive).toHaveTextContent('Design');

  // Cards should still render (filtered by design slugs)
  const cardsAfter = screen.getAllByTestId('community-card');
  expect(cardsAfter.length).toBeGreaterThan(0);
});
