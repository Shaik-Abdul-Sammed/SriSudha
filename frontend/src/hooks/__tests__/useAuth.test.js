import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { AuthProvider } from '../../context/AuthContext';

jest.mock('../../services/authService', () => ({
  loginWithRole: jest.fn((credentials) => {
    return Promise.resolve({
      user: { email: credentials.email, role: 'user' },
      token: 'mock-token-' + credentials.email
    });
  })
}));

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current).toBeDefined();
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should provide login function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.login).toBe('function');
  });

  it('should provide logout function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.logout).toBe('function');
  });

  it('should handle login correctly', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password123' });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('should set user data after login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ email: 'user@example.com', password: 'pass' });
    });

    await waitFor(() => {
      expect(result.current.user).not.toBe(null);
      expect(result.current.user.email).toBe('user@example.com');
    });
  });

  it('should clear user data on logout', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    act(() => {
      result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  it('should provide token after successful login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' });
    });

    await waitFor(() => {
      expect(result.current.token).toBeTruthy();
    });
  });

  it('should provide language state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect('language' in result.current).toBe(true);
  });

  it('should provide updateLanguage function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(typeof result.current.updateLanguage).toBe('function');
  });
});
