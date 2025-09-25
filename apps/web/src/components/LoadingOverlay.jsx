import React from 'react';

const LoadingOverlay = ({ adType }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  }}>
    <div style={{ maxWidth: '400px', textAlign: 'center' }}>
      <div style={{
        width: '60px',
        height: '60px',
        margin: '0 auto 32px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '6px solid #f3f4f6',
          borderRadius: '50%'
        }} />
        <div
          className="rotating"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '6px solid transparent',
            borderTop: '6px solid #CAE780',
            borderRadius: '50%'
          }}
        />
      </div>

      <h3 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '12px'
      }}>
        Analyserar din {adType === 'video' ? 'video' : 'bild'}
      </h3>

      <p style={{
        fontSize: '16px',
        color: '#6b7280',
        marginBottom: '32px'
      }}>
        AI:n granskar innehållet och genererar insikter
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '300px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#CAE780',
            margin: '0 auto 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px'
          }}>
            ✓
          </div>
          <span style={{ fontSize: '12px', color: '#1f2937' }}>Uppladdad</span>
        </div>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#CAE780',
            margin: '0 auto 8px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'white'
            }} />
          </div>
          <span style={{ fontSize: '12px', color: '#1f2937', fontWeight: '600' }}>Bearbetar</span>
        </div>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            margin: '0 auto 8px'
          }} />
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>Rapport</span>
        </div>
      </div>
    </div>
  </div>
);

export default LoadingOverlay;
