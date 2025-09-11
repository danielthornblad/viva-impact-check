import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Viva Impact Check header', () => {
  render(<App />);
  const heading = screen.getByText(/Viva Impact Check/i);
  expect(heading).toBeInTheDocument();
});
