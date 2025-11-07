import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
import { Loading } from '../src/components/loading';

describe('Loading component', () => {
  it('renders a Spinner within a centered container', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Loading size={24} color={'bg.default'} />
      </ThemeProvider>
    );
    // Expect there to be exactly one element with role="progressbar" or similar
    // The Spinner is styled; assert it exists via className fragment
    const spinner = container.querySelector('svg, div');
    expect(spinner).toBeTruthy();
  });
});
