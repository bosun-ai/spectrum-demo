import React from 'react';
import { render, screen } from '@testing-library/react';
import CommunityMembersSettings from '../src/views/communityMembers';

// Minimal wrapper props to render the settings view
const baseProps = {
  currentUser: { id: 'u1' },
  dispatch: jest.fn(),
  match: {},
  history: {},
};

describe('CommunityMembersSettings regression', () => {
  it('renders ErrorView when no community provided', () => {
    render(<CommunityMembersSettings {...baseProps} community={null} />);
    // ErrorView renders a fallback role heading text; assert presence by generic text
    // We expect no "Community Members" heading when community is missing
    expect(screen.queryByText(/community members/i)).not.toBeInTheDocument();
  });

  it('renders members view when community id exists', () => {
    const community = {
      id: 'c1',
      metaData: { members: 5 },
    };
    render(<CommunityMembersSettings {...baseProps} community={community} />);
    // Heading comes from inner CommunityMembers component
    expect(screen.getByText(/community members · 5/i)).toBeInTheDocument();
    // Filter tabs should be visible
    expect(screen.getByText(/members/i)).toBeInTheDocument();
    expect(screen.getByText(/team/i)).toBeInTheDocument();
  });
});
