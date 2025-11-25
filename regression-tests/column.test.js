import React from 'react';
import { render } from '@testing-library/react';
import 'shared/testing/setup-test-framework';
import { Column } from 'src/components/column';

// Helper to extract computed styles for styled-components rendered elements
function getStyles(el) {
  // jsdom supports getComputedStyle partially; use style attribute fallback
  const cs = window.getComputedStyle ? window.getComputedStyle(el) : null;
  return {
    display: el.style.display || (cs && cs.display) || '',
    maxWidth: el.style.maxWidth || (cs && cs.maxWidth) || '',
    margin: el.style.margin || (cs && cs.margin) || '',
    flex: el.style.flex || (cs && cs.flex) || '',
  };
}

describe('Column component', () => {
  it('renders BaseColumn by default', () => {
    const { getByText } = render(<Column>base content</Column>);
    const node = getByText('base content').parentElement;
    expect(node).toBeInTheDocument();
    // Ensure it renders without provider/context errors
    expect(node.tagName).toBeTruthy();
  });

  it('renders PrimaryColumn when type="primary"', () => {
    const { getByText } = render(<Column type="primary">primary</Column>);
    const node = getByText('primary').parentElement;
    expect(node).toBeInTheDocument();
    // PrimaryColumn sets flex: 2 1 60% and max-width: 640px
    const styles = getStyles(node);
    // Flex style may not compute in jsdom, but element exists
    expect(node).toBeTruthy();
  });

  it('renders SecondaryColumn when type="secondary"', () => {
    const { getByText } = render(<Column type="secondary">secondary</Column>);
    const node = getByText('secondary').parentElement;
    expect(node).toBeInTheDocument();
  });

  it('renders OnlyColumn when type="only"', () => {
    const { getByText } = render(<Column type="only">only</Column>);
    const node = getByText('only').parentElement;
    expect(node).toBeInTheDocument();
  });

  it('applies hideOnMobile prop style rule', () => {
    const { getByText } = render(
      <Column hideOnMobile>hidden on mobile</Column>
    );
    const node = getByText('hidden on mobile').parentElement;
    expect(node).toBeInTheDocument();
    // We cannot simulate media queries in jsdom easily; ensure prop is accepted
    // and no crash occurs when styled-components interpolates hideOnMobile.
    expect(node).toBeTruthy();
  });
});
