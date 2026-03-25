'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { registerPasskey as registerPasskeyClient, loginWithPasskey as loginWithPasskeyClient } from '@/lib/passkey';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  loginWithPasskeyFn: (email: string) => Promise<{ error?: string }>;
  registerPasskeyFn: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, login: async () => ({}), register: async () => ({}), loginWithPasskeyFn: async () => ({}), registerPasskeyFn: async () => ({ success: false }), logout: () => {}, updateUser: () => {}, token: null,
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

  const loginWithPasskeyFn = async (email: string) => {
    try {
      const result = await loginWithPasskeyClient(email);
      if (!result) return { error: 'התחברות עם Passkey נכשלה' };
      localStorage.setItem('pickpick_token', result.token);
      setToken(result.token);
      setUser(result.user);
      return {};
    } catch {
      return { error: 'שגיאה בהתחברות עם Passkey' };
    }
  };

  const registerPasskeyFn = async () => {
    if (!token) return { success: false, error: 'לא מחובר' };
    try {
      const success = await registerPasskeyClient(token);
      return success ? { success: true } : { success: false, error: 'רישום Passkey נכשל' };
    } catch {
      return { success: false, error: 'שגיאה ברישום Passkey' };
    }
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithPasskeyFn, registerPasskeyFn, logout, updateUser, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
