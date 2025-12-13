// Regression test for CommunityMeta component rendering
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { CommunityMeta } from '../src/components/entities/profileCards/components/communityMeta';

describe('CommunityMeta', () => {
  const baseCommunity = {
    id: 'community-1',
    name: 'Spectrum Community',
    slug: 'spectrum',
    description:
      'Welcome to the **Spectrum** community! Visit [docs](https://example.com/docs).',
    website: 'example.com',
  };

  it('renders name linked to community slug', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CommunityMeta community={baseCommunity} />
      </MemoryRouter>
    );
    const nameHeading = getByText(/Spectrum Community/i);
    expect(nameHeading.closest('a')).toHaveAttribute('href', '/spectrum');
  });

  it('renders description with markdown links', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CommunityMeta community={baseCommunity} />
      </MemoryRouter>
    );
    const docsLink = getByText(/docs/i).closest('a');
    expect(docsLink).toBeInTheDocument();
    expect(docsLink).toHaveAttribute('href', 'https://example.com/docs');
  });

  it('renders website link with protocol normalization', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CommunityMeta community={baseCommunity} />
      </MemoryRouter>
    );
    const websiteLink = getByText(/example.com/i).closest('a');
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink).toHaveAttribute('href', 'https://example.com');
  });

  it('omits description and website when not provided', () => {
    const minimal = { id: 'c2', name: 'Minimal', slug: 'minimal' };
    const { queryByText } = render(
      <MemoryRouter>
        <CommunityMeta community={minimal} />
      </MemoryRouter>
    );
    expect(queryByText(/docs/i)).toBeNull();
    expect(queryByText(/example.com/i)).toBeNull();
    const nameHeading = queryByText(/Minimal/i);
    expect(nameHeading && nameHeading.closest('a')).toHaveAttribute(
      'href',
      '/minimal'
    );
  });
});
