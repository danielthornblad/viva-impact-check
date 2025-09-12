import React from 'react';

const ErrorBanner = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        backgroundColor: '#FEE2E2',
        border: '1px solid #FCA5A5',
        color: '#991B1B',
        padding: '16px 24px',
        borderRadius: '8px',
        marginBottom: '24px',
      }}
    >
      {message}
    </div>
  );
};

export default ErrorBanner;
