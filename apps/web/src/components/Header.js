import React from 'react';
import { useAuth } from '../providers/AuthProvider';

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
  fill: '#1f2937'
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

const Header = () => {
  const { isAuthenticated, user, signOut, isLoading } = useAuth();

  return (
    <header style={containerStyle}>
      <div style={innerStyle}>
        <svg
          alt="Viva"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2613.24 702.24"
          style={logoStyle}
        >
          <path d="M553.76,674.12L239.66,11.38c-3.24-6.95-10.26-11.38-17.93-11.38H19.85C8.87,0,0,8.93,0,19.85v61.87c0,6.82,3.44,13.17,9.2,16.81l111.36,70.47c2.65,1.65,4.9,3.97,6.48,6.68l.18.31.09.16h0c.2.33.4.73.6,1.12l243.43,513.59c3.24,6.95,10.26,11.38,17.93,11.38h146.43c14.49,0,24.02-15.02,18.06-28.12h0Z" />
          <path d="M781.22,11.35l-249.7,526.96c-6.24,13.17,3.36,28.35,17.94,28.35h146.43c7.67,0,14.65-4.42,17.94-11.35L963.59,28.35c6.24-13.17-3.36-28.35-17.94-28.35h-146.5c-7.67,0-14.65,4.42-17.94,11.35h0Z" />
          <path d="M1201.94,0h-132.34c-10.98,0-19.85,8.93-19.85,19.85v662.54c0,10.98,8.87,19.85,19.85,19.85h132.34c10.92,0,19.85-8.87,19.85-19.85V19.85c0-10.92-8.93-19.85-19.85-19.85Z" />
          <path d="M1808.4,673.38l.22.47L1494.68,11.35c-3.28-6.93-10.27-11.35-17.94-11.35h-146.51c-14.56,0-24.15,15.22-17.93,28.39l313.97,662.47c3.31,6.95,10.26,11.38,17.93,11.38h146.43c14.59,0,24.22-15.18,18-28.38l-.23-.48h0Z" />
          <path d="M2603.96,603.72l-111.36-70.47c-3.18-1.99-5.69-4.9-7.28-8.27L2241.91,11.35c-3.28-6.93-10.27-11.35-17.94-11.35h-170.8c-7.67,0-14.65,4.42-17.94,11.35l-249.7,526.96c-6.24,13.17,3.36,28.35,17.94,28.35h146.43c7.67,0,14.65-4.42,17.94-11.35l158.6-334.73c4.78-10.09,19.14-10.09,23.92,0l98.15,207.13h-90.18c-10.96,0-19.85,8.89-19.85,19.85v99.25c0,10.96,8.89,19.85,19.85,19.85h156.29l58.89,124.2c3.31,6.95,10.32,11.38,18,11.38h201.88c10.98,0,19.85-8.93,19.85-19.85v-61.87c0-6.82-3.51-13.17-9.26-16.81h-.02,0ZM2138.4,195.33h0l.05.05-.05-.05h0Z" />
        </svg>

        {isAuthenticated && (
          <div style={authWrapperStyle}>
            {user?.name && <span style={userNameStyle}>{user.name}</span>}
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
        )}
      </div>
    </header>
  );
};

export default Header;
