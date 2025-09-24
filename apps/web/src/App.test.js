import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import AuthContext from './providers/AuthProvider';

const renderWithAuth = (ui, authOverrides = {}) => {
  const defaultAuthValue = {
    token: 'mock-token',
    user: { name: 'Testare' },
    isAuthenticated: true,
    isLoading: false,
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
    ...authOverrides
  };

  return render(<AuthContext.Provider value={defaultAuthValue}>{ui}</AuthContext.Provider>);
};

test('renders Viva Impact Check heading', () => {
  renderWithAuth(<App />);
  const heading = screen.getByRole('heading', { name: /viva impact check/i });
  expect(heading).toBeInTheDocument();
});

test('shows error when VITE_N8N_WEBHOOK_URL is missing', async () => {
  const originalEnv = import.meta.env.VITE_N8N_WEBHOOK_URL;
  delete import.meta.env.VITE_N8N_WEBHOOK_URL;

  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({});

  renderWithAuth(<App />);

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

  expect(screen.getByText(/VITE_N8N_WEBHOOK_URL saknas/i)).toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();

  fetchMock.mockRestore();
  import.meta.env.VITE_N8N_WEBHOOK_URL = originalEnv;
});
