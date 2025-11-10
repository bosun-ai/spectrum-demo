import React from 'react';
import { render, screen } from '@testing-library/react';

// Import ExternalEmbed by requiring the module and grabbing the named export
// The component is defined in shared/clients/draft-js/renderer/index.js
// as a const ExternalEmbed = (...) and used internally. We'll import it directly.
const RendererModule = require('../shared/clients/draft-js/renderer/index.js');
const { ExternalEmbed } = RendererModule;

// Sanity check: ensure component exists; if not, fail fast to highlight import issues
if (!ExternalEmbed) {
  throw new Error('ExternalEmbed export not found from renderer module');
}

test('ExternalEmbed falls back to url and renders iframe with container', () => {
  const url = 'https://example.com/embed';
  render(<ExternalEmbed url={url} height={150} />);

  const iframe = screen.getByTitle(`iframe-${url}`);
  expect(iframe).toBeInTheDocument();
  expect(iframe).toHaveAttribute('src', url);
  expect(iframe).toHaveAttribute('allowFullScreen');
  expect(iframe).toHaveAttribute('frameBorder', '0');

  // Height should be applied to the container wrapper style
  const container = iframe.parentElement;
  expect(container).toBeInTheDocument();
  expect(container.tagName.toLowerCase()).toBe('div');
  // style.height is a string (e.g., '150px') when applied inline via React
  expect(container.style.height).toBe('150px');
});

test('ExternalEmbed uses AspectRatio + EmbedComponent when aspectRatio provided', () => {
  const src = 'https://player.example.com/video';
  const ratio = '16:9';
  const height = 240;

  render(
    <ExternalEmbed src={src} aspectRatio={ratio} height={height} width="100%" />
  );

  const iframe = screen.getByTitle(`iframe-${src}`);
  expect(iframe).toBeInTheDocument();
  expect(iframe).toHaveAttribute('src', src);

  // The immediate wrapper should be the styled AspectRatio div
  const embedComponentWrapper = iframe.parentElement; // styled(EmbedComponent) wrapper
  const aspectWrapper =
    embedComponentWrapper && embedComponentWrapper.parentElement; // AspectRatio wraps EmbedComponent
  expect(aspectWrapper).toBeInTheDocument();
  expect(aspectWrapper.style.height).toBe(`${height}px`);
});

test('ExternalEmbed returns null when src/url missing', () => {
  const { container } = render(<ExternalEmbed />);
  // No iframe should be rendered
  expect(container.querySelector('iframe')).toBeNull();
});
