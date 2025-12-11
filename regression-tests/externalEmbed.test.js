const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock styled components used by ExternalEmbed to simple DOM outputs
jest.mock('../src/components/rich-text-editor/style', () => {
  const ReactLocal = require('react');
  return {
    AspectRatio: ({ children, ...props }) =>
      ReactLocal.createElement('div', props, children),
    EmbedContainer: ({ children, ...props }) =>
      ReactLocal.createElement('div', props, children),
    EmbedComponent: props => ReactLocal.createElement('iframe', props),
  };
});

// Import renderer to access entities.embed which renders ExternalEmbed for type 'external'
const {
  createRenderer,
} = require('../shared/clients/draft-js/renderer/index.js');

function renderExternal(data) {
  const renderer = createRenderer({ headings: false });
  const element = renderer.entities.embed([], data, { key: 'k1' });
  return render(React.createElement('div', null, element));
}

test('ExternalEmbed uses url when src not provided', () => {
  const url = 'https://example.com/embedder';
  renderExternal({ type: 'external', url, width: '100%', height: 200 });
  const iframe = screen.getByTitle(`iframe-${url}`);
  expect(iframe).toBeInTheDocument();
  expect(iframe.tagName.toLowerCase()).toBe('iframe');
  expect(iframe).toHaveAttribute('src', url);
});

test('ExternalEmbed renders with aspectRatio via EmbedComponent', () => {
  const src = 'https://example.com/video';
  renderExternal({ type: 'external', src, aspectRatio: '56.25%', height: 300 });
  const iframe = screen.getByTitle(`iframe-${src}`);
  expect(iframe).toBeInTheDocument();
  expect(iframe).toHaveAttribute('src', src);
});

test('ExternalEmbed returns null for invalid src', () => {
  const renderer = createRenderer({ headings: false });
  const element = renderer.entities.embed(
    [],
    { type: 'external', src: null },
    { key: 'k2' }
  );
  // When ExternalEmbed returns null, nothing is rendered
  render(React.createElement('div', null, element));
  // queryByTitle should not find any iframe
  const result = screen.queryByTitle(/iframe-/);
  expect(result).toBeNull();
});
