import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import VivaLogo from './VivaLogo';

const containerStyle = {
  backgroundColor: '#f9fafb',
  borderBottom: '1px solid #e5e7eb'
};

const innerStyle = {
  maxWidth: '896px',
  margin: '0 auto',
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  minHeight: '72px'
};

const logoStyle = {
  height: '32px',
  width: 'auto',
  color: '#1f2937'
};

const authWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const userNameStyle = {
  fontSize: '14px',
  color: '#374151'
};

const signOutButtonStyle = {
  padding: '8px 16px',
  borderRadius: '9999px',
  border: '1px solid #d1d5db',
  backgroundColor: '#ffffff',
  color: '#111827',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  fontWeight: 500
};

const Header = ({ canAccessAdmin = false, activeView = 'app', onNavigate = () => {} }) => {
  const { isAuthenticated, user, signOut, isLoading } = useAuth();

  const showAdmin = canAccessAdmin && isAuthenticated;
  const adminButtonBaseStyle = {
    ...signOutButtonStyle,
    borderColor: '#d1d5db'
  };
  const adminActiveStyle =
    activeView === 'admin'
      ? { backgroundColor: '#111827', color: '#ffffff', borderColor: '#111827' }
      : { backgroundColor: '#ffffff', color: '#111827' };

  return (
    <header style={containerStyle}>
      <div style={innerStyle}>
        <VivaLogo style={logoStyle} />

        {isAuthenticated && (
          <div style={authWrapperStyle}>
            {user?.name && <span style={userNameStyle}>{user.name}</span>}
            <div style={{ display: 'flex', gap: '8px' }}>
              {showAdmin && (
                <button
                  type="button"
                  style={{ ...adminButtonBaseStyle, ...adminActiveStyle }}
                  onClick={() => onNavigate(activeView === 'admin' ? 'app' : 'admin')}
                  disabled={isLoading}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.backgroundColor =
                      activeView === 'admin' ? '#0f172a' : '#f9fafb';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.backgroundColor =
                      activeView === 'admin' ? '#111827' : '#ffffff';
                  }}
                >
                  Admin
                </button>
              )}
              <button
                type="button"
                style={signOutButtonStyle}
                onClick={signOut}
                disabled={isLoading}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                Logga ut
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
