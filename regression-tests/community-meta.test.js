// Regression test for CommunityMeta component rendering
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
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
    render(
      <MemoryRouter>
        <CommunityMeta community={baseCommunity} />
      </MemoryRouter>
    );

    const nameLink = screen.getByRole('link', { name: /Spectrum Community/i });
    expect(nameLink).toBeInTheDocument();
    expect(nameLink).toHaveAttribute('href', '/spectrum');
  });

  it('renders description with markdown links', () => {
    render(
      <MemoryRouter>
        <CommunityMeta community={baseCommunity} />
      </MemoryRouter>
    );

    // The renderTextWithLinks helper should convert markdown link text to anchor
    const docsLink = screen.getByRole('link', { name: /docs/i });
    expect(docsLink).toBeInTheDocument();
    expect(docsLink).toHaveAttribute('href', 'https://example.com/docs');
  });

  it('renders website link with protocol normalization', () => {
    render(
      <MemoryRouter>
        <CommunityMeta community={baseCommunity} />
      </MemoryRouter>
    );

    const websiteLink = screen.getByRole('link', { name: /example.com/i });
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink).toHaveAttribute('href', 'https://example.com');
  });

  it('omits description and website when not provided', () => {
    const minimal = { id: 'c2', name: 'Minimal', slug: 'minimal' };
    render(
      <MemoryRouter>
        <CommunityMeta community={minimal} />
      </MemoryRouter>
    );

    // No extra links besides the name link
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/minimal');
  });
});
