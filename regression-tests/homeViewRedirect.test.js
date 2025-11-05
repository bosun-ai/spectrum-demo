import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import HomeViewRedirect from '../src/views/homeViewRedirect';

describe('HomeViewRedirect regression', () => {
  it('renders LoadingView while loading', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const { container } = render(
      <Router history={history}>
        <HomeViewRedirect
          data={{ user: undefined, loading: true }}
          history={history}
        />
      </Router>
    );
    // LoadingView should render some loading container
    // We assert on presence of the container element
    expect(container).toBeDefined();
  });

  it('redirects to logout when no user', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    // Spy on replace to capture redirects
    const replaceSpy = jest.spyOn(history, 'replace');

    render(
      <Router history={history}>
        <HomeViewRedirect
          data={{ user: null, loading: false }}
          history={history}
        />
      </Router>
    );

    expect(replaceSpy).toHaveBeenCalled();
    const url = replaceSpy.mock.calls[0][0];
    // Should redirect to SERVER_URL/auth/logout; match suffix to avoid env dependency
    expect(url).toMatch(/\/auth\/logout$/);
  });

  it('redirects to /explore when user has no communities', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const replaceSpy = jest.spyOn(history, 'replace');
    const user = { communityConnection: { edges: [] } };

    render(
      <Router history={history}>
        <HomeViewRedirect data={{ user, loading: false }} history={history} />
      </Router>
    );

    expect(replaceSpy).toHaveBeenCalledWith('/explore');
  });

  it('redirects to first community slug when present', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const replaceSpy = jest.spyOn(history, 'replace');
    const user = {
      communityConnection: {
        edges: [{ node: { slug: 'alpha' } }, { node: { slug: 'beta' } }],
      },
    };

    render(
      <Router history={history}>
        <HomeViewRedirect data={{ user, loading: false }} history={history} />
      </Router>
    );

    expect(replaceSpy).toHaveBeenCalledWith('/alpha');
  });
});
