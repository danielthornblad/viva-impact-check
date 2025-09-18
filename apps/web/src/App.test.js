import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const authenticatedResponse = {
  ok: true,
  json: async () => ({
    authenticated: true,
    user: { id: 'user-1', email: 'user@example.com', role: 'user' },
  }),
};

const unauthenticatedResponse = {
  ok: true,
  json: async () => ({ authenticated: false, user: null }),
};

afterEach(() => {
  jest.restoreAllMocks();
});

test('visar inloggningsvy när ingen session finns', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce(unauthenticatedResponse);

  render(<App />);

  expect(
    await screen.findByRole('heading', { name: /viva impact login/i })
  ).toBeInTheDocument();
});

test('shows error when REACT_APP_N8N_WEBHOOK_URL is missing', async () => {
  const originalEnv = process.env.REACT_APP_N8N_WEBHOOK_URL;
  delete process.env.REACT_APP_N8N_WEBHOOK_URL;

  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation((url) => {
    if (typeof url === 'string' && url.includes('/api/auth/me')) {
      return Promise.resolve(authenticatedResponse);
    }
    return Promise.resolve({ ok: true, json: async () => ({}) });
  });

  render(<App />);

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/me', expect.any(Object));
  });

  const fileInput = await screen.findByLabelText(/välj fil/i);
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
  expect(fetchMock).toHaveBeenCalledTimes(1);

  process.env.REACT_APP_N8N_WEBHOOK_URL = originalEnv;
});
