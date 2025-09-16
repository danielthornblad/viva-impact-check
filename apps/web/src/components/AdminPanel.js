import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import TurnstileWidget from './TurnstileWidget';
import styles from './AdminPanel.module.css';

const siteKey = process.env.REACT_APP_TURNSTILE_SITE_KEY;

const fetchJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
};

const ResetPasswordDialog = ({ user, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const widgetRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      setError('Bekräfta att du inte är en bot.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}/reset-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, turnstileToken: token }),
      });
      const data = await fetchJson(response);
      if (!response.ok) {
        setError(data?.error || 'Misslyckades med att uppdatera lösenordet.');
        if (widgetRef.current) {
          widgetRef.current.reset();
        }
        setToken(null);
        return;
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Tekniskt fel. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="reset-password-heading">
        <h2 id="reset-password-heading">Återställ lösenord</h2>
        <p className={styles.modalDescription}>
          Ange ett nytt starkt lösenord för <strong>{user.email}</strong>.
        </p>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="new-password">
            Nytt lösenord
          </label>
          <input
            id="new-password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            required
          />
          {siteKey ? (
            <TurnstileWidget
              ref={widgetRef}
              siteKey={siteKey}
              onVerify={setToken}
              action="reset_password"
              className={styles.turnstile}
            />
          ) : (
            <p className={styles.inlineWarning}>
              Cloudflare Turnstile saknas. Lägg till en site key för att kunna återställa lösenord.
            </p>
          )}
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.modalActions}>
            <button type="button" className={styles.secondaryButton} onClick={onClose} disabled={loading}>
              Avbryt
            </button>
            <button type="submit" className={styles.primaryButton} disabled={loading || !password}>
              {loading ? 'Sparar...' : 'Uppdatera'}
            </button>
          </div>
        </form>
        <p className={styles.passwordHint}>
          Minst 12 tecken med stora och små bokstäver, siffra samt specialtecken krävs.
        </p>
      </div>
    </div>
  );
};

const AdminPanel = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createState, setCreateState] = useState({ email: '', password: '', role: 'user' });
  const [createToken, setCreateToken] = useState(null);
  const [createError, setCreateError] = useState('');
  const [savingUser, setSavingUser] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const widgetRef = useRef(null);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await fetchJson(response);
      if (!response.ok) {
        setError(data?.error || 'Kunde inte hämta användare.');
        setUsers([]);
        return;
      }
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      setError('Kunde inte hämta användare.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setCreateError('');
    if (!createToken) {
      setCreateError('Bekräfta att du inte är en bot.');
      return;
    }
    setSavingUser(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: createState.email,
          password: createState.password,
          role: createState.role,
          turnstileToken: createToken,
        }),
      });
      const data = await fetchJson(response);
      if (!response.ok) {
        setCreateError(data?.error || 'Kunde inte skapa användare.');
        if (widgetRef.current) {
          widgetRef.current.reset();
        }
        setCreateToken(null);
        return;
      }
      setCreateState({ email: '', password: '', role: 'user' });
      if (widgetRef.current) {
        widgetRef.current.reset();
      }
      setCreateToken(null);
      await loadUsers();
    } catch (err) {
      console.error(err);
      setCreateError('Tekniskt fel vid skapande.');
    } finally {
      setSavingUser(false);
    }
  };

  const handleToggleUser = async (targetUser, action) => {
    try {
      const response = await fetch(`/api/admin/users/${targetUser.id}/toggle`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      const data = await fetchJson(response);
      if (!response.ok) {
        alert(data?.error || 'Misslyckades med att uppdatera status.');
        return;
      }
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert('Tekniskt fel vid uppdatering av status.');
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Administrationspanel</h1>
          <p className={styles.headerSubtitle}>Hantera användare och åtkomst.</p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.loggedInUser}>Inloggad som {user?.email}</span>
          <button className={styles.secondaryButton} onClick={onClose}>
            Tillbaka till verktyget
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logga ut
          </button>
        </div>
      </header>

      <section className={styles.section}>
        <h2>Skapa användare</h2>
        {!siteKey && (
          <p className={styles.warning}>
            Cloudflare Turnstile saknas. Lägg till en site key i miljövariabeln
            <code>REACT_APP_TURNSTILE_SITE_KEY</code> för att kunna skapa användare.
          </p>
        )}
        <form className={styles.createForm} onSubmit={handleCreateUser}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="create-email">
              E-postadress
            </label>
            <input
              id="create-email"
              type="email"
              className={styles.input}
              value={createState.email}
              onChange={(event) => setCreateState((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="create-password">
              Tilldelat lösenord
            </label>
            <input
              id="create-password"
              type="password"
              className={styles.input}
              value={createState.password}
              onChange={(event) => setCreateState((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="create-role">
              Roll
            </label>
            <select
              id="create-role"
              className={styles.select}
              value={createState.role}
              onChange={(event) => setCreateState((prev) => ({ ...prev, role: event.target.value }))}
            >
              <option value="user">Användare</option>
              <option value="admin">Administratör</option>
            </select>
          </div>
          {siteKey ? (
            <TurnstileWidget
              ref={widgetRef}
              siteKey={siteKey}
              onVerify={setCreateToken}
              action="admin_create_user"
              className={styles.turnstile}
            />
          ) : (
            <p className={styles.inlineWarning}>
              Turnstile måste konfigureras för att verifiera skapandet.
            </p>
          )}
          {createError && <p className={styles.error}>{createError}</p>}
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={savingUser || !createState.email || !createState.password || !createToken}
          >
            {savingUser ? 'Skapar...' : 'Skapa användare'}
          </button>
        </form>
        <p className={styles.passwordHint}>
          Rekommendation: använd lösenordsgenerator och dela genom säker kanal.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Befintliga användare</h2>
        {error && <p className={styles.error}>{error}</p>}
        {loading ? (
          <p>Laddar användare...</p>
        ) : users.length === 0 ? (
          <p>Inga användare hittades.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>E-post</th>
                  <th>Roll</th>
                  <th>Status</th>
                  <th>Senast inloggad</th>
                  <th>Aktiva sessioner</th>
                  <th>Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.id}>
                    <td>{item.email}</td>
                    <td>{item.role === 'admin' ? 'Admin' : 'Användare'}</td>
                    <td>
                      <span
                        className={
                          item.isActive ? styles.statusActive : styles.statusInactive
                        }
                      >
                        {item.isActive ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td>{item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleString() : 'Aldrig'}</td>
                    <td>{item.activeSessions}</td>
                    <td className={styles.actionsCell}>
                      <button
                        className={styles.secondaryButton}
                        onClick={() => setResetUser(item)}
                      >
                        Återställ lösenord
                      </button>
                      <button
                        className={styles.secondaryButton}
                        onClick={() =>
                          handleToggleUser(item, item.isActive ? 'disable' : 'enable')
                        }
                        disabled={item.id === user?.id}
                      >
                        {item.isActive ? 'Inaktivera' : 'Aktivera'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {resetUser && (
        <ResetPasswordDialog
          user={resetUser}
          onClose={() => setResetUser(null)}
          onSuccess={loadUsers}
        />
      )}
    </div>
  );
};

export default AdminPanel;
