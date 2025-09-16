import React from 'react';
import { getPrimaryCtaLabel } from '@viva/ui';

const AnalyzeButton = ({ canAnalyze, analyzing, startAnalysis }) => {
  const ctaLabel = getPrimaryCtaLabel('analysera');

  return (
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
      <button
        disabled={!canAnalyze || analyzing}
        onClick={startAnalysis}
        style={{
          padding: '16px 48px',
          borderRadius: '50px',
          fontWeight: '700',
          fontSize: '18px',
          border: 'none',
          cursor: (canAnalyze && !analyzing) ? 'pointer' : 'not-allowed',
          backgroundColor: (canAnalyze && !analyzing) ? '#CAE780' : '#e5e7eb',
          color: (canAnalyze && !analyzing) ? '#1f2937' : '#9ca3af',
          boxShadow: (canAnalyze && !analyzing) ? '0 10px 25px rgba(0, 0, 0, 0.1)' : 'none',
          transition: 'all 0.2s',
          opacity: analyzing ? 0.7 : 1
        }}
      >
        {analyzing
          ? 'Analyserar...'
          : canAnalyze
            ? ctaLabel
            : 'Fyll i alla fält för att fortsätta'}
      </button>
    </div>
  );
};

export default AnalyzeButton;
