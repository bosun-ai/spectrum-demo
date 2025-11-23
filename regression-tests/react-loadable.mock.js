const React = require('react');
function Loadable(opts) {
  const Comp = opts && opts.loading ? opts.loading : () => null;
  return props => React.createElement(Comp, { isLoading: true, ...props });
}
Loadable.preloadReady = () => Promise.resolve();
Loadable.Map = ({ children }) => children;
module.exports = Loadable;
