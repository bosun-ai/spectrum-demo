import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

// Import renderer factory
import { createRenderer } from '../shared/clients/draft-js/renderer/index.js';

// Minimal helpers to invoke renderer blocks/entities
const renderNodeArray = nodes => {
  return Array.isArray(nodes) ? nodes : [nodes];
};

test('Embed renders external iframe with src and aspect ratio', () => {
  const renderer = createRenderer({ headings: false });
  const data = {
    type: 'external',
    url: 'https://example.com/embed',
    aspectRatio: 1.7778,
    width: '100%',
    height: 300,
  };

  const element = renderer.entities.embed([], data, { key: 'k1' });
  render(element);

  // Should render an iframe with title matching src
  const frame = screen.getByTitle(/iframe-https:\/\/example.com\/embed/i);
  expect(frame).toBeInTheDocument();
  expect(frame).toHaveAttribute('src', 'https://example.com/embed');
  expect(frame).toHaveAttribute('allowFullScreen');
});

test('Embed ignores invalid external src', () => {
  const renderer = createRenderer({ headings: false });
  const data = { type: 'external', src: null };
  const element = renderer.entities.embed([], data, { key: 'k2' });
  const { container } = render(element);
  // Should render nothing
  expect(container.firstChild).toBeNull();
});

test('LINK entity renders internal Link for Spectrum URLs', () => {
  const renderer = createRenderer({ headings: false });
  const children = renderNodeArray('Go to thread');
  const data = { url: 'https://spectrum.chat/mycommunity/thread/123' };
  const element = renderer.entities.LINK(children, data, { key: 'lk1' });
  render(<MemoryRouter>{element}</MemoryRouter>);
  // It should render a react-router Link, which appears as an anchor with href
  const anchor = screen.getByText(/go to thread/i).closest('a');
  expect(anchor).toBeInTheDocument();
});
