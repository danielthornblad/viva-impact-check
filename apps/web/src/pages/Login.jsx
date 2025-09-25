import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import VivaLogo from '../components/VivaLogo';
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
    if (typeof window === 'undefined') {
      return;
    }

    const currentUrl = new URL(window.location.href);
    const redirectCredential = currentUrl.searchParams.get('credential');

    if (!redirectCredential) {
      return;
    }

    signInWithGoogle(redirectCredential);

    currentUrl.searchParams.delete('credential');
    currentUrl.searchParams.delete('g_csrf_token');

    const sanitizedSearch = currentUrl.searchParams.toString();
    const newUrl = `${currentUrl.pathname}${sanitizedSearch ? `?${sanitizedSearch}` : ''}${currentUrl.hash}`;

    window.history.replaceState({}, document.title, newUrl);
  }, [signInWithGoogle]);

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

      const configuredRedirect = import.meta.env.VITE_GOOGLE_REDIRECT_URI?.trim();
      let loginRedirectUri = window.location.origin;

      if (configuredRedirect) {
        const substitutedRedirect = configuredRedirect.replaceAll(
          /\{\{\s*ORIGIN\s*\}\}/g,
          window.location.origin
        );

        try {
          const redirectUrl = new URL(substitutedRedirect, window.location.origin);
          loginRedirectUri = redirectUrl.toString();
        } catch (error) {
          console.error('Invalid VITE_GOOGLE_REDIRECT_URI', error);
          setInitError('Ogiltig VITE_GOOGLE_REDIRECT_URI.');
          return;
        }
      } else if (window.location.pathname && window.location.pathname !== '/') {
        const normalizedPath = window.location.pathname.endsWith('/')
          ? window.location.pathname.slice(0, -1)
          : window.location.pathname;

        loginRedirectUri = `${window.location.origin}${normalizedPath}`;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        ux_mode: 'redirect',
        login_uri: loginRedirectUri,
        auto_select: false,
        use_fedcm_for_prompt: true
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
    <div className="login-page">
      <div className="login-content">
        <div className="login-visual">
          <span className="login-highlight">Marknadsföring &amp; AI-analys</span>
          <h2 className="login-visual-title">
            Få en tydlig bild av hur dina annonser presterar – med insikter som leder till smartare beslut.
          </h2>
          <p className="login-visual-text">
            Viva Impact Check hjälper dig att identifiera styrkor och möjligheter i dina kampanjer så att du kan optimera budskap,
            målgrupp och kanaler.
          </p>
          <div className="login-visual-badges" aria-hidden="true">
            <span>AI-drivna rekommendationer</span>
            <span>Samlad vy för hela teamet</span>
          </div>
        </div>

        <div className="login-panel">
          <div className="login-brand">
            <VivaLogo className="login-logo" />
          </div>
          <h1 className="login-title">Logga in till VIVA Impact Check</h1>
          <p className="login-subtitle">
            Anslut med ditt Google-konto för att fortsätta till analysverktyget.
          </p>
          {initError && <div className="login-error">{initError}</div>}
          <div className="login-button" ref={buttonRef} aria-live="polite" />
          {!scriptLoaded && !initError && (
            <p className="login-helper">Förbereder Google-inloggningen...</p>
          )}
          {isLoading && <p className="login-helper">Bearbetar inloggning...</p>}
          <p className="login-contact">
            Behöver du tillgång till verktyget? Hör av dig till admin{' '}
            <a href="mailto:daniel.thornblad@vivamedia.se">här</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
