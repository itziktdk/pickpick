'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, login: async () => ({}), register: async () => ({}), logout: () => {}, token: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('pickpick_token');
    if (saved) {
      setToken(saved);
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${saved}` } })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => setUser(data.user))
        .catch(() => { localStorage.removeItem('pickpick_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error };
      localStorage.setItem('pickpick_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return {};
    } catch {
      return { error: 'שגיאה בהתחברות' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error };
      localStorage.setItem('pickpick_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return {};
    } catch {
      return { error: 'שגיאה בהרשמה' };
    }
  };

  const logout = () => {
    localStorage.removeItem('pickpick_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
