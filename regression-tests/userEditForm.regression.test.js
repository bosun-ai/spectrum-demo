// Regression test for src/views/userSettings/components/editForm.js UserWithData
const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Mock HOCs to identity to access composed default export
jest.mock('react-redux', () => ({ connect: () => x => x }));
jest.mock('react-router', () => ({ withRouter: x => x }));
jest.mock('react-apollo', () => ({ withApollo: x => x }));
jest.mock('shared/graphql/mutations/user/editUser', () => x => x);

// Mock toast action to avoid Redux side-effects
jest.mock('src/actions/toasts', () => ({
  addToastWithTimeout: (type, msg) => ({
    type: 'TOAST',
    payload: { type, msg },
  }),
}));

// Mock GithubProfile render-prop component to avoid external calls
jest.mock('src/components/githubProfile', () => {
  return function GithubProfileMock(props) {
    // Simulate absence of GitHub profile by returning null to render connect UI
    return props.render(null);
  };
});

// Import the composed component which renders UserWithData
const EditForm = require('src/views/userSettings/components/editForm').default;

const buildUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'Alice',
  username: 'alice',
  description: 'Hello there',
  website: 'https://example.com',
  profilePhoto: 'https://example.com/p.jpg',
  coverPhoto: 'https://example.com/c.jpg',
  email: 'alice@example.com',
  ...overrides,
});

const buildProps = ({ user = buildUser(), editUserImpl } = {}) => ({
  user,
  dispatch: jest.fn(),
  editUser:
    editUserImpl ||
    (() => Promise.resolve({ data: { editUser: { ...user } } })),
});

describe('UserWithData regression', () => {
  it('renders profile settings view, inputs, GitHub connect and save button', () => {
    const props = buildProps();
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(EditForm, props)
      )
    );

    // Location link and title
    expect(screen.getByText('Profile Settings')).toBeTruthy();
    expect(screen.getByText('Return to Profile')).toBeTruthy();

    // Inputs prefilled
    expect(screen.getByDisplayValue('Alice')).toBeTruthy();
    expect(screen.getByDisplayValue('Hello there')).toBeTruthy();
    expect(screen.getByDisplayValue('https://example.com')).toBeTruthy();
    expect(screen.getByDisplayValue('alice@example.com')).toBeTruthy();

    // GitHub connect UI present
    expect(screen.getByText('Connect your GitHub Profile')).toBeTruthy();
    expect(screen.getByText('Connect')).toBeTruthy();

    // Save button initially enabled
    const saveBtn = screen.getByText('Save');
    expect(saveBtn.closest('button')?.hasAttribute('disabled')).toBe(false);
  });

  it('validates email, shows error and disables save; then fixes and saves', async () => {
    const editUser = jest.fn(() =>
      Promise.resolve({ data: { editUser: buildUser() } })
    );
    const props = buildProps({ editUserImpl: editUser });
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(EditForm, props)
      )
    );

    const emailInput = screen.getByDisplayValue('alice@example.com');
    // Enter invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    // Click save triggers validation branch
    const saveBtn = screen.getByText('Save');
    fireEvent.click(saveBtn);

    // Error should appear and button disabled
    expect(screen.getByText('Please add a valid email address.')).toBeTruthy();
    expect(saveBtn.closest('button')?.hasAttribute('disabled')).toBe(true);

    // Fix email and save again
    fireEvent.change(emailInput, { target: { value: 'alice2@example.com' } });

    const saveBtnEnabled = screen.getByText('Save');
    expect(saveBtnEnabled.closest('button')?.hasAttribute('disabled')).toBe(
      false
    );

    fireEvent.click(saveBtnEnabled);
    await Promise.resolve();
    expect(editUser).toHaveBeenCalled();

    // Confirmation message about changed email
    expect(
      screen.getByText(
        /A confirmation email has been sent to alice2@example.com/
      )
    ).toBeTruthy();
  });
});
