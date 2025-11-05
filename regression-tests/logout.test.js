import React from 'react';
import { render, screen } from '@testing-library/react';
import Logout from '../src/views/userSettings/components/logout';
import { SERVER_URL } from '../src/api/constants';

describe('Logout component regression', () => {
  it('renders a log out button linking to server logout', () => {
    render(<Logout />);
    const link = screen.getByRole('link', { name: /log out/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `${SERVER_URL}/auth/logout`);
    expect(link).toHaveAttribute('target', '_self');
  });
});
