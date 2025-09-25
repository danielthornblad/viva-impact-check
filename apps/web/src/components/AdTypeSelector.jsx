import React from 'react';
import { sectionStyle, headingStyle } from '../styles/commonStyles';

const AdTypeSelector = ({ adType, setAdType }) => (
  <div style={sectionStyle}>
    <div style={{ marginBottom: '24px' }}>
      <h2 style={headingStyle}>Steg 1: Välj annonstyp</h2>
      <p style={{
        color: '#6b7280',
      }}>
        Vilken typ av annons vill du analysera?
      </p>
    </div>

    <div style={{
      display: 'flex',
      backgroundColor: '#f3f4f6',
      borderRadius: '50px',
      padding: '4px',
      width: 'fit-content'
    }}>
      <button
        onClick={() => setAdType('video')}
        style={{
          padding: '12px 24px',
          borderRadius: '50px',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backgroundColor: adType === 'video' ? '#CAE780' : 'transparent',
          color: adType === 'video' ? '#1f2937' : '#6b7280',
        }}
      >
        Videoannons
      </button>
      <button
        onClick={() => setAdType('image')}
        style={{
          padding: '12px 24px',
          borderRadius: '50px',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backgroundColor: adType === 'image' ? '#CAE780' : 'transparent',
          color: adType === 'image' ? '#1f2937' : '#6b7280',
        }}
      >
        Bildannons
      </button>
    </div>
  </div>
);

export default AdTypeSelector;
