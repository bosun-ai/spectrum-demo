const React = require('react');
const { MemoryRouter } = require('react-router');
const { render } = require('@testing-library/react');
const {
  CommunityMeta,
} = require('../../src/components/entities/profileCards/components/communityMeta');

const stubCommunity = overrides => ({
  id: '1',
  name: 'Spectrum Community',
  slug: 'spectrum',
  description: 'Build the [future](https://future.com) with @Spectrum.',
  website: 'spectrum.chat',
  ...overrides,
});

const renderWithRouter = (ui, renderOptions = {}) =>
  render(React.createElement(MemoryRouter, null, ui), renderOptions);

describe('CommunityMeta', () => {
  it('shows name, description with markdown link and website link', () => {
    const community = stubCommunity();

    const { getByText, getByRole } = renderWithRouter(
      React.createElement(CommunityMeta, { community })
    );

    expect(getByText('Spectrum Community')).toBeInTheDocument();

    const descriptionLink = getByText('future');
    expect(descriptionLink.tagName).toBe('A');
    expect(descriptionLink).toHaveAttribute('href', 'https://future.com');
    expect(descriptionLink).toHaveAttribute('target', '_blank');

    const websiteLink = getByRole('link', { name: /spectrum.chat/i });
    expect(websiteLink).toHaveAttribute('href', 'https://spectrum.chat');
    expect(websiteLink).toHaveAttribute('target', '_blank');
  });

  it('renders nothing for description and website when missing', () => {
    const community = stubCommunity({ description: null, website: null });

    const { queryByText, queryAllByRole } = renderWithRouter(
      React.createElement(CommunityMeta, { community })
    );

    expect(queryByText('Build the future with @Spectrum.')).toBeNull();
    expect(queryAllByRole('link')).toHaveLength(1); // only name link
  });
});
