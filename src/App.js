import React, { useState } from 'react';

const AdAnalyzerUI = () => {

  React.useEffect(() => {
    // Skapa en style-tagg för animationer
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.3; }
        33% { opacity: 0.6; }
        66% { opacity: 1; }
      }
      .rotating {
        animation: spin 2s linear infinite;
      }
      .pulsing-1 {
        animation: pulse 1.5s ease-in-out infinite;
        animation-delay: 0s;
      }
      .pulsing-2 {
        animation: pulse 1.5s ease-in-out infinite;
        animation-delay: 0.3s;
      }
      .pulsing-3 {
        animation: pulse 1.5s ease-in-out infinite;
        animation-delay: 0.6s;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [adType, setAdType] = useState('video');
  const [platform, setPlatform] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
    }
  };

  const startAnalysis = async () => {
  if (!canAnalyze || !uploadedFile) return;
  
  try {
    setAnalyzing(true);
    setAnalysisResult(null);
    
    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('adType', adType);
    formData.append('platform', platform);
    formData.append('targetAudience', targetAudience);
    formData.append('fileName', uploadedFile.name);
    formData.append('fileSize', uploadedFile.size);
    formData.append('fileType', uploadedFile.type);
    formData.append('timestamp', Date.now().toString());
    
    console.log('Skickar till n8n:', {
      fileName: uploadedFile.name,
      adType, platform, targetAudience
    });
    
    // Din riktiga n8n webhook URL
    const response = await fetch('https://vivamedia.app.n8n.cloud/webhook-test/analyze-ad', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`N8N failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    setAnalysisResult(result);
    setAnalyzing(false);
    
    console.log('N8N response:', result);
    
  } catch (error) {
    console.error('N8N test failed:', error);
    setAnalyzing(false);
    alert(`N8N anslutning misslyckades: ${error.message}`);
  }
};

  const platforms = [
    'Facebook/Meta',
    'Instagram', 
    'Google Ads',
    'YouTube',
    'LinkedIn',
    'TikTok',
    'Twitter/X',
    'Snapchat'
  ];

  const canAnalyze = uploadedFile && platform && targetAudience;

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto', padding: '24px' }}>
          <svg 
            alt="Viva" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 2613.24 702.24"
            style={{ height: '32px', width: 'auto', fill: '#1f2937' }}
          >
            <path d="M553.76,674.12L239.66,11.38c-3.24-6.95-10.26-11.38-17.93-11.38H19.85C8.87,0,0,8.93,0,19.85v61.87c0,6.82,3.44,13.17,9.2,16.81l111.36,70.47c2.65,1.65,4.9,3.97,6.48,6.68l.18.31.09.16h0c.2.33.4.73.6,1.12l243.43,513.59c3.24,6.95,10.26,11.38,17.93,11.38h146.43c14.49,0,24.02-15.02,18.06-28.12h0Z"></path>
            <path d="M781.22,11.35l-249.7,526.96c-6.24,13.17,3.36,28.35,17.94,28.35h146.43c7.67,0,14.65-4.42,17.94-11.35L963.59,28.35c6.24-13.17-3.36-28.35-17.94-28.35h-146.5c-7.67,0-14.65,4.42-17.94,11.35h0Z"></path>
            <path d="M1201.94,0h-132.34c-10.98,0-19.85,8.93-19.85,19.85v662.54c0,10.98,8.87,19.85,19.85,19.85h132.34c10.92,0,19.85-8.87,19.85-19.85V19.85c0-10.92-8.93-19.85-19.85-19.85Z"></path>
            <path d="M1808.4,673.38l.22.47L1494.68,11.35c-3.28-6.93-10.27-11.35-17.94-11.35h-146.51c-14.56,0-24.15,15.22-17.93,28.39l313.97,662.47c3.31,6.95,10.26,11.38,17.93,11.38h146.43c14.59,0,24.22-15.18,18-28.38l-.23-.48h0Z"></path>
            <path d="M2603.96,603.72l-111.36-70.47c-3.18-1.99-5.69-4.9-7.28-8.27L2241.91,11.35c-3.28-6.93-10.27-11.35-17.94-11.35h-170.8c-7.67,0-14.65,4.42-17.94,11.35l-249.7,526.96c-6.24,13.17,3.36,28.35,17.94,28.35h146.43c7.67,0,14.65-4.42,17.94-11.35l158.6-334.73c4.78-10.09,19.14-10.09,23.92,0l98.15,207.13h-90.18c-10.96,0-19.85,8.89-19.85,19.85v99.25c0,10.96,8.89,19.85,19.85,19.85h156.29l58.89,124.2c3.31,6.95,10.32,11.38,18,11.38h201.88c10.98,0,19.85-8.93,19.85-19.85v-61.87c0-6.82-3.51-13.17-9.26-16.81h-.02,0ZM2138.4,195.33h0l.05.05-.05-.05h0Z"></path>
          </svg>
        </div>
      </div>

      {/* Hero Section */}
<div style={{ backgroundColor: '#CAE780' }}>
  <div style={{ maxWidth: '896px', margin: '0 auto', padding: '64px 24px' }}>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gap: '48px', 
      alignItems: 'flex-start'
    }}>
      <div>
        <div style={{ 
          display: 'inline-block', 
          backgroundColor: 'transparent', 
          padding: '8px 16px', 
          borderRadius: '50px', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#02443E', 
          marginBottom: '24px', 
          border: '1px solid #02443E' 
        }}>
          Marknadsföring & AI-analys
        </div>
        <h1 style={{ 
          fontSize: '3.75rem', 
          fontWeight: '700', 
          color: '#02443E', 
          lineHeight: '1.1', 
          margin: 0,  // Ta bort margin
          fontFamily: 'DM Sans, sans-serif'
        }}>
          Viva Impact Check
        </h1>
      </div>
      
      <div style={{ 
        paddingTop: '72px'  // Justera detta värde för att matcha toppen av "Viva Impact Check"
      }}>
        <p style={{ 
          fontSize: '18px', 
          color: '#02443E', 
          lineHeight: '1.6',
          fontFamily: 'DM Sans, sans-serif',
          margin: 0
        }}>
          Analysera effekten av dina annonser med AI-driven precision. 
          Få djupgående insikter om målgruppsrelevans, budskap och 
          optimeringsmöjligheter som driver konvertering och ROI.
        </p>
      </div>
    </div>
  </div>
</div>

      <div style={{ maxWidth: '896px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Steg 1: Annonstyp */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '32px', 
          marginBottom: '24px' 
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '8px',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Steg 1: Välj annonstyp
            </h2>
            <p style={{ 
              color: '#6b7280',
              fontFamily: 'DM Sans, sans-serif'
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
                fontFamily: 'DM Sans, sans-serif'
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
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              Bildannons
            </button>
          </div>
        </div>

        {/* Steg 2: Filuppladdning */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '32px', 
          marginBottom: '24px' 
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '8px',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Steg 2: Ladda upp din annons
            </h2>
            <p style={{ 
              color: '#6b7280',
              fontFamily: 'DM Sans, sans-serif'
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
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  {uploadedFile.name}
                </p>
                <p style={{ 
                  color: '#6b7280', 
                  marginTop: '4px',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  Fil vald ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
                <button
                  onClick={() => {
                    setUploadedFile(null);
                    setAnalysisResult(null);
                  }}
                  style={{
                    color: '#6b7280',
                    marginTop: '8px',
                    fontSize: '14px',
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif'
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: '500', 
                  color: '#1f2937', 
                  marginBottom: '8px',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  Dra och släpp din {adType === 'video' ? 'video' : 'bild'} här
                </p>
                <p style={{ 
                  color: '#6b7280', 
                  marginBottom: '16px',
                  fontFamily: 'DM Sans, sans-serif'
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
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Välj fil
                  </span>
                </label>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  marginTop: '16px',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  {adType === 'video' 
                    ? 'Stöds: MP4, MOV, AVI (max 100MB)' 
                    : 'Stöds: JPG, PNG, GIF (max 10MB)'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Steg 3: Plattform och målgrupp */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '32px', 
          marginBottom: '32px' 
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '8px',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Steg 3: Kontext för analysen
            </h2>
            <p style={{ 
              color: '#6b7280',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Berätta mer om din annons för bättre analys
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#1f2937', 
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                Plattform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontFamily: 'DM Sans, sans-serif',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Välj plattform</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#1f2937', 
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                Målgrupp
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="t.ex. Kvinnor 25-35, intresserade av fitness"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontFamily: 'DM Sans, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

{/* Analysera-knapp */}
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
      fontFamily: 'DM Sans, sans-serif',
      opacity: analyzing ? 0.7 : 1
    }}
  >
    {analyzing 
      ? 'Analyserar...' 
      : canAnalyze 
        ? 'Analysera annons' 
        : 'Fyll i alla fält för att fortsätta'
    }
  </button>
</div>

{/* Laddningsindikator - visas endast när analyzing är true */}
{analyzing && (
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
    <div style={{
      maxWidth: '400px',
      textAlign: 'center'
    }}>
      {/* Animerad ring med prickar */}
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
        }} />

        {/* Tre prickar som "laddningsindikator" */}
        {/*<div style={{
          position: 'absolute',
          top: '55%',
          left: '55%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          gap: '8px'
        }}>
          <div className="pulsing-1" style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#CAE780'
          }} />
          <div className="pulsing-2" style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#CAE780'
          }} />
          <div className="pulsing-3" style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#CAE780'
          }} />
        </div>*/}

      </div>
      
      <h3 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '12px',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        Analyserar din {adType === 'video' ? 'video' : 'bild'}
      </h3>
      
      <p style={{
        fontSize: '16px',
        color: '#6b7280',
        fontFamily: 'DM Sans, sans-serif',
        marginBottom: '32px'
      }}>
        AI:n granskar innehållet och genererar insikter
      </p>
      
      {/* Progress steps - enklare version */}
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
)}


{analysisResult && (
  <div style={{ 
    backgroundColor: 'white', 
    borderRadius: '8px', 
    padding: '32px', 
    marginBottom: '32px',
    border: '1px solid #e5e7eb'
  }}>
    <h2 style={{ 
      fontSize: '2rem', 
      fontWeight: '700', 
      color: '#1f2937', 
      marginBottom: '16px',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      AI Analysresultat
    </h2>
    
    {/* Metadata-sektion */}
    <div style={{
      backgroundColor: '#f0f9f0',
      padding: '20px',
      borderRadius: '8px',
      fontFamily: 'DM Sans, sans-serif',
      marginBottom: '24px'
    }}>
      <p style={{ color: '#059669', fontWeight: '600', marginBottom: '12px' }}>
        ✅ {analysisResult.message}
      </p>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '16px', 
        borderRadius: '6px',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
          <strong>Filnamn:</strong>
          <span>{analysisResult.fileName || analysisResult.data?.fileName}</span>
          
          <strong>Filstorlek:</strong>
          <span>{analysisResult.data?.fileSize ? `${(analysisResult.data.fileSize / 1024).toFixed(2)} KB` : 'N/A'}</span>
          
          <strong>Annonstyp:</strong>
          <span>{analysisResult.data?.adType === 'video' ? 'Videoannons' : 'Bildannons'}</span>
          
          <strong>Platform:</strong>
          <span>{analysisResult.data?.platform || analysisResult.platform}</span>
          
          <strong>Målgrupp:</strong>
          <span>{analysisResult.data?.targetAudience || analysisResult.targetAudience}</span>
          
          <strong>Tidsstämpel:</strong>
          <span>{analysisResult.data?.timestamp ? new Date(parseInt(analysisResult.data.timestamp)).toLocaleString('sv-SE') : new Date().toLocaleString('sv-SE')}</span>
        </div>
      </div>
    </div>
    
    {/* Strukturerad AI-analys */}
    {analysisResult.analysisResult && analysisResult.analysisResult.parsed && (
      <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
        
        {/* Analystyp-badge */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '20px',
            backgroundColor: analysisResult.analysisResult.type === 'video' ? '#3b82f6' : '#8b5cf6',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {analysisResult.analysisResult.type === 'video' ? '🎬 Videoanalys' : '🖼️ Bildanalys'}
          </span>
        </div>
        
        {/* Huvudsektioner */}
        {analysisResult.analysisResult.sections && Object.keys(analysisResult.analysisResult.sections).length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '20px',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '8px'
            }}>
              Detaljerad analys
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {Object.entries(analysisResult.analysisResult.sections).map(([sectionName, items]) => (
                <div key={sectionName} style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      width: '4px',
                      height: '20px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '2px'
                    }}></span>
                    {sectionName}
                  </h4>
                  
                  {/* Styrkor */}
                  {items.strengths && items.strengths.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#059669',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Styrkor
                      </p>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {items.strengths.map((item, idx) => (
                          <li key={idx} style={{
                            color: '#047857',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            marginBottom: '4px',
                            listStyleType: 'none',
                            position: 'relative',
                            paddingLeft: '20px'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: 0,
                              color: '#10b981'
                            }}>✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Svagheter */}
                  {items.weaknesses && items.weaknesses.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#dc2626',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Svagheter
                      </p>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {items.weaknesses.map((item, idx) => (
                          <li key={idx} style={{
                            color: '#b91c1c',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            marginBottom: '4px',
                            listStyleType: 'none',
                            position: 'relative',
                            paddingLeft: '20px'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: 0,
                              color: '#ef4444'
                            }}>✗</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Osäkerheter (för bildanalys) */}
                  {items.uncertainties && items.uncertainties.length > 0 && (
                    <div>
                      <p style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#d97706',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Osäkerheter
                      </p>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {items.uncertainties.map((item, idx) => (
                          <li key={idx} style={{
                            color: '#d97706',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            marginBottom: '4px',
                            listStyleType: 'none',
                            position: 'relative',
                            paddingLeft: '20px'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: 0,
                              color: '#f59e0b'
                            }}>?</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Övergripande styrkor och svagheter (för videoanalys) */}
        {analysisResult.analysisResult.type === 'video' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {/* Övergripande styrkor */}
            {analysisResult.analysisResult.overallStrengths && analysisResult.analysisResult.overallStrengths.length > 0 && (
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #86efac'
              }}>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#059669',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>💪</span>
                  Övergripande styrkor
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {analysisResult.analysisResult.overallStrengths.map((item, idx) => (
                    <li key={idx} style={{
                      color: '#047857',
                      fontSize: '15px',
                      lineHeight: '1.8',
                      marginBottom: '8px'
                    }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Övergripande svagheter */}
            {analysisResult.analysisResult.overallWeaknesses && analysisResult.analysisResult.overallWeaknesses.length > 0 && (
              <div style={{
                backgroundColor: '#fef2f2',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #fca5a5'
              }}>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#dc2626',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                  Övergripande svagheter
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {analysisResult.analysisResult.overallWeaknesses.map((item, idx) => (
                    <li key={idx} style={{
                      color: '#b91c1c',
                      fontSize: '15px',
                      lineHeight: '1.8',
                      marginBottom: '8px'
                    }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Sammanfattning (för bildanalys) */}
        {analysisResult.analysisResult.type === 'image' && analysisResult.analysisResult.summary && (
          <div style={{
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px',
            borderLeft: '4px solid #8b5cf6'
          }}>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📋</span>
              Sammanfattning
            </h4>
            <p style={{
              color: '#4b5563',
              fontSize: '15px',
              lineHeight: '1.8',
              margin: 0
            }}>
              {analysisResult.analysisResult.summary}
            </p>
          </div>
        )}
        
        {/* Förbättringsförslag */}
        {analysisResult.analysisResult.improvements && analysisResult.analysisResult.improvements.length > 0 && (
          <div style={{
            backgroundColor: '#fffbeb',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid #fcd34d'
          }}>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#92400e',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>💡</span>
              Konkreta förbättringsförslag
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analysisResult.analysisResult.improvements.map((item, idx) => (
                <div key={idx} style={{
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  padding: '16px',
                  border: '1px solid #fde047',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}>
                  <span style={{
                    backgroundColor: '#fbbf24',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </span>
                  <p style={{
                    margin: 0,
                    color: '#78350f',
                    fontSize: '15px',
                    lineHeight: '1.6'
                  }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Motivering (för bildanalys) */}
        {analysisResult.analysisResult.type === 'image' && analysisResult.analysisResult.motivation && (
          <div style={{
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px',
            borderLeft: '4px solid #0ea5e9'
          }}>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#075985',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📝</span>
              Motivering
            </h4>
            <p style={{
              color: '#0c4a6e',
              fontSize: '15px',
              lineHeight: '1.8',
              margin: 0
            }}>
              {analysisResult.analysisResult.motivation}
            </p>
          </div>
        )}
        
        {/* Rekommendation (för videoanalys) */}
        {analysisResult.analysisResult.type === 'video' && analysisResult.analysisResult.recommendation && (
          <div style={{
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            padding: '24px',
            border: '2px solid #0ea5e9'
          }}>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#075985',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span>
              Samlad rekommendation
            </h4>
            <p style={{
              color: '#0c4a6e',
              fontSize: '15px',
              lineHeight: '1.8',
              margin: 0
            }}>
              {analysisResult.analysisResult.recommendation}
            </p>
          </div>
        )}
        
      </div>
    )}
    
    {/* Fallback för oparsad data */}
    {analysisResult.analysisResult && !analysisResult.analysisResult.parsed && (
      <div style={{
        backgroundColor: '#fef2f2',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
        border: '1px solid #fca5a5'
      }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#dc2626', 
          marginBottom: '12px',
          fontFamily: 'DM Sans, sans-serif'
        }}>
          ⚠️ Fel vid parsning av analys
        </h3>
        {analysisResult.analysisResult.error && (
          <p style={{ color: '#b91c1c', marginBottom: '12px' }}>
            {analysisResult.analysisResult.error}
          </p>
        )}
        {analysisResult.analysisResult.rawContent && (
          <details>
            <summary style={{ 
              cursor: 'pointer', 
              color: '#7f1d1d',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Visa rå innehåll
            </summary>
            <div style={{ 
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
              color: '#991b1b',
              fontFamily: 'monospace',
              fontSize: '13px',
              backgroundColor: 'white',
              padding: '12px',
              borderRadius: '4px',
              marginTop: '8px'
            }}>
              {analysisResult.analysisResult.rawContent}
            </div>
          </details>
        )}
      </div>
    )}
    
    {/* Väntar på analys */}
    {!analysisResult.analysisResult && (
      <div style={{
        backgroundColor: '#fef3c7',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
        border: '1px solid #fcd34d',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '3px solid #f59e0b',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ 
          color: '#92400e', 
          margin: 0,
          fontSize: '15px',
          fontWeight: '500'
        }}>
          Väntar på AI-analys från n8n workflow...
        </p>
      </div>
    )}
    
    {/* Lägg till CSS-animation för laddningsikonen */}
    <style jsx>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)}     

        {/* Progress indicator */}
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
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#071119', color: 'white', padding: '48px 24px' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto', textAlign: 'center' }}>
          <svg 
            alt="Viva" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 2613.24 702.24"
            style={{ 
              height: '24px', 
              width: 'auto', 
              fill: 'white', 
              display: 'block',
              margin: '0 auto 24px auto'
            }}
          >
            <path d="M553.76,674.12L239.66,11.38c-3.24-6.95-10.26-11.38-17.93-11.38H19.85C8.87,0,0,8.93,0,19.85v61.87c0,6.82,3.44,13.17,9.2,16.81l111.36,70.47c2.65,1.65,4.9,3.97,6.48,6.68l.18.31.09.16h0c.2.33.4.73.6,1.12l243.43,513.59c3.24,6.95,10.26,11.38,17.93,11.38h146.43c14.49,0,24.02-15.02,18.06-28.12h0Z"></path>
            <path d="M781.22,11.35l-249.7,526.96c-6.24,13.17,3.36,28.35,17.94,28.35h146.43c7.67,0,14.65-4.42,17.94-11.35L963.59,28.35c6.24-13.17-3.36-28.35-17.94-28.35h-146.5c-7.67,0-14.65,4.42-17.94,11.35h0Z"></path>
            <path d="M1201.94,0h-132.34c-10.98,0-19.85,8.93-19.85,19.85v662.54c0,10.98,8.87,19.85,19.85,19.85h132.34c10.92,0,19.85-8.87,19.85-19.85V19.85c0-10.92-8.93-19.85-19.85-19.85Z"></path>
            <path d="M1808.4,673.38l.22.47L1494.68,11.35c-3.28-6.93-10.27-11.35-17.94-11.35h-146.51c-14.56,0-24.15,15.22-17.93,28.39l313.97,662.47c3.31,6.95,10.26,11.38,17.93,11.38h146.43c14.59,0,24.22-15.18,18-28.38l-.23-.48h0Z"></path>
            <path d="M2603.96,603.72l-111.36-70.47c-3.18-1.99-5.69-4.9-7.28-8.27L2241.91,11.35c-3.28-6.93-10.27-11.35-17.94-11.35h-170.8c-7.67,0-14.65,4.42-17.94,11.35l-249.7,526.96c-6.24,13.17,3.36,28.35,17.94,28.35h146.43c7.67,0,14.65-4.42,17.94-11.35l158.6-334.73c4.78-10.09,19.14-10.09,23.92,0l98.15,207.13h-90.18c-10.96,0-19.85,8.89-19.85,19.85v99.25c0,10.96,8.89,19.85,19.85,19.85h156.29l58.89,124.2c3.31,6.95,10.32,11.38,18,11.38h201.88c10.98,0,19.85-8.93,19.85-19.85v-61.87c0-6.82-3.51-13.17-9.26-16.81h-.02,0ZM2138.4,195.33h0l.05.05-.05-.05h0Z"></path>
          </svg>
          <p style={{ 
            fontSize: '12px', 
            color: '#9ca3af', 
            fontFamily: 'DM Sans, sans-serif',
            margin: 0,
            textAlign: 'center'
          }}>
            © 2025 Viva Media. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </div>
  );
};
function App() {
return <AdAnalyzerUI />;
}
export default App;
