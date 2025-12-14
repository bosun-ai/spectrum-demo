import React from 'react';
import { render, screen } from '@testing-library/react';

function Hello({ name }) {
  return <div>Hello, {name}</div>;
}

test('renders greeting', () => {
  render(<Hello name="World" />);
  expect(screen.getByText('Hello, World')).toBeInTheDocument();
});
