import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'viva-auth-token';

const readStoredToken = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Kunde inte läsa auth-token från storage', error);
    return null;
  }
};

const writeStoredToken = (token) => {
  try {
    if (token) {
      window.localStorage.setItem(STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Kunde inte skriva auth-token till storage', error);
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const verifyAbortRef = useRef();

  const verifyUrl = import.meta.env.VITE_AUTH_VERIFY_URL;
  const loginUrl = import.meta.env.VITE_AUTH_LOGIN_URL;
  const logoutUrl = import.meta.env.VITE_AUTH_LOGOUT_URL;

  const clearSession = useCallback(() => {
    writeStoredToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const verifyToken = useCallback(
    async (tokenToVerify, { skipLoadingUpdate = false } = {}) => {
      if (!tokenToVerify) {
        clearSession();
        if (!skipLoadingUpdate) {
          setIsLoading(false);
        }
        return null;
      }

      if (!skipLoadingUpdate) {
        setIsLoading(true);
      }

      if (verifyAbortRef.current) {
        verifyAbortRef.current.abort();
      }
      verifyAbortRef.current = new AbortController();

      try {
        if (!verifyUrl) {
          setToken(tokenToVerify);
          return null;
        }

        const response = await fetch(verifyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenToVerify}`
          },
          credentials: 'include',
          signal: verifyAbortRef.current.signal
        });

        if (!response.ok) {
          throw new Error('Tokenverifiering misslyckades');
        }

        const data = await response.json();
        setToken(tokenToVerify);
        setUser(data?.user ?? null);
        return data?.user ?? null;
      } catch (error) {
        if (error?.name === 'AbortError') {
          return null;
        }
        console.error('Verifiering av auth-token misslyckades', error);
        clearSession();
        throw error;
      } finally {
        if (!skipLoadingUpdate) {
          setIsLoading(false);
        }
      }
    },
    [clearSession, verifyUrl]
  );

  useEffect(() => {
    const bootstrapSession = async () => {
      const storedToken = readStoredToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        await verifyToken(storedToken);
      } catch (error) {
        // verifieringen tar hand om rensning
      }
    };

    bootstrapSession();

    return () => {
      if (verifyAbortRef.current) {
        verifyAbortRef.current.abort();
      }
    };
  }, [verifyToken]);

  const signInWithGoogle = useCallback(
    async (credential) => {
      if (!credential) {
        return;
      }

      if (!loginUrl) {
        console.error('Miljövariabeln VITE_AUTH_LOGIN_URL saknas.');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ credential })
        });

        if (!response.ok) {
          throw new Error('Inloggning misslyckades');
        }

        const data = await response.json();
        const authToken = data?.token;
        if (!authToken) {
          throw new Error('Backend returnerade ingen auth-token');
        }

        writeStoredToken(authToken);

        if (verifyUrl) {
          await verifyToken(authToken, { skipLoadingUpdate: true });
        } else {
          setToken(authToken);
          setUser(data?.user ?? null);
        }
      } catch (error) {
        console.error('Google-inloggningen misslyckades', error);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    },
    [clearSession, loginUrl, verifyToken, verifyUrl]
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    const currentToken = token;
    try {
      clearSession();
      if (logoutUrl) {
        try {
          const headers = new Headers();
          if (currentToken) {
            headers.set('Authorization', `Bearer ${currentToken}`);
          }
          await fetch(logoutUrl, {
            method: 'POST',
            credentials: 'include',
            headers
          });
        } catch (error) {
          console.warn('Kunde inte logga ut från backend-sessionen', error);
        }
      }
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearSession, logoutUrl, token]);

  const contextValue = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isLoading,
      signInWithGoogle,
      signOut,
      verifyToken
    }),
    [isLoading, signInWithGoogle, signOut, token, user, verifyToken]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth måste användas inom en AuthProvider');
  }
  return context;
};

export default AuthContext;
