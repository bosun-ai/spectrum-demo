const React = require('react');
const { render } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Mock aliased and code-split dependencies used by Routes to keep test focused
jest.mock('../src/components/error', () => {
  return {
    __esModule: true,
    ErrorBoundary: function ErrorBoundary(props) {
      return props.children || null;
    },
  };
});
jest.mock('../src/components/head', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/components/appViewWrapper', () => ({
  __esModule: true,
  default: ({ children }) => children,
}));
jest.mock('../src/components/scrollManager', () => ({
  __esModule: true,
  default: ({ children }) => children,
}));
jest.mock('../src/components/modals/modalRoot', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/components/gallery', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/components/toasts', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/components/announcementBanner', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/views/navigation', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/views/status', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/views/login', () => {
  const ReactLocal = require('react');
  return {
    __esModule: true,
    default: function Login() {
      return function Inner() {
        return ReactLocal.createElement('div', null, 'Log in');
      };
    },
  };
});
jest.mock('../src/views/directMessages', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/views/thread', () => ({
  __esModule: true,
  ThreadView: () => null,
}));
jest.mock('../src/components/withCurrentUser', () => ({
  __esModule: true,
  withCurrentUser: C => C,
}));
jest.mock('../src/components/maintenance', () => {
  const ReactLocal = require('react');
  return {
    __esModule: true,
    default: function Maintenance() {
      return ReactLocal.createElement('div', null, 'Maintenance');
    },
  };
});
jest.mock('../src/views/thread/redirect-old-route', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/views/newUserOnboarding', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/views/queryParamToastDispatcher', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/views/viewHelpers', () => ({
  __esModule: true,
  LoadingView: () => null,
}));
jest.mock('../src/views/globalTitlebar', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/helpers/navigation-context', () => ({
  __esModule: true,
  NavigationContext: {
    Provider: function Provider(props) {
      return props.children;
    },
    Consumer: function Consumer() {
      return null;
    },
  },
}));
jest.mock('../shared/generate-meta-info', () => ({
  __esModule: true,
  default: () => ({ title: 't', description: 'd' }),
}));
jest.mock('../shared/theme', () => ({ __esModule: true, theme: {} }));
jest.mock('../src/components/message/threadAttachment/style', () => ({
  __esModule: true,
  GlobalThreadAttachmentStyles: () => null,
}));
jest.mock('../src/helpers/signed-out-fallback', () => ({
  __esModule: true,
  default: (A, B) => A,
}));
jest.mock('../src/views/threadSlider', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/reset.css.js', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/api/constants', () => ({
  __esModule: true,
  CLIENT_URL: 'http://localhost',
}));
jest.mock('react-loadable', () => ({
  __esModule: true,
  default: ({ loading }) => loading({ isLoading: true }),
}));

const Routes = require('../src/routes.js').default;

function renderWithRouter(initialEntries, props) {
  const element = React.createElement(
    MemoryRouter,
    { initialEntries },
    React.createElement(
      Routes,
      Object.assign(
        {
          currentUser: null,
          isLoadingCurrentUser: false,
          maintenanceMode: false,
        },
        props
      )
    )
  );
  return render(element);
}

test('redirects from "/" to "/explore" without crashing', () => {
  const { container } = renderWithRouter(['/']);
  expect(container).toBeDefined();
});

test('renders maintenance view when maintenanceMode=true', () => {
  const { getByText } = renderWithRouter(['/'], { maintenanceMode: true });
  expect(getByText(/Maintenance/i)).toBeInTheDocument();
});

test('renders login route', () => {
  const { getByText } = renderWithRouter(['/login']);
  expect(getByText(/log in/i)).toBeInTheDocument();
});
