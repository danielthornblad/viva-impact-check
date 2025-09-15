import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
  window.localStorage.setItem('token', 'test');
});

afterEach(() => {
  window.localStorage.clear();
});

test('renders Viva Impact Check heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /viva impact check/i });
  expect(heading).toBeInTheDocument();
});

test('shows error when REACT_APP_N8N_WEBHOOK_URL is missing', async () => {
  const originalEnv = process.env.REACT_APP_N8N_WEBHOOK_URL;
  delete process.env.REACT_APP_N8N_WEBHOOK_URL;

  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({});

  render(<App />);

  const fileInput = screen.getByLabelText(/välj fil/i);
  const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
  await userEvent.upload(fileInput, file);

  await userEvent.selectOptions(screen.getByRole('combobox'), 'Facebook/Meta');
  await userEvent.type(
    screen.getByPlaceholderText(/t\.ex\. Kvinnor 25-35, intresserade av fitness/i),
    'Test audience'
  );

  const analyzeButton = screen.getByRole('button', { name: /analysera annons/i });
  await userEvent.click(analyzeButton);

  expect(
    screen.getByText(/REACT_APP_N8N_WEBHOOK_URL saknas/i)
  ).toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();

  fetchMock.mockRestore();
  process.env.REACT_APP_N8N_WEBHOOK_URL = originalEnv;
});
