import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import VivaLogo from '../components/VivaLogo';
import '../styles/Login.css';

const Login = () => {
  const { signInWithGoogle, isLoading } = useAuth();
  const buttonRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [initError, setInitError] = useState('');

  const returnParamName = import.meta.env.VITE_GOOGLE_REDIRECT_RETURN_PARAM?.trim() || '';
  const allowedReturnOriginsConfig =
    import.meta.env.VITE_GOOGLE_REDIRECT_ALLOWED_RETURN_ORIGINS?.trim() || '';

  const resolveAllowedReturnOrigins = useCallback(() => {
    if (typeof window === 'undefined' || !allowedReturnOriginsConfig) {
      return [];
    }

    return allowedReturnOriginsConfig
      .split(',')
      .map((entry) =>
        entry
          .trim()
          .replaceAll(/\{\{\s*ORIGIN\s*\}\}/gi, window.location.origin)
      )
      .filter(Boolean);
  }, [allowedReturnOriginsConfig]);

  const isAllowedReturnTarget = useCallback(
    (targetUrl) => {
      if (!targetUrl) {
        return false;
      }

      const allowedOrigins = resolveAllowedReturnOrigins();
      const currentOrigin = window.location.origin;

      try {
        const parsedTarget = new URL(targetUrl);
        const targetOrigin = parsedTarget.origin;

        if (targetOrigin === currentOrigin) {
          return true;
        }

        const targetHostname = parsedTarget.hostname.toLowerCase();
        const targetProtocol = parsedTarget.protocol.replace(':', '').toLowerCase();

        return allowedOrigins.some((pattern) => {
          if (pattern === '*') {
            return true;
          }

          const normalizedPattern = pattern.toLowerCase();
          let scheme = '';
          let hostPattern = normalizedPattern;

          if (hostPattern.startsWith('https://')) {
            scheme = 'https';
            hostPattern = hostPattern.slice('https://'.length);
          } else if (hostPattern.startsWith('http://')) {
            scheme = 'http';
            hostPattern = hostPattern.slice('http://'.length);
          }

          if (hostPattern.startsWith('*.')) {
            const domain = hostPattern.slice(2);
            const matchesHost =
              targetHostname === domain || targetHostname.endsWith(`.${domain}`);

            if (!matchesHost) {
              return false;
            }

            if (scheme && scheme !== targetProtocol) {
              return false;
            }

            return true;
          }

          if (!scheme && !hostPattern.includes('/')) {
            return targetHostname === hostPattern;
          }

          try {
            const patternUrl = new URL(pattern);
            return patternUrl.origin.toLowerCase() === targetOrigin.toLowerCase();
          } catch (error) {
            return false;
          }
        });
      } catch (error) {
        console.warn('Ogiltig return-url', error);
        return false;
      }
    },
    [resolveAllowedReturnOrigins]
  );

  const resolveConfiguredRedirect = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const configuredRedirect = import.meta.env.VITE_GOOGLE_REDIRECT_URI?.trim();
    const currentOrigin = window.location.origin;
    const replacements = {
      ORIGIN: currentOrigin,
      RETURN_TO: encodeURIComponent(window.location.href),
    };

    let loginRedirectUri = currentOrigin + window.location.pathname;

    if (configuredRedirect) {
      const substitutedRedirect = configuredRedirect.replaceAll(
        /\{\{\s*(ORIGIN|RETURN_TO)\s*\}\}/gi,
        (_match, token) => replacements[token.toUpperCase()] ?? ''
      );

      try {
        const redirectUrl = new URL(substitutedRedirect, currentOrigin);
        loginRedirectUri = redirectUrl.toString();
      } catch (error) {
        console.error('Invalid VITE_GOOGLE_REDIRECT_URI', error);
        setInitError('Ogiltig VITE_GOOGLE_REDIRECT_URI.');
        return null;
      }
    }

    if (!loginRedirectUri.endsWith('/') && window.location.pathname === '/') {
      loginRedirectUri = `${loginRedirectUri}/`;
    }

    return loginRedirectUri;
  }, []);

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

    let isMounted = true;

    const processRedirectCredential = async () => {
      try {
        await signInWithGoogle(redirectCredential);
      } finally {
        if (isMounted) {
          let returnTarget = null;

          if (returnParamName) {
            const rawReturnValue = currentUrl.searchParams.get(returnParamName);

            if (rawReturnValue) {
              let decodedReturnValue = rawReturnValue;

              try {
                decodedReturnValue = decodeURIComponent(rawReturnValue);
              } catch (error) {
                console.warn('Kunde inte avkoda return-parametern', error);
              }

              if (isAllowedReturnTarget(decodedReturnValue)) {
                returnTarget = decodedReturnValue;
              } else {
                console.warn('Ignorerar otillåten return-adress', decodedReturnValue);
              }
            }
          }

          currentUrl.searchParams.delete('credential');
          currentUrl.searchParams.delete('g_csrf_token');

          if (returnParamName) {
            currentUrl.searchParams.delete(returnParamName);
          }

          const sanitizedSearch = currentUrl.searchParams.toString();
          const newUrl = `${currentUrl.pathname}${
            sanitizedSearch ? `?${sanitizedSearch}` : ''
          }${currentUrl.hash}`;

          window.history.replaceState({}, document.title, newUrl);

          if (returnTarget) {
            window.location.replace(returnTarget);
          }
        }
      }
    };

    void processRedirectCredential();

    return () => {
      isMounted = false;
    };
  }, [
    isAllowedReturnTarget,
    returnParamName,
    signInWithGoogle,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setInitError('Miljövariabeln VITE_GOOGLE_CLIENT_ID saknas.');
      return undefined;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) {
        return;
      }

      const loginRedirectUri = resolveConfiguredRedirect();

      if (!loginRedirectUri) {
        return;
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
  }, [handleCredentialResponse, resolveConfiguredRedirect]);

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
