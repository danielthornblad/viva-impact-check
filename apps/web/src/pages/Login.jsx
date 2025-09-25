import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import '../styles/Login.css';

const Login = () => {
  const { signInWithGoogle, isLoading } = useAuth();
  const buttonRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [initError, setInitError] = useState('');

  const handleCredentialResponse = useCallback(
    (response) => {
      if (response?.credential) {
        signInWithGoogle(response.credential);
      }
    },
    [signInWithGoogle]
  );

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setInitError('Miljövariabeln VITE_GOOGLE_CLIENT_ID saknas.');
      return undefined;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        ux_mode: 'popup',
        auto_select: false
      });

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '320',
          text: 'continue_with',
          type: 'standard'
        });
      }

      window.google.accounts.id.prompt();
      setScriptLoaded(true);
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return undefined;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = () => setInitError('Kunde inte ladda Google Identity Services.');
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [handleCredentialResponse]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Logga in</h1>
        <p className="login-subtitle">
          Anslut med ditt Google-konto för att fortsätta till analysverktyget.
        </p>
        {initError && <div className="login-error">{initError}</div>}
        <div className="login-button" ref={buttonRef} aria-live="polite" />
        {!scriptLoaded && !initError && (
          <p className="login-helper">Förbereder Google-inloggningen...</p>
        )}
        {isLoading && <p className="login-helper">Bearbetar inloggning...</p>}
      </div>
    </div>
  );
};

export default Login;
