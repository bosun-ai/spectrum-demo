/**
 * Regression test for ActionsDropdown component
 * Ensures delete action visibility and trigger behavior remain stable.
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// We import the unconnected component via default export which is composed
// with withCurrentUser and connect(). For regression, we need currentUser,
// so we'll mock withCurrentUser HOC to simply pass through props.
jest.mock('src/components/withCurrentUser', () => ({
  withCurrentUser: C => C,
}));

// Mock react-redux connect to pass through dispatch
jest.mock('react-redux', () => ({ connect: () => C => C }));

// Mock openModal action and capture calls
jest.mock('src/actions/modals', () => {
  const mockFn = jest.fn(() => ({ type: 'OPEN_MODAL' }));
  return {
    openModal: (...args) => mockFn(...args),
    __esModule: true,
    _mock: { openModal: mockFn },
  };
});

// Mock UI components used inside dropdown to simplify rendering
jest.mock('src/components/flyout', () => ({
  __esModule: true,
  default: ({ children, ...props }) => (
    <div data-testid="flyout" {...props}>
      {children}
    </div>
  ),
}));
jest.mock('src/components/outsideClickHandler', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
jest.mock('src/components/icon', () => ({
  __esModule: true,
  default: ({ glyph, onClick, ...props }) => (
    <button onClick={onClick} {...props}>
      {glyph}
    </button>
  ),
}));
jest.mock('src/components/button', () => ({
  TextButton: ({ onClick, children, ...props }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock thread style exports used by ActionsDropdown to avoid styled-components tree
jest.mock('src/views/thread/style', () => ({
  FlyoutRow: ({ children, ...props }) => (
    <div data-testid="flyout-row" {...props}>
      {children}
    </div>
  ),
  DropWrap: ({ children, ...props }) => (
    <div data-testid="drop-wrap" {...props}>
      {children}
    </div>
  ),
  Label: ({ children, ...props }) => <span {...props}>{children}</span>,
}));

// Popper and Manager/Reference can be passthrough to avoid positioning complexity
jest.mock('react-popper', () => ({
  Manager: ({ children }) => <div>{children}</div>,
  Reference: ({ children }) => children({ ref: () => {} }),
  Popper: ({ children }) => children({ style: {}, ref: () => {} }),
}));

import ActionsDropdown from 'src/views/thread/components/actionsDropdown';
import modalsModule from 'src/actions/modals';

const baseThread = {
  id: 'thread-1',
  author: { user: { id: 'user-1' } },
  channel: {
    name: 'General',
    channelPermissions: { isModerator: false, isOwner: false },
  },
  community: {
    name: 'Acme',
    communityPermissions: { isModerator: false, isOwner: false },
  },
  isAuthor: true,
};

describe('ActionsDropdown regression', () => {
  test('does not render when no currentUser', () => {
    const { container } = render(<ActionsDropdown thread={baseThread} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders trigger when user can delete (author)', () => {
    render(
      <ActionsDropdown
        thread={baseThread}
        currentUser={{ id: 'user-1' }}
        dispatch={jest.fn()}
      />
    );
    expect(screen.getByText('settings')).toBeInTheDocument();
  });

  test('opens flyout and shows delete button on trigger click', () => {
    render(
      <ActionsDropdown
        thread={baseThread}
        currentUser={{ id: 'user-1' }}
        dispatch={jest.fn()}
      />
    );
    // Trigger open
    fireEvent.click(screen.getByText('settings'));
    // Flyout present
    expect(screen.getByTestId('flyout')).toBeInTheDocument();
    // Delete button rendered
    expect(screen.getByText('Delete')).toBeInTheDocument();
    // Also confirm data-cy hooks exist
    expect(screen.getByTestId('flyout')).toHaveAttribute(
      'data-cy',
      'thread-actions-dropdown'
    );
    expect(screen.getByText('settings')).toHaveAttribute(
      'data-cy',
      'thread-actions-dropdown-trigger'
    );
  });

  test('clicking delete dispatches openModal with expected payload', () => {
    const dispatch = jest.fn();
    render(
      <ActionsDropdown
        thread={baseThread}
        currentUser={{ id: 'user-1' }}
        dispatch={dispatch}
      />
    );
    fireEvent.click(screen.getByText('settings'));
    fireEvent.click(screen.getByText('Delete'));

    expect(modalsModule._mock.openModal).toHaveBeenCalledTimes(1);
    const [modalType, payload] = modalsModule._mock.openModal.mock.calls[0];
    expect(modalType).toBe('DELETE_DOUBLE_CHECK_MODAL');
    expect(payload).toMatchObject({
      id: baseThread.id,
      entity: 'thread',
      extraProps: { thread: baseThread },
    });
    expect(typeof payload.message).toBe('string');
  });

  test('does not render when user lacks delete permissions', () => {
    const thread = {
      ...baseThread,
      author: { user: { id: 'other' } },
      isAuthor: false,
    };
    const { container } = render(
      <ActionsDropdown
        thread={thread}
        currentUser={{ id: 'user-1' }}
        dispatch={jest.fn()}
      />
    );
    // No trigger should be rendered
    expect(container.firstChild).toBeNull();
  });
});
