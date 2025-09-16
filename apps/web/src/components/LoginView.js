import React, { useMemo, useRef, useState } from 'react';
import TurnstileWidget from './TurnstileWidget';
import { useAuth } from '../auth/AuthContext';
import styles from './LoginView.module.css';

const siteKey = process.env.REACT_APP_TURNSTILE_SITE_KEY;

const LoginView = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const widgetRef = useRef(null);

  const turnstileAvailable = useMemo(() => Boolean(siteKey), []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!turnstileAvailable) {
      setError('Turnstile är inte konfigurerat. Kontakta administratören.');
      return;
    }

    if (!turnstileToken) {
      setError('Bekräfta att du inte är en bot innan du loggar in.');
      return;
    }

    setLoading(true);
    const result = await login({ email, password, turnstileToken });
    if (!result.success) {
      setError(result.message);
      if (widgetRef.current) {
        widgetRef.current.reset();
      }
      setTurnstileToken(null);
    }
    setLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Viva Impact Login</h1>
        <p className={styles.subtitle}>Ange dina administrerade inloggningsuppgifter.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="email">
            E-postadress
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            className={styles.input}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            required
          />

          <label className={styles.label} htmlFor="password">
            Lösenord
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={styles.input}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            required
          />

          {turnstileAvailable ? (
            <TurnstileWidget
              ref={widgetRef}
              siteKey={siteKey}
              onVerify={setTurnstileToken}
              action="login"
              className={styles.turnstile}
            />
          ) : (
            <p className={styles.warning}>
              Cloudflare Turnstile saknas. Lägg till en site key i miljövariabeln
              <code>REACT_APP_TURNSTILE_SITE_KEY</code>.
            </p>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !email || !password || (turnstileAvailable && !turnstileToken)}
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
        <p className={styles.footerText}>
          Behöver du konto eller hjälp? Kontakta din Viva Impact-administratör.
        </p>
      </div>
    </div>
  );
};

export default LoginView;
