const http = require('http');
const fetch = require('node-fetch');

const closeServer = server =>
  new Promise(resolve => {
    server.close(resolve);
  });

const listen = server =>
  new Promise(resolve => {
    server.listen(0, () => resolve(server.address().port));
  });

describe('node-fetch redirects', () => {
  it('exports the CommonJS fetch function', () => {
    expect(typeof fetch).toBe('function');
  });

  it('strips sensitive headers when redirected to another origin', async () => {
    let redirectedHeaders;
    const destination = http.createServer((request, response) => {
      redirectedHeaders = request.headers;
      response.end('ok');
    });
    const destinationPort = await listen(destination);
    const source = http.createServer((request, response) => {
      response.writeHead(302, {
        Location: `http://127.0.0.1:${destinationPort}/destination`,
      });
      response.end();
    });
    const sourcePort = await listen(source);

    try {
      const response = await fetch(`http://localhost:${sourcePort}/source`, {
        headers: {
          Authorization: 'Bearer sensitive-token',
          Cookie: 'session=sensitive-cookie',
        },
      });

      expect(await response.text()).toBe('ok');
      expect(redirectedHeaders.authorization).toBeUndefined();
      expect(redirectedHeaders.cookie).toBeUndefined();
      expect(redirectedHeaders['www-authenticate']).toBeUndefined();
      expect(redirectedHeaders.cookie2).toBeUndefined();
    } finally {
      await Promise.all([closeServer(source), closeServer(destination)]);
    }
  });
});
