import React, { useEffect, useMemo, useState } from 'react';

const defaultFormState = {
  email: '',
  displayName: '',
  roles: 'admin',
  isActive: true,
};

const PageLayout = ({ children, onNavigate }) => (
  <div style={{ minHeight: '100vh', backgroundColor: '#0b1120', color: '#f8fafc' }}>
    <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(148, 163, 184, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Administrera Google-konton</h1>
        <p style={{ margin: 0, marginTop: '4px', color: '#cbd5f5', fontSize: '14px' }}>
          Hantera vilka Google-konton som kan logga in i Viva Impact samt deras roller.
        </p>
      </div>
      <button
        type="button"
        onClick={() => (onNavigate ? onNavigate('/') : (window.location.href = '/'))}
        style={{
          background: 'transparent',
          color: '#cbd5f5',
          border: '1px solid rgba(148, 163, 184, 0.5)',
          borderRadius: '9999px',
          padding: '8px 18px',
          cursor: 'pointer',
        }}
      >
        Till startsidan
      </button>
    </div>
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px' }}>{children}</div>
  </div>
);

const StatusBanner = ({ tone = 'info', message }) => {
  if (!message) {
    return null;
  }
  const background = tone === 'error' ? 'rgba(248, 113, 113, 0.1)' : tone === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(125, 211, 252, 0.1)';
  const borderColor = tone === 'error' ? 'rgba(248, 113, 113, 0.4)' : tone === 'success' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(125, 211, 252, 0.4)';
  return (
    <div style={{
      marginBottom: '16px',
      padding: '12px 16px',
      borderRadius: '12px',
      background,
      border: `1px solid ${borderColor}`,
      color: '#e2e8f0',
      fontSize: '14px',
    }}>
      {message}
    </div>
  );
};

const AccountTable = ({ accounts, onEdit, onDeactivate, busy }) => {
  if (!accounts.length) {
    return (
      <div style={{
        padding: '32px',
        borderRadius: '16px',
        border: '1px dashed rgba(148, 163, 184, 0.3)',
        textAlign: 'center',
        color: '#cbd5f5',
      }}>
        Ingen användare har lagts till ännu.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(148, 163, 184, 0.3)' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead style={{ background: 'rgba(148, 163, 184, 0.08)' }}>
          <tr>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', color: '#cbd5f5' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', color: '#cbd5f5' }}>Namn</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', color: '#cbd5f5' }}>Roller</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', color: '#cbd5f5' }}>Status</th>
            <th style={{ width: '180px' }} />
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={account.id} style={{ background: index % 2 === 0 ? 'rgba(15, 23, 42, 0.6)' : 'rgba(15, 23, 42, 0.45)' }}>
              <td style={{ padding: '12px 16px', fontSize: '14px', color: '#f8fafc', borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>{account.email}</td>
              <td style={{ padding: '12px 16px', fontSize: '14px', color: '#e2e8f0', borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>{account.displayName || '—'}</td>
              <td style={{ padding: '12px 16px', fontSize: '14px', color: '#cbd5f5', borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
                {account.roles.length ? account.roles.join(', ') : '—'}
              </td>
              <td style={{ padding: '12px 16px', fontSize: '14px', color: account.isActive ? '#4ade80' : '#f87171', borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
                {account.isActive ? 'Aktiv' : 'Inaktiv'}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
                <button
                  type="button"
                  onClick={() => onEdit(account)}
                  style={{
                    marginRight: '12px',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(148, 163, 184, 0.6)',
                    background: 'transparent',
                    color: '#cbd5f5',
                    cursor: 'pointer',
                  }}
                >
                  Redigera
                </button>
                <button
                  type="button"
                  disabled={!account.isActive || busy}
                  onClick={() => onDeactivate(account)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(248, 113, 113, 0.6)',
                    background: account.isActive ? 'rgba(248, 113, 113, 0.1)' : 'transparent',
                    color: account.isActive ? '#fca5a5' : 'rgba(248, 113, 113, 0.4)',
                    cursor: account.isActive && !busy ? 'pointer' : 'not-allowed',
                  }}
                >
                  Avaktivera
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminUsers = ({ onNavigate }) => {
  const [status, setStatus] = useState('loading');
  const [accounts, setAccounts] = useState([]);
  const [session, setSession] = useState(null);
  const [formState, setFormState] = useState(defaultFormState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const adminRole = useMemo(() => {
    const roles = session?.account?.roles || [];
    return roles.includes('admin');
  }, [session]);

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session', { credentials: 'include' });
      if (response.status === 401) {
        setSession(null);
        setStatus('unauthenticated');
        return false;
      }
      const data = await response.json();
      if (!response.ok || !data.session) {
        setSession(null);
        setStatus('unauthenticated');
        return false;
      }
      setSession(data.session);
      if (!(data.session.account?.roles || []).includes('admin')) {
        setStatus('forbidden');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to read session', err);
      setError('Kunde inte läsa sessionsinformationen. Försök igen senare.');
      setStatus('error');
      return false;
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/admin/users', { credentials: 'include' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Serverfel');
      }
      setAccounts(data.accounts || []);
      setStatus('ready');
    } catch (err) {
      console.error('Failed to load accounts', err);
      setError('Kunde inte läsa användarlistan.');
      setStatus('error');
    }
  };

  useEffect(() => {
    (async () => {
      setError('');
      setSuccess('');
      setStatus('loading');
      const hasSession = await fetchSession();
      if (hasSession) {
        await fetchAccounts();
      }
    })();
  }, []);

  const handleInputChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormState(defaultFormState);
  };

  const handleEdit = (account) => {
    setFormState({
      email: account.email,
      displayName: account.displayName || '',
      roles: account.roles.join(', '),
      isActive: account.isActive,
    });
    setSuccess('Redigerar befintligt konto. Uppdatera fälten och spara.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formState),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Kunde inte spara användaren.');
      }
      setSuccess(`Användaren ${data.account.email} har sparats.`);
      resetForm();
      await fetchAccounts();
    } catch (err) {
      console.error('Failed to save user', err);
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDeactivate = async (account) => {
    if (!account.isActive) {
      return;
    }
    const confirmed = window.confirm(`Vill du avaktivera ${account.email}?`);
    if (!confirmed) {
      return;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/admin/users?email=${encodeURIComponent(account.email)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Kunde inte avaktivera användaren.');
      }
      setSuccess(`Kontot ${account.email} är nu avaktiverat.`);
      await fetchAccounts();
    } catch (err) {
      console.error('Failed to deactivate user', err);
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' });
    setSession(null);
    setAccounts([]);
    setStatus('unauthenticated');
    if (onNavigate) {
      onNavigate('/');
    } else {
      window.location.href = '/';
    }
  };

  const handleRefresh = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Kunde inte uppdatera sessionen.');
      }
      setSession(data.session);
      setSuccess('Sessionen har uppdaterats.');
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === 'loading') {
    return (
      <PageLayout onNavigate={onNavigate}>
        <p style={{ color: '#cbd5f5' }}>Laddar admin-panelen…</p>
      </PageLayout>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <PageLayout onNavigate={onNavigate}>
        <StatusBanner tone="error" message="Du är inte inloggad. Logga in via Google och försök igen." />
        <button
          type="button"
          onClick={handleRefresh}
          style={{
            padding: '10px 20px',
            borderRadius: '9999px',
            border: 'none',
            background: '#6366f1',
            color: '#f8fafc',
            cursor: 'pointer',
          }}
        >
          Försök igen
        </button>
      </PageLayout>
    );
  }

  if (status === 'forbidden' || !adminRole) {
    return (
      <PageLayout onNavigate={onNavigate}>
        <StatusBanner tone="error" message="Du saknar administratörsbehörighet." />
        <button
          type="button"
          onClick={handleSignOut}
          style={{
            padding: '10px 20px',
            borderRadius: '9999px',
            border: 'none',
            background: '#f87171',
            color: '#f8fafc',
            cursor: 'pointer',
          }}
        >
          Logga ut
        </button>
      </PageLayout>
    );
  }

  if (status === 'error') {
    return (
      <PageLayout onNavigate={onNavigate}>
        <StatusBanner tone="error" message={error || 'Ett okänt fel inträffade.'} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => {
              setStatus('loading');
              setError('');
              setSuccess('');
              fetchSession().then((hasSession) => {
                if (hasSession) {
                  fetchAccounts();
                }
              });
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              border: 'none',
              background: '#6366f1',
              color: '#f8fafc',
              cursor: 'pointer',
            }}
          >
            Försök igen
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              border: '1px solid rgba(148, 163, 184, 0.4)',
              background: 'transparent',
              color: '#cbd5f5',
              cursor: 'pointer',
            }}
          >
            Logga ut
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout onNavigate={onNavigate}>
      <StatusBanner tone="success" message={success} />
      <StatusBanner tone="error" message={error} />

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: '32px',
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '8px' }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            required
            placeholder="namn@example.com"
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              background: 'rgba(15, 23, 42, 0.7)',
              color: '#f8fafc',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '8px' }}>
            Visningsnamn
          </label>
          <input
            type="text"
            name="displayName"
            value={formState.displayName}
            onChange={handleInputChange}
            placeholder="Anna Admin"
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              background: 'rgba(15, 23, 42, 0.7)',
              color: '#f8fafc',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '8px' }}>
            Roller (kommaseparerade)
          </label>
          <input
            type="text"
            name="roles"
            value={formState.roles}
            onChange={handleInputChange}
            placeholder="admin, reviewer"
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              background: 'rgba(15, 23, 42, 0.7)',
              color: '#f8fafc',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
            <input
              type="checkbox"
              name="isActive"
              checked={formState.isActive}
              onChange={handleInputChange}
            />
            Aktivt konto
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
          <button
            type="submit"
            disabled={busy}
            style={{
              padding: '12px 20px',
              borderRadius: '9999px',
              border: 'none',
              background: busy ? 'rgba(99, 102, 241, 0.6)' : '#6366f1',
              color: '#f8fafc',
              cursor: busy ? 'wait' : 'pointer',
            }}
          >
            Spara användare
          </button>
          <button
            type="button"
            onClick={resetForm}
            disabled={busy}
            style={{
              padding: '12px 20px',
              borderRadius: '9999px',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              background: 'transparent',
              color: '#cbd5f5',
              cursor: busy ? 'not-allowed' : 'pointer',
            }}
          >
            Nollställ
          </button>
        </div>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Tillåtna konton</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={handleRefresh}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              background: 'transparent',
              color: '#cbd5f5',
              cursor: 'pointer',
            }}
          >
            Uppdatera session
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: '1px solid rgba(248, 113, 113, 0.6)',
              background: 'transparent',
              color: '#fca5a5',
              cursor: 'pointer',
            }}
          >
            Logga ut
          </button>
        </div>
      </div>

      <AccountTable accounts={accounts} onEdit={handleEdit} onDeactivate={handleDeactivate} busy={busy} />
    </PageLayout>
  );
};

export default AdminUsers;
