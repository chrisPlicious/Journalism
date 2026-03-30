import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Mock the api module to prevent real API calls in the useEffect
vi.mock('../services/api', () => ({
  getProfile: vi.fn().mockResolvedValue({ avatarUrl: '/avatar/test.png' }),
}));

// Helper component that exposes auth context values for testing
function AuthConsumer({ onRender }: { onRender: (auth: ReturnType<typeof useAuth>) => void }) {
  const auth = useAuth();
  onRender(auth);
  return (
    <div>
      <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
      <span data-testid="username">{auth.username ?? ''}</span>
      <span data-testid="token">{auth.token ?? ''}</span>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('starts unauthenticated when no token in localStorage', () => {
    let authState: ReturnType<typeof useAuth> | undefined;

    render(
      <AuthProvider>
        <AuthConsumer onRender={(auth) => { authState = auth; }} />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(authState!.token).toBeNull();
    expect(authState!.username).toBeNull();
  });

  it('login sets user state and stores in localStorage', async () => {
    let authState: ReturnType<typeof useAuth> | undefined;

    render(
      <AuthProvider>
        <AuthConsumer onRender={(auth) => { authState = auth; }} />
      </AuthProvider>
    );

    await act(async () => {
      authState!.login('test-token', 'testuser', 'test@example.com', '/avatar.png', true);
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('true');
    expect(screen.getByTestId('username').textContent).toBe('testuser');
    expect(screen.getByTestId('token').textContent).toBe('test-token');
    expect(localStorage.getItem('token')).toBe('test-token');
    expect(localStorage.getItem('username')).toBe('testuser');
    expect(localStorage.getItem('email')).toBe('test@example.com');
  });

  it('logout clears user state and localStorage', async () => {
    let authState: ReturnType<typeof useAuth> | undefined;

    render(
      <AuthProvider>
        <AuthConsumer onRender={(auth) => { authState = auth; }} />
      </AuthProvider>
    );

    // Login first
    await act(async () => {
      authState!.login('existing-token', 'existinguser', 'existing@example.com');
    });

    // Then logout
    await act(async () => {
      authState!.logout();
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('username').textContent).toBe('');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
    expect(localStorage.getItem('email')).toBeNull();
  });

  it('login then logout then login restores state correctly', async () => {
    let authState: ReturnType<typeof useAuth> | undefined;

    render(
      <AuthProvider>
        <AuthConsumer onRender={(auth) => { authState = auth; }} />
      </AuthProvider>
    );

    // Login
    await act(async () => {
      authState!.login('token-1', 'user1', 'user1@test.com');
    });
    expect(authState!.isAuthenticated).toBe(true);
    expect(authState!.username).toBe('user1');

    // Logout
    await act(async () => {
      authState!.logout();
    });
    expect(authState!.isAuthenticated).toBe(false);

    // Login again with different credentials
    await act(async () => {
      authState!.login('token-2', 'user2', 'user2@test.com');
    });
    expect(authState!.isAuthenticated).toBe(true);
    expect(authState!.username).toBe('user2');
    expect(localStorage.getItem('token')).toBe('token-2');
  });

  it('updateUsername updates username in state and localStorage', async () => {
    let authState: ReturnType<typeof useAuth> | undefined;

    render(
      <AuthProvider>
        <AuthConsumer onRender={(auth) => { authState = auth; }} />
      </AuthProvider>
    );

    await act(async () => {
      authState!.login('token', 'oldname', 'email@test.com');
    });

    await act(async () => {
      authState!.updateUsername('newname');
    });

    expect(screen.getByTestId('username').textContent).toBe('newname');
    expect(localStorage.getItem('username')).toBe('newname');
  });
});
