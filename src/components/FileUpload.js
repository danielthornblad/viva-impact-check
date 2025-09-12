import React from 'react';
import { sectionStyle, headingStyle } from '../styles/commonStyles';

const FileUpload = ({
  adType,
  dragActive,
  uploadedFile,
  handleDrag,
  handleDrop,
  handleFileSelect,
  onRemoveFile
}) => (
  <div style={sectionStyle}>
    <div style={{ marginBottom: '24px' }}>
      <h2 style={headingStyle}>
        Steg 2: Ladda upp din annons
      </h2>
      <p style={{
        color: '#6b7280',
      }}>
        {adType === 'video' ? 'Dra och släpp din videofil här' : 'Dra och släpp din bildfil här'}
      </p>
    </div>

    <div
      style={{
        border: `2px dashed ${dragActive || uploadedFile ? '#CAE780' : '#d1d5db'}`,
        borderRadius: '12px',
        padding: '48px',
        textAlign: 'center',
        backgroundColor: dragActive || uploadedFile ? '#f0f9f0' : 'transparent',
        transition: 'all 0.2s'
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={adType === 'video' ? 'video/*' : 'image/*'}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="file-upload"
      />

      {uploadedFile ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#CAE780',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <svg style={{ width: '32px', height: '32px', color: '#1f2937' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p style={{
            fontSize: '18px',
            fontWeight: '500',
            color: '#1f2937',
          }}>
            {uploadedFile.name}
          </p>
          <p style={{
            color: '#6b7280',
            marginTop: '4px',
          }}>
            Fil vald ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
          <button
            onClick={onRemoveFile}
            style={{
              color: '#6b7280',
              marginTop: '8px',
              fontSize: '14px',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Ta bort fil
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#f3f4f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <svg style={{ width: '32px', height: '32px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.96 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p style={{
            fontSize: '18px',
            fontWeight: '500',
            color: '#1f2937',
            marginBottom: '8px',
          }}>
            Dra och släpp din {adType === 'video' ? 'video' : 'bild'} här
          </p>
          <p style={{
            color: '#6b7280',
            marginBottom: '16px',
          }}>
            eller
          </p>
          <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
            <span style={{
              backgroundColor: '#CAE780',
              color: '#1f2937',
              padding: '12px 24px',
              borderRadius: '50px',
              fontWeight: '500',
            }}>
              Välj fil
            </span>
          </label>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginTop: '16px',
          }}>
            {adType === 'video'
              ? 'Stöds: MP4, MOV, AVI (max 100MB)'
              : 'Stöds: JPG, PNG, GIF (max 10MB)'}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default FileUpload;
