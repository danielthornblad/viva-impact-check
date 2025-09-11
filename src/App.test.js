import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Viva Impact Check heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /viva impact check/i });
  expect(heading).toBeInTheDocument();
});