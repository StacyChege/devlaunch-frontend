import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from './AuthContext';
import useAuth from '../hooks/useAuth';
import * as authApi from '../api/auth';

vi.mock('../api/auth', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  fetchMe: vi.fn(),
  verifyEmail: vi.fn(),
}));

const SESSION = {
  user: { id: 1, email: 'dev@example.com', full_name: 'Dev', role: 'DEVELOPER', is_verified: true },
  access: 'access-token',
  refresh: 'refresh-token',
};

function Harness() {
  const { user, isAuthenticated, isLoading, login, logout, register, verifyEmail } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authed">{String(isAuthenticated)}</span>
      <span data-testid="email">{user?.email ?? ''}</span>
      <button onClick={() => login('dev@example.com', 'pw')}>login</button>
      <button onClick={logout}>logout</button>
      <button onClick={() => register('Dev', 'dev@example.com', 'pw', 'pw')}>register</button>
      <button onClick={() => verifyEmail('tok')}>verify</button>
    </div>
  );
}

const renderAuth = () =>
  render(
    <AuthProvider>
      <Harness />
    </AuthProvider>
  );

describe('AuthContext', () => {
  it('starts unauthenticated and stops loading when no token is stored', async () => {
    renderAuth();
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('authed')).toHaveTextContent('false');
    expect(authApi.fetchMe).not.toHaveBeenCalled();
  });

  it('rehydrates from a stored token via fetchMe', async () => {
    localStorage.setItem('accessToken', 'stored');
    authApi.fetchMe.mockResolvedValue({ data: SESSION.user });

    renderAuth();

    await waitFor(() => expect(screen.getByTestId('authed')).toHaveTextContent('true'));
    expect(screen.getByTestId('email')).toHaveTextContent('dev@example.com');
  });

  it('clears a stale token when fetchMe rejects', async () => {
    localStorage.setItem('accessToken', 'stale');
    localStorage.setItem('refreshToken', 'stale');
    authApi.fetchMe.mockRejectedValue(new Error('401'));

    renderAuth();

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('authed')).toHaveTextContent('false');
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('login stores both tokens and sets the user', async () => {
    authApi.loginUser.mockResolvedValue({ data: SESSION });
    renderAuth();
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));

    await userEvent.click(screen.getByText('login'));

    await waitFor(() => expect(screen.getByTestId('authed')).toHaveTextContent('true'));
    expect(localStorage.getItem('accessToken')).toBe('access-token');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
    expect(screen.getByTestId('email')).toHaveTextContent('dev@example.com');
  });

  it('logout clears tokens and state', async () => {
    authApi.loginUser.mockResolvedValue({ data: SESSION });
    renderAuth();
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    await userEvent.click(screen.getByText('login'));
    await waitFor(() => expect(screen.getByTestId('authed')).toHaveTextContent('true'));

    await userEvent.click(screen.getByText('logout'));

    expect(screen.getByTestId('authed')).toHaveTextContent('false');
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('register does not authenticate the user (email verification pending)', async () => {
    authApi.registerUser.mockResolvedValue({ data: { message: 'check your email' } });
    renderAuth();
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));

    await userEvent.click(screen.getByText('register'));

    expect(authApi.registerUser).toHaveBeenCalledWith('Dev', 'dev@example.com', 'pw', 'pw');
    expect(screen.getByTestId('authed')).toHaveTextContent('false');
  });

  it('verifyEmail signs the user in with the returned tokens', async () => {
    authApi.verifyEmail.mockResolvedValue({ data: SESSION });
    renderAuth();
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));

    await userEvent.click(screen.getByText('verify'));

    await waitFor(() => expect(screen.getByTestId('authed')).toHaveTextContent('true'));
    expect(authApi.verifyEmail).toHaveBeenCalledWith('tok');
    expect(localStorage.getItem('accessToken')).toBe('access-token');
  });
});
