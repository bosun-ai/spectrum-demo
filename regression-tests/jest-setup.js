// Setup for regression tests
// Extend expect with jest-dom matchers
require('@testing-library/jest-dom/extend-expect');

// Polyfill fetch in Node using cross-fetch
const fetchPoly = require('cross-fetch');
if (typeof global.fetch === 'undefined') {
  global.fetch = fetchPoly;
}

// Ensure a stable URL so localStorage is available in jsdom
if (typeof window !== 'undefined') {
  try {
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost/'),
      writable: true,
    });
  } catch (e) {}
}
