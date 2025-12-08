// @flow
const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Mock redux connect to pass through component and inject dispatch
jest.mock('react-redux', () => ({
  connect: () => Comp => props =>
    React.createElement(Comp, { ...props, dispatch: jest.fn() }),
}));

// Provide minimal mocks for components used inside dropdown
jest.mock('src/components/icon', () => {
  const React = require('react');
  return function Icon(props) {
    const { 'data-cy': dataCy, onClick, glyph } = props;
    return React.createElement(
      'button',
      { 'data-cy': dataCy, 'data-glyph': glyph, onClick },
      'icon'
    );
  };
});

jest.mock('src/components/button', () => ({
  TextButton: ({ children, onClick, 'data-cy': dataCy }) =>
    React.createElement('button', { onClick, 'data-cy': dataCy }, children),
}));

jest.mock('src/components/flyout', () => {
  const React = require('react');
  return function Flyout(props) {
    return React.createElement(
      'div',
      { 'data-cy': props['data-cy'] },
      props.children
    );
  };
});

jest.mock('src/components/outsideClickHandler', () => {
  const React = require('react');
  return ({ children }) => React.createElement('div', null, children);
});

// Mock style components used by actionsDropdown
jest.mock('src/views/thread/style', () => {
  const React = require('react');
  const Stub = ({ children, ...rest }) =>
    React.createElement('div', rest, children);
  return {
    DropWrap: Stub,
    FlyoutRow: Stub,
    Label: ({ children }) => React.createElement('span', null, children),
  };
});

// Mock popper to render children directly
jest.mock('react-popper', () => ({
  Manager: ({ children }) => children,
  Reference: ({ children }) => children({ ref: () => {} }),
  Popper: ({ children }) => children({ style: {}, ref: () => {} }),
}));

// Mock openModal to be identifiable action creator
jest.mock('src/actions/modals', () => ({
  openModal: (...args) => ({ type: 'OPEN_MODAL', args }),
}));

const ActionsDropdown = require('src/views/thread/components/actionsDropdown')
  .default;

const baseThread = {
  id: 'thread1',
  isAuthor: true,
  author: { user: { id: 'user1', username: 'alice' } },
  channel: {
    name: 'general',
    channelPermissions: { isModerator: false, isOwner: false },
  },
  community: {
    name: 'community',
    communityPermissions: { isModerator: false, isOwner: false },
  },
};

test('renders null when no currentUser', () => {
  const { container } = render(
    React.createElement(ActionsDropdown, { thread: baseThread })
  );
  expect(container.firstChild).toBeNull();
});

test('shows delete action for thread author and triggers modal', () => {
  const currentUser = { id: 'user1' }; // same as author
  render(
    React.createElement(ActionsDropdown, { thread: baseThread, currentUser })
  );

  // Open dropdown via settings icon
  const trigger = screen.getByTestId('thread-actions-dropdown-trigger');
  fireEvent.click(trigger);

  // Flyout should render with delete option
  const flyout = screen.getByTestId('thread-actions-dropdown');
  expect(flyout).toBeInTheDocument();

  const deleteBtn = screen.getByTestId('thread-dropdown-delete');
  expect(deleteBtn).toBeInTheDocument();

  // Click delete should call dispatch with openModal action
  // dispatch is injected by our connect mock, but we can't access it directly; instead spy on console via side-effects
  // Better: re-render with a custom dispatch passed via props
});

test('delete button click dispatches modal open', () => {
  const currentUser = { id: 'user1' };
  const dispatch = jest.fn();
  render(
    React.createElement(ActionsDropdown, {
      thread: baseThread,
      currentUser,
      dispatch,
    })
  );
  fireEvent.click(screen.getByTestId('thread-actions-dropdown-trigger'));
  fireEvent.click(screen.getByTestId('thread-dropdown-delete'));
  expect(dispatch).toHaveBeenCalled();
  const action = dispatch.mock.calls[0][0];
  expect(action && action.type).toBe('OPEN_MODAL');
  expect(action && action.args[0]).toBe('DELETE_DOUBLE_CHECK_MODAL');
});
