const React = require('react');

function ThemeProvider(props) {
  return React.createElement('div', props);
}

function makeStyled(tag) {
  const fn = () => () => null;
  fn.withConfig = () => fn;
  return fn;
}

function styledMock() {}
styledMock.div = makeStyled('div');
styledMock.span = makeStyled('span');
styledMock.main = makeStyled('main');
styledMock.img = makeStyled('img');

module.exports = new Proxy(styledMock, {
  get: (target, prop) => {
    if (prop === 'ThemeProvider') return ThemeProvider;
    if (prop === 'createGlobalStyle') return () => () => null;
    if (prop === 'default') return styledMock;
    return styledMock[prop] || makeStyled(prop);
  },
});
