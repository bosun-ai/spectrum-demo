// Regression test for the Routes component
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Routes from 'src/routes';

describe('Routes regression', () => {
  it('renders the explore page at /explore', async () => {
    // Render the Routes component inside a MemoryRouter starting at /explore
    const { findByTestId } = render(
      <MemoryRouter initialEntries={['/explore']}>
        <Routes />
      </MemoryRouter>
    );
    // The explore page should have data-cy="explore-page" according to cypress and impl
    // Prefer getByTestId for reliability, but if not available, fallback to getByTestId
    const explorePage = await findByTestId('explore-page');
    expect(explorePage).toBeInTheDocument();
  });
});
