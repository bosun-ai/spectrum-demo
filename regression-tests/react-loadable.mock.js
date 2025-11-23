const React = require('react');
module.exports = function Loadable(opts) {
  const Comp = opts && opts.loading ? opts.loading : () => null;
  return props => React.createElement(Comp, { isLoading: true, ...props });
};
module.exports.Map = ({ children }) => children;
