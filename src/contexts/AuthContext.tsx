import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string, phone?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bus-booking-ticket-nest-production.up.railway.app/api';
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
  };

  const register = async (email: string, password: string, name?: string, phone?: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bus-booking-ticket-nest-production.up.railway.app/api';
    console.log('API_BASE_URL', API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, phone }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

