// @flow
// This takes the ./routes.js file and makes it hot reload.
// This should only be used on the client, not on the server!
import Routes from './routes';

// React 17 no longer uses react-hot-loader; CRA's fast refresh
// handles HMR in dev. Export plain Routes.
export default Routes;
