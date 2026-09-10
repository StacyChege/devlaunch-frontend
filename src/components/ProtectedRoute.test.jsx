import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from '../context/AuthContext';

function renderGuarded(ctx, { requiredRole } = {}) {
  return render(
    <AuthContext.Provider value={ctx}>
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route path="/login" element={<div>login page</div>} />
          <Route path="/dashboard" element={<div>dashboard page</div>} />
          <Route
            path="/secret"
            element={
              <ProtectedRoute requiredRole={requiredRole}>
                <div>secret content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

const base = { user: null, isAuthenticated: false, isLoading: false };

describe('ProtectedRoute', () => {
  it('shows a spinner while auth is still loading', () => {
    const { container } = renderGuarded({ ...base, isLoading: true });
    expect(screen.queryByText('secret content')).not.toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    renderGuarded(base);
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('secret content')).not.toBeInTheDocument();
  });

  it('renders children when authenticated and no role is required', () => {
    renderGuarded({ ...base, isAuthenticated: true, user: { role: 'DEVELOPER' } });
    expect(screen.getByText('secret content')).toBeInTheDocument();
  });

  it('redirects to /dashboard when the role does not match', () => {
    renderGuarded(
      { ...base, isAuthenticated: true, user: { role: 'DEVELOPER' } },
      { requiredRole: 'ADMIN' }
    );
    expect(screen.getByText('dashboard page')).toBeInTheDocument();
    expect(screen.queryByText('secret content')).not.toBeInTheDocument();
  });

  it('renders children when the required role matches', () => {
    renderGuarded(
      { ...base, isAuthenticated: true, user: { role: 'ADMIN' } },
      { requiredRole: 'ADMIN' }
    );
    expect(screen.getByText('secret content')).toBeInTheDocument();
  });
});
