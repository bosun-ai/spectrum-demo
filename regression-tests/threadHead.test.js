// @flow
const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock Head to render children and expose props to query
jest.mock('src/components/head', () => {
  const ReactLocal = require('react');
  return function HeadMock(props) {
    return ReactLocal.createElement(
      'div',
      {
        'data-testid': 'head',
        'data-title': props.title,
        'data-description': props.description,
        'data-type': props.type,
        'data-image': props.image,
      },
      props.children
    );
  };
});

// Mock getThreadLink to a predictable path
jest.mock('src/helpers/get-thread-link', () => {
  return function getThreadLink(thread) {
    const slug =
      thread && thread.content && thread.content.slug
        ? thread.content.slug
        : 'thread-slug';
    return `/thread/${slug}`;
  };
});

// Mock generateMetaInfo to return fixed title/description
jest.mock('shared/generate-meta-info', () => {
  return function generateMetaInfo({ data }) {
    const base = data && data.title ? data.title : 'Untitled';
    return { title: `${base} • Spectrum`, description: `Discuss: ${base}` };
  };
});

const ThreadHead = require('src/views/thread/components/threadHead').default;

const baseThread = {
  metaImage: 'https://cdn.example.com/img.png',
  type: 'DRAFT',
  community: { id: 'c1', name: 'General', noindex: false, redirect: false },
  content: { title: 'Hello world', body: 'Body', slug: 'hello-world' },
  createdAt: new Date('2020-01-02T03:04:05.000Z').getTime(),
  modifiedAt: new Date('2020-02-03T04:05:06.000Z').getTime(),
  author: { user: { id: 'u1', username: 'jane' } },
};

describe('ThreadHead', () => {
  test('renders meta tags and canonical link', () => {
    render(React.createElement(ThreadHead, { thread: baseThread }));

    // Head wrapper rendered with computed props
    const head = screen.getByTestId('head');
    expect(head).toBeInTheDocument();
    expect(head.getAttribute('data-title')).toBe('Hello world • Spectrum');
    expect(head.getAttribute('data-description')).toBe('Discuss: Hello world');
    expect(head.getAttribute('data-type')).toBe('article');
    expect(head.getAttribute('data-image')).toBe(
      'https://cdn.example.com/img.png'
    );

    // Canonical link uses getThreadLink
    const canonical = screen.getByRole('link', { name: '' });
    expect(canonical).toBeInTheDocument();
    expect(canonical.getAttribute('rel')).toBe('canonical');
    expect(canonical.getAttribute('href')).toBe(
      'https://spectrum.chat/thread/hello-world'
    );

    // Twitter card when metaImage is present
    const twitter = document.querySelector('meta[name="twitter:card"]');
    expect(twitter).toBeTruthy();
    expect(twitter.getAttribute('content')).toBe('summary_large_image');

    // Published/modified time
    const published = document.querySelector(
      'meta[property="article:published_time"]'
    );
    const modified = document.querySelector(
      'meta[property="article:modified_time"]'
    );
    expect(published).toBeTruthy();
    expect(modified).toBeTruthy();
    expect(published.getAttribute('content')).toBe(
      new Date(baseThread.createdAt).toISOString()
    );
    expect(modified.getAttribute('content')).toBe(
      new Date(baseThread.modifiedAt).toISOString()
    );

    // Author and section
    const author = document.querySelector('meta[property="article:author"]');
    const section = document.querySelector('meta[property="article:section"]');
    expect(author).toBeTruthy();
    expect(author.getAttribute('content')).toBe(
      'https://spectrum.chat/users/@jane'
    );
    expect(section).toBeTruthy();
    expect(section.getAttribute('content')).toBe('General community');

    // No robots tag by default
    expect(
      document.querySelector('meta[name="robots"][content="noindex, nofollow"]')
    ).toBeNull();
  });

  test('renders robots tag when community.redirect and noindex', () => {
    const thread = {
      ...baseThread,
      community: { ...baseThread.community, redirect: true, noindex: true },
    };
    render(React.createElement(ThreadHead, { thread }));
    const robots = document.querySelector(
      'meta[name="robots"][content="noindex, nofollow"]'
    );
    expect(robots).toBeTruthy();
  });

  test('falls back modified time to createdAt when missing', () => {
    const thread = { ...baseThread, modifiedAt: null };
    render(React.createElement(ThreadHead, { thread }));
    const modified = document.querySelector(
      'meta[property="article:modified_time"]'
    );
    expect(modified).toBeTruthy();
    expect(modified.getAttribute('content')).toBe(
      new Date(baseThread.createdAt).toISOString()
    );
  });
});
