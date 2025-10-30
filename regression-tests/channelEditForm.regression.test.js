// Regression test for src/views/channelSettings/components/editForm.js ChannelWithData
const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Mock HOCs to return identity components so we can import inner class composition output
jest.mock('react-redux', () => ({ connect: () => x => x }));
jest.mock('react-router', () => ({ withRouter: x => x }));
jest.mock('shared/graphql/mutations/channel/deleteChannel', () => x => x);
jest.mock('shared/graphql/mutations/channel/editChannel', () => x => x);

// Import the composed default export which ultimately renders ChannelWithData
const EditForm = require('src/views/channelSettings/components/editForm')
  .default;

const buildChannel = (overrides = {}) => ({
  id: 'channel-1',
  name: 'General',
  slug: 'general',
  description: 'Welcome to General',
  isPrivate: false,
  community: { slug: 'community', name: 'Community', isPrivate: false },
  ...overrides,
});

const buildProps = ({ channel = buildChannel(), editChannelImpl } = {}) => ({
  channel,
  dispatch: jest.fn(),
  editChannel:
    editChannelImpl ||
    (() => Promise.resolve({ data: { editChannel: channel } })),
});

describe('ChannelWithData regression', () => {
  it('renders section, link, inputs and save button', () => {
    const props = buildProps();
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(EditForm, props)
      )
    );

    // Title and view link
    expect(screen.getByText('Channel Settings')).toBeTruthy();
    expect(screen.getByText('View Channel')).toBeTruthy();

    // Inputs prefilled
    const nameInput = screen.getByDisplayValue('General');
    expect(nameInput).toBeTruthy();
    const descInput = screen.getByDisplayValue('Welcome to General');
    expect(descInput).toBeTruthy();

    // Save button enabled initially
    const saveBtn = screen.getByText('Save');
    expect(saveBtn).toBeTruthy();
    expect(saveBtn.closest('button')?.hasAttribute('disabled')).toBe(false);
  });

  it('disables save when invalid characters entered, re-enables on valid input and calls editChannel', async () => {
    const editChannel = jest.fn(() =>
      Promise.resolve({ data: { editChannel: buildChannel() } })
    );
    const props = buildProps({ editChannelImpl: editChannel });
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(EditForm, props)
      )
    );

    const nameInput = screen.getByDisplayValue('General');
    // Type invalid name with spaces (triggers nameError)
    fireEvent.change(nameInput, {
      target: { id: 'name', value: 'Invalid Name' },
    });

    const saveBtnLoadingOrSave = screen.getByText('Save');
    expect(
      saveBtnLoadingOrSave.closest('button')?.hasAttribute('disabled')
    ).toBe(true);
    expect(screen.getByText(/invalid characters/i)).toBeTruthy();

    // Fix the name to be valid
    fireEvent.change(nameInput, {
      target: { id: 'name', value: 'valid-name' },
    });

    // Save becomes enabled
    const saveBtn = screen.getByText('Save');
    expect(saveBtn.closest('button')?.hasAttribute('disabled')).toBe(false);

    // Click save triggers mutation
    fireEvent.click(saveBtn);

    // Wait microtask queue for promise resolution
    await Promise.resolve();
    expect(editChannel).toHaveBeenCalled();
  });

  it('shows general notice when slug is general', () => {
    const props = buildProps({ channel: buildChannel({ slug: 'general' }) });
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(EditForm, props)
      )
    );
    expect(
      screen.getByText(/The General channel is the default channel/)
    ).toBeTruthy();
  });
});
