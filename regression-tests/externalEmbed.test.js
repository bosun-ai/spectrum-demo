const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock style components used by ExternalEmbed
jest.mock('src/components/rich-text-editor/style', () => {
  const ReactLocal = require('react');
  return {
    AspectRatio: ({ children, style, ratio }) =>
      ReactLocal.createElement(
        'div',
        { 'data-testid': 'aspect-ratio', style, 'data-ratio': String(ratio) },
        children
      ),
    EmbedContainer: ({ children, style }) =>
      ReactLocal.createElement(
        'div',
        { 'data-testid': 'embed-container', style },
        children
      ),
    EmbedComponent: props => ReactLocal.createElement('iframe', props),
  };
});

// Mock any router usage (not used directly in ExternalEmbed but renderer file imports Link)
jest.mock('react-router-dom', () => {
  const ReactLocal = require('react');
  return {
    Link: ({ to, children }) =>
      ReactLocal.createElement('a', { href: to }, children),
  };
});

// Require the module to access ExternalEmbed via the Embed path
// Mock styled-components usage in src/components/message/style to avoid construct errors
jest.mock('src/components/message/style', () => {
  const ReactLocal = require('react');
  return {
    Line: ({ children, className, style }) =>
      ReactLocal.createElement('div', { className, style }, children),
    Paragraph: ({ children }) => ReactLocal.createElement('p', null, children),
    BlockQuote: ({ children }) =>
      ReactLocal.createElement('blockquote', null, children),
  };
});

const RendererModule = require('../shared/clients/draft-js/renderer/index.js');

// Extract ExternalEmbed by recreating how Embed chooses
const { createRenderer } = RendererModule;

// Helper to render the entity renderer for embeds
function renderExternalEmbed(props) {
  const renderer = createRenderer({ headings: false });
  // entities.embed returns <Embed .../> which forwards to ExternalEmbed for type !== 'internal'
  // Simulate draft entity invocation contract
  const element = renderer.entities.embed([], props, { key: 'k1' });
  render(element);
}

test('renders iframe inside EmbedContainer when no aspectRatio', () => {
  renderExternalEmbed({ type: 'external', src: 'https://example.com/embed' });
  const container = screen.getByTestId('embed-container');
  expect(container).toBeInTheDocument();
  const iframe = screen.getByTitle('iframe-https://example.com/embed');
  expect(iframe).toBeInTheDocument();
  expect(iframe).toHaveAttribute('width', '100%');
  expect(iframe).toHaveAttribute('height', '200');
  expect(iframe).toHaveAttribute('src', 'https://example.com/embed');
});

test('uses url when src missing', () => {
  renderExternalEmbed({ type: 'external', url: 'https://example.com/alt' });
  const iframe = screen.getByTitle('iframe-https://example.com/alt');
  expect(iframe).toBeInTheDocument();
});

test('renders EmbedComponent within AspectRatio when aspectRatio provided', () => {
  renderExternalEmbed({
    type: 'external',
    src: 'https://player.example/video',
    aspectRatio: 0.5625,
    height: 300,
    width: '640',
  });
  const aspect = screen.getByTestId('aspect-ratio');
  expect(aspect).toBeInTheDocument();
  // height style applied to wrapper
  expect(aspect).toHaveStyle('height: 300px');
  const iframe = screen.getByTitle('iframe-https://player.example/video');
  expect(iframe).toBeInTheDocument();
  expect(iframe).toHaveAttribute('width', '640');
  expect(iframe).toHaveAttribute('height', '300');
});

test('returns null when src/url not string', () => {
  const renderer = createRenderer({ headings: false });
  const element = renderer.entities.embed(
    [],
    { type: 'external', src: null },
    { key: 'k2' }
  );
  // Render and ensure nothing is mounted
  render(element);
  // there should be no iframe or containers
  expect(screen.queryByTestId('embed-container')).toBeNull();
  expect(screen.queryByTestId('aspect-ratio')).toBeNull();
});
