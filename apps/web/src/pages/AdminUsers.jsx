import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import { useAuth } from '../providers/AuthProvider';

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f9fafb'
};

const mainStyle = {
  flexGrow: 1,
  maxWidth: '896px',
  margin: '0 auto',
  width: '100%',
  padding: '48px 24px 72px'
};

const sectionCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 10px 25px -12px rgba(15, 23, 42, 0.25)',
  padding: '32px',
  border: '1px solid #e5e7eb'
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: 600,
  marginBottom: '16px',
  color: '#111827'
};

const subtitleStyle = {
  fontSize: '16px',
  color: '#4b5563',
  marginBottom: '24px'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '16px'
};

const thStyle = {
  textAlign: 'left',
  fontSize: '13px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#6b7280',
  paddingBottom: '12px',
  borderBottom: '1px solid #e5e7eb'
};

const tdStyle = {
  fontSize: '15px',
  color: '#1f2937',
  padding: '16px 0',
  borderBottom: '1px solid #f3f4f6',
  verticalAlign: 'top'
};

const formRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginTop: '16px'
};

const inputStyle = {
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #d1d5db',
  fontSize: '15px'
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  color: '#374151'
};

const buttonRowStyle = {
  display: 'flex',
  gap: '12px',
  marginTop: '12px'
};

const primaryButtonStyle = {
  padding: '10px 18px',
  backgroundColor: '#111827',
  color: '#ffffff',
  borderRadius: '9999px',
  fontSize: '15px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600
};

const secondaryButtonStyle = {
  padding: '10px 18px',
  backgroundColor: '#ffffff',
  color: '#111827',
  borderRadius: '9999px',
  fontSize: '15px',
  border: '1px solid #d1d5db',
  cursor: 'pointer',
  fontWeight: 500
};

const dangerButtonStyle = {
  ...secondaryButtonStyle,
  borderColor: '#fca5a5',
  color: '#b91c1c'
};

const tagStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: '9999px',
  backgroundColor: '#eef2ff',
  color: '#4338ca',
  fontSize: '12px',
  fontWeight: 600,
  marginRight: '8px',
  marginBottom: '4px'
};

const errorStyle = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  color: '#991b1b',
  padding: '12px 16px',
  borderRadius: '12px',
  marginBottom: '16px'
};

const statusStyle = {
  fontSize: '14px',
  color: '#4b5563'
};

const buildHeaders = (token) => {
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');
  return headers;
};

const AdminUsers = ({ header = null, onNavigate = () => {} }) => {
  const { token, user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [editDraft, setEditDraft] = useState({ displayName: '', roles: [] });
  const [newAccount, setNewAccount] = useState({ email: '', displayName: '', roles: [] });

  const baseUrl = useMemo(
    () => import.meta.env.VITE_ADMIN_ACCOUNTS_URL || '/api/admin/accounts',
    []
  );

  const loadAccounts = useCallback(async () => {
    if (!token) {
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(baseUrl, {
        headers: buildHeaders(token)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || response.statusText || 'Kunde inte hämta användare');
      }
      setAccounts(Array.isArray(data.accounts) ? data.accounts : []);
      setAvailableRoles(Array.isArray(data.availableRoles) ? data.availableRoles : []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    if (!user?.roles?.includes('admin')) {
      onNavigate('app');
    }
  }, [user, onNavigate]);

  const resetForm = () => {
    setNewAccount({ email: '', displayName: '', roles: [] });
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    if (!token) {
      return;
    }
    setIsMutating(true);
    setErrorMessage('');
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: buildHeaders(token),
        body: JSON.stringify({
          email: newAccount.email,
          displayName: newAccount.displayName || null,
          roles: newAccount.roles
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Kunde inte skapa konto');
      }
      if (data.account) {
        setAccounts((previous) => [...previous, data.account]);
      }
      resetForm();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsMutating(false);
    }
  };

  const beginEditAccount = (account) => {
    setEditingAccountId(account.id);
    setEditDraft({
      displayName: account.displayName || '',
      roles: Array.isArray(account.roles) ? [...account.roles] : []
    });
  };

  const cancelEdit = () => {
    setEditingAccountId(null);
    setEditDraft({ displayName: '', roles: [] });
  };

  const persistAccountChanges = async (accountId, payload) => {
    if (!token) {
      return null;
    }
    setIsMutating(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${baseUrl}/${accountId}`, {
        method: 'PUT',
        headers: buildHeaders(token),
        body: JSON.stringify({
          displayName: payload.displayName || null,
          roles: payload.roles
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Kunde inte uppdatera konto');
      }
      if (data.account) {
        setAccounts((previous) =>
          previous.map((account) => (account.id === data.account.id ? data.account : account))
        );
      }
      return data.account;
    } catch (error) {
      setErrorMessage(error.message);
      return null;
    } finally {
      setIsMutating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingAccountId) {
      return;
    }
    const updated = await persistAccountChanges(editingAccountId, editDraft);
    if (updated) {
      cancelEdit();
    }
  };

  const handleRoleToggle = async (account, role) => {
    const roles = new Set(account.roles || []);
    if (roles.has(role)) {
      roles.delete(role);
    } else {
      roles.add(role);
    }
    await persistAccountChanges(account.id, {
      displayName: account.displayName,
      roles: Array.from(roles)
    });
  };

  const handleDeleteAccount = async (accountId) => {
    if (!token) {
      return;
    }
    setIsMutating(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${baseUrl}/${accountId}`, {
        method: 'DELETE',
        headers: new Headers({ Authorization: `Bearer ${token}` })
      });
      if (!response.ok && response.status !== 204) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || response.statusText || 'Kunde inte ta bort konto');
      }
      setAccounts((previous) => previous.filter((account) => account.id !== accountId));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div style={containerStyle}>
      {header}
      <main style={mainStyle}>
        <div style={sectionCardStyle}>
          <h1 style={titleStyle}>Administrera användare</h1>
          <p style={subtitleStyle}>
            Hantera vilka Google-konton som kan logga in på Viva Impact och vilka roller de
            har tilldelats.
          </p>

          {errorMessage && <div style={errorStyle}>{errorMessage}</div>}

          <form onSubmit={handleCreateAccount} style={formRowStyle}>
            <div>
              <label htmlFor="admin-email" style={checkboxLabelStyle}>
                <span>E-postadress</span>
              </label>
              <input
                id="admin-email"
                type="email"
                required
                placeholder="anvandare@example.com"
                style={inputStyle}
                value={newAccount.email}
                onChange={(event) =>
                  setNewAccount((previous) => ({ ...previous, email: event.target.value }))
                }
                disabled={isMutating}
              />
            </div>

            <div>
              <label htmlFor="admin-display-name" style={checkboxLabelStyle}>
                <span>Visningsnamn (valfritt)</span>
              </label>
              <input
                id="admin-display-name"
                type="text"
                style={inputStyle}
                value={newAccount.displayName}
                onChange={(event) =>
                  setNewAccount((previous) => ({ ...previous, displayName: event.target.value }))
                }
                disabled={isMutating}
              />
            </div>

            {availableRoles.length > 0 && (
              <div>
                <span style={{ ...checkboxLabelStyle, paddingLeft: '2px' }}>Tilldela roller</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
                  {availableRoles.map((role) => {
                    const checked = newAccount.roles.includes(role);
                    return (
                      <label key={role} style={checkboxLabelStyle}>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={isMutating}
                          onChange={() =>
                            setNewAccount((previous) => ({
                              ...previous,
                              roles: checked
                                ? previous.roles.filter((value) => value !== role)
                                : [...previous.roles, role]
                            }))
                          }
                        />
                        {role}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={buttonRowStyle}>
              <button type="submit" style={primaryButtonStyle} disabled={isMutating}>
                Lägg till användare
              </button>
              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={resetForm}
                disabled={isMutating}
              >
                Rensa
              </button>
            </div>
          </form>

          <div style={{ marginTop: '40px' }}>
            <h2 style={{ ...titleStyle, fontSize: '20px', marginBottom: '12px' }}>Tillåtna konton</h2>
            <p style={statusStyle}>
              {isLoading
                ? 'Laddar lista...'
                : `Totalt ${accounts.length} konto${accounts.length === 1 ? '' : 'n'}`}
            </p>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Konto</th>
                  <th style={thStyle}>Visningsnamn</th>
                  <th style={thStyle}>Roller</th>
                  <th style={thStyle}>Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  const isEditing = editingAccountId === account.id;
                  return (
                    <tr key={account.id}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600 }}>{account.email}</div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          Skapad {new Date(account.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        {isEditing ? (
                          <input
                            type="text"
                            style={inputStyle}
                            value={editDraft.displayName}
                            onChange={(event) =>
                              setEditDraft((previous) => ({
                                ...previous,
                                displayName: event.target.value
                              }))
                            }
                            disabled={isMutating}
                          />
                        ) : (
                          <span>{account.displayName || '—'}</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {isEditing ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {availableRoles.map((role) => {
                              const checked = editDraft.roles.includes(role);
                              return (
                                <label key={role} style={checkboxLabelStyle}>
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    disabled={isMutating}
                                    onChange={() =>
                                      setEditDraft((previous) => ({
                                        ...previous,
                                        roles: checked
                                          ? previous.roles.filter((value) => value !== role)
                                          : [...previous.roles, role]
                                      }))
                                    }
                                  />
                                  {role}
                                </label>
                              );
                            })}
                          </div>
                        ) : account.roles?.length ? (
                          account.roles.map((role) => (
                            <span key={role} style={tagStyle}>
                              {role}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: '#6b7280' }}>Inga roller</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {isEditing ? (
                          <div style={buttonRowStyle}>
                            <button
                              type="button"
                              style={primaryButtonStyle}
                              onClick={handleSaveEdit}
                              disabled={isMutating}
                            >
                              Spara
                            </button>
                            <button
                              type="button"
                              style={secondaryButtonStyle}
                              onClick={cancelEdit}
                              disabled={isMutating}
                            >
                              Avbryt
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                              type="button"
                              style={secondaryButtonStyle}
                              onClick={() => beginEditAccount(account)}
                              disabled={isMutating}
                            >
                              Redigera
                            </button>
                            <button
                              type="button"
                              style={dangerButtonStyle}
                              onClick={() => handleDeleteAccount(account.id)}
                              disabled={isMutating}
                            >
                              Ta bort
                            </button>
                            {availableRoles.includes('admin') && (
                              <button
                                type="button"
                                style={secondaryButtonStyle}
                                onClick={() => handleRoleToggle(account, 'admin')}
                                disabled={isMutating}
                              >
                                {account.roles?.includes('admin') ? 'Ta bort admin' : 'Gör till admin'}
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {accounts.length === 0 && !isLoading && (
                  <tr>
                    <td style={{ ...tdStyle, color: '#6b7280' }} colSpan={4}>
                      Ingen användare har lagts till ännu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminUsers;
