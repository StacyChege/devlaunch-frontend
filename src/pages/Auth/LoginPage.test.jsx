import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { AuthContext } from '../../context/AuthContext';
import * as authApi from '../../api/auth';

const navigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));

vi.mock('../../api/auth', () => ({
  resendVerification: vi.fn().mockResolvedValue({}),
}));

function renderLogin(login = vi.fn()) {
  render(
    <AuthContext.Provider value={{ login }}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthContext.Provider>
  );
  return { login };
}

const fillAndSubmit = async (email, password) => {
  if (email) await userEvent.type(screen.getByPlaceholderText('you@example.com'), email);
  if (password) await userEvent.type(screen.getByPlaceholderText('Min. 8 characters'), password);
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
};

describe('LoginPage', () => {
  it('validates required fields before calling the API', async () => {
    const { login } = renderLogin();
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('rejects a malformed email', async () => {
    renderLogin();
    await fillAndSubmit('not-an-email', 'secret123');
    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
  });

  it('calls login and navigates to the dashboard on success', async () => {
    const login = vi.fn().mockResolvedValue();
    renderLogin(login);

    await fillAndSubmit('dev@example.com', 'secret123');

    await waitFor(() => expect(login).toHaveBeenCalledWith('dev@example.com', 'secret123'));
    expect(navigate).toHaveBeenCalledWith('/dashboard');
  });

  it('surfaces a generic API error', async () => {
    const login = vi.fn().mockRejectedValue({
      response: { data: { error: 'Invalid email or password' } },
    });
    renderLogin(login);

    await fillAndSubmit('dev@example.com', 'wrongpass');

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('offers a resend action when the email is not verified', async () => {
    const login = vi.fn().mockRejectedValue({
      response: { data: { code: 'email_not_verified', email: 'dev@example.com' } },
    });
    renderLogin(login);

    await fillAndSubmit('dev@example.com', 'secret123');

    expect(await screen.findByText('Verify your email to continue')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /resend it/i }));

    await waitFor(() =>
      expect(authApi.resendVerification).toHaveBeenCalledWith('dev@example.com')
    );
    expect(await screen.findByText('New link sent.')).toBeInTheDocument();
  });
});
