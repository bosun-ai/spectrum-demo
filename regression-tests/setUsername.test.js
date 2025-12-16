const React = require('react');
const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require('@testing-library/react');

// Mock apollo and redux HOCs to render plain component behavior
jest.mock('react-apollo', () => ({
  withApollo: comp => comp,
  graphql: () => comp => comp,
}));
jest.mock('react-redux', () => ({ connect: () => comp => comp }));

// Mock UsernameSearch to call validation quickly and render an input
jest.mock('src/components/usernameSearch', () => {
  return function UsernameSearchMock(props) {
    const React2 = require('react');
    const [val, setVal] = React2.useState(props.username || '');
    React2.useEffect(() => {
      // simulate initial validation success for available username
      if (val)
        props.onValidationResult({
          error: '',
          success: 'That username is available!',
          username: val,
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return React2.createElement('input', {
      'data-cy': props.dataCy,
      placeholder: props.placeholder,
      autoFocus: props.autoFocus,
      defaultValue: val,
      onChange: e => {
        const next = e.target.value;
        setVal(next);
        // emit validation result mirroring component contract
        props.onValidationResult({
          error: next
            ? ''
            : 'Be sure to set a username so that people can find you!',
          success: next ? 'That username is available!' : '',
          username: next,
        });
      },
    });
  };
});

// Import the component under test (HOCs are mocked above)
const SetUsername = require('../src/views/newUserOnboarding/components/setUsername')
  .default;

function setup(overrides = {}) {
  const editUser = jest.fn(() => Promise.resolve());
  const save = jest.fn();
  const dispatch = jest.fn();
  const user = overrides.user || { name: 'Jane Doe' };
  const props = { editUser, save, dispatch, client: {}, user };
  render(React.createElement(SetUsername, props));
  return { editUser, save, dispatch };
}

test.skip('renders and saves an available username', async () => {
  const { editUser, save } = setup();

  // initial suggestion from user.name should appear
  const input = screen.getByPlaceholderText('Your username...');
  expect(input).toHaveAttribute('data-cy', 'username-search');

  // success message should be shown from validation
  await waitFor(() =>
    expect(screen.getByTestId('username-search-success')).toBeInTheDocument()
  );
  expect(screen.getByTestId('username-search-success')).toHaveTextContent(
    'That username is available!'
  );

  // save enabled and triggers editUser with current username
  const saveBtn = screen.getByTestId('save-username-button');
  expect(saveBtn).toBeEnabled();
  fireEvent.click(saveBtn);

  await waitFor(() => expect(editUser).toHaveBeenCalled());
  expect(save).toHaveBeenCalled();
});

test.skip('disables save when username invalid and shows error', async () => {
  setup();
  const input = screen.getByPlaceholderText('Your username...');

  // clear input to trigger invalid state
  fireEvent.change(input, { target: { value: '' } });

  await waitFor(() =>
    expect(screen.getByTestId('username-search-error')).toBeInTheDocument()
  );
  expect(screen.getByTestId('username-search-error')).toHaveTextContent(
    'Be sure to set a username'
  );

  const saveBtn = screen.getByTestId('save-username-button');
  expect(saveBtn).toBeDisabled();
});
