import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext();

const fetchJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        setUser(null);
        return;
      }
      const data = await fetchJson(response);
      if (data?.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Kunde inte hämta session', error);
      setUser(null);
    } finally {
      setInitialising(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = useCallback(async ({ email, password, turnstileToken }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, turnstileToken }),
      });

      const data = await fetchJson(response);
      if (!response.ok) {
        return {
          success: false,
          message: data?.error || 'Inloggningen misslyckades. Försök igen.',
        };
      }

      if (data?.user) {
        setUser(data.user);
      }
      return { success: true };
    } catch (error) {
      console.error('Login failed', error);
      return { success: false, message: 'Tekniskt fel vid inloggning.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        console.warn('Utloggning misslyckades');
      }
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isInitialising: initialising,
    login,
    logout,
    refresh: loadSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
