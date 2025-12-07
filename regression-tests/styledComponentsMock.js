const React = require('react');

function ThemeProvider(props) {
  return React.createElement('div', props);
}

function styledMock() {
  return 'div';
}
styledMock.div = styledMock;

module.exports = new Proxy(styledMock, {
  get: (target, prop) => {
    if (prop === 'ThemeProvider') return ThemeProvider;
    if (prop === 'createGlobalStyle') return () => () => null;
    if (prop === 'default') return styledMock;
    return styledMock;
  },
});
