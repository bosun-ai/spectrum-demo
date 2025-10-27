// Regression test for the Routes component
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

// Mock raw-loader import in reset.css.js to avoid Jest error
jest.mock(
  '!!raw-loader!src/components/rich-text-editor/prism-theme.css',
  () => '',
  { virtual: true }
);

import Routes from 'src/routes';

describe('Routes regression', () => {
  it('renders the explore page at /explore', async () => {
    // Render the Routes component inside a MemoryRouter starting at /explore
    const { findByTestId } = render(
      <MemoryRouter initialEntries={['/explore']}>
        <Routes />
      </MemoryRouter>
    );
    // The explore page should have data-cy="explore-page" according to implementation
    const explorePage = await findByTestId('explore-page');
    expect(explorePage).toBeInTheDocument();
  });
});
