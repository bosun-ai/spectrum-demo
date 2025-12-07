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
styledMock.h1 = makeStyled('h1');
styledMock.h2 = makeStyled('h2');
styledMock.h3 = makeStyled('h3');
styledMock.h4 = makeStyled('h4');
styledMock.h5 = makeStyled('h5');
styledMock.h6 = makeStyled('h6');
styledMock.label = makeStyled('label');
styledMock.input = makeStyled('input');
styledMock.textarea = makeStyled('textarea');
styledMock.p = makeStyled('p');
styledMock.p = makeStyled('p');
styledMock.a = makeStyled('a');
styledMock.button = makeStyled('button');

module.exports = new Proxy(styledMock, {
  get: (target, prop) => {
    if (prop === 'ThemeProvider') return ThemeProvider;
    if (prop === 'css') return () => '';
    if (prop === 'keyframes') return () => '';
    if (prop === 'createGlobalStyle') return () => () => null;
    if (prop === 'default') return styledMock;
    return styledMock[prop] || makeStyled(prop);
  },
});
