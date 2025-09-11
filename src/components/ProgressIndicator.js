import React from 'react';

const ProgressIndicator = ({ adType, uploadedFile, platform, targetAudience }) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: adType ? '#CAE780' : '#d1d5db'
      }} />
      <div style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: uploadedFile ? '#CAE780' : '#d1d5db'
      }} />
      <div style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: (platform && targetAudience) ? '#CAE780' : '#d1d5db'
      }} />
    </div>
  </div>
);

export default ProgressIndicator;
