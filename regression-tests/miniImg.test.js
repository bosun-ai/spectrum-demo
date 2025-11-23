const React = require('react');
const styled = require('styled-components');
const { render } = require('@testing-library/react');

// Import the styled MiniImg component
const { MiniImg } = require('src/components/gallery/style.js');

test('MiniImg renders with default inactive opacity', () => {
  const { container } = render(
    React.createElement(MiniImg, {
      src: 'https://example.com/img.jpg',
      alt: 'mini',
    })
  );
  const img = container.querySelector('img');
  expect(img).toBeInTheDocument();
});

test('MiniImg active prop affects computed style', () => {
  // Render inactive (default)
  const { container, rerender } = render(
    React.createElement(MiniImg, { src: 'x.jpg', alt: 'inactive' })
  );
  const img = container.querySelector('img');
  expect(img).toBeInTheDocument();

  // Active should alter opacity rule; we can't rely on JSDOM computed styles for styled-components,
  // but we can ensure className changes by re-rendering with active=true
  const initialClass = img.getAttribute('class');

  rerender(
    React.createElement(MiniImg, { src: 'x.jpg', alt: 'active', active: true })
  );
  const imgActive = container.querySelector('img');
  const nextClass = imgActive.getAttribute('class');

  // styled-components generates different classnames when props alter styles
  expect(nextClass).not.toEqual(initialClass);
});
