import React from 'react';

const AnalysisResult = ({ analysisResult }) => {
  if (!analysisResult) return null;

  return (
  <div style={{ 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    padding: '48px', 
    marginBottom: '48px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
  }}>
    <h2 style={{ 
      fontSize: '2.5rem', 
      fontWeight: '700', 
      color: '#071119', 
      marginBottom: '32px',
      letterSpacing: '-0.02em',
      lineHeight: '1.2'
    }}>
      Viva Impact Check
    </h2>
    
    {/* Metadata-sektion */}
    <div style={{
      backgroundColor: '#f8fdf4',
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '48px',
      border: '1px solid #CAE780'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#CAE780',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4.5L4.5 8L11 1.5" stroke="#02443E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p style={{ 
          color: '#02443E', 
          fontWeight: '600', 
          fontSize: '1.125rem',
          margin: 0
        }}>
          {analysisResult.message}
        </p>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        fontSize: '15px',
        lineHeight: '1.6'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'auto 1fr', 
          gap: '12px 24px',
          alignItems: 'center'
        }}>
          <strong style={{ color: '#071119' }}>Filnamn:</strong>
          <span style={{ color: '#02443E' }}>{analysisResult.fileName || analysisResult.data?.fileName}</span>
          
          <strong style={{ color: '#071119' }}>Filstorlek:</strong>
          <span style={{ color: '#02443E' }}>{analysisResult.data?.fileSize ? `${(analysisResult.data.fileSize / 1024).toFixed(2)} KB` : 'N/A'}</span>
          
          <strong style={{ color: '#071119' }}>Annonstyp:</strong>
          <span style={{ color: '#02443E' }}>{analysisResult.data?.adType === 'video' ? 'Videoannons' : 'Bildannons'}</span>
          
          <strong style={{ color: '#071119' }}>Platform:</strong>
          <span style={{ color: '#02443E' }}>{analysisResult.data?.platform || analysisResult.platform}</span>
          
          <strong style={{ color: '#071119' }}>Målgrupp:</strong>
          <span style={{ color: '#02443E' }}>{analysisResult.data?.targetAudience || analysisResult.targetAudience}</span>
          
          <strong style={{ color: '#071119' }}>Tidsstämpel:</strong>
          <span style={{ color: '#02443E' }}>{analysisResult.data?.timestamp ? new Date(parseInt(analysisResult.data.timestamp)).toLocaleString('sv-SE') : new Date().toLocaleString('sv-SE')}</span>
        </div>
      </div>
    </div>
    
    {/* Strukturerad AI-analys */}
    {analysisResult.analysisResult && analysisResult.analysisResult.parsed && (
      <div>
        
        {/* Analystyp-badge */}
        <div style={{ marginBottom: '48px' }}>
          <span style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: '25px',
            backgroundColor: 'white',
            color: '#02443E',
            fontSize: '14px',
            fontWeight: '600',
            border: '2px solid #02443E'
          }}>
            {analysisResult.analysisResult.type === 'video' ? 'Videoanalys' : 'Bildanalys'}
          </span>
        </div>
        
        {/* Huvudsektioner */}
        {analysisResult.analysisResult.sections && Object.keys(analysisResult.analysisResult.sections).length > 0 && (
          <div style={{ marginBottom: '64px' }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#071119',
              marginBottom: '32px',
              letterSpacing: '-0.01em'
            }}>
              Resultat
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '32px'
            }}>
              {Object.entries(analysisResult.analysisResult.sections).map(([sectionName, items]) => (
                <div key={sectionName} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '32px',
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                }}>
                  <h4 style={{
                    fontSize: '1.375rem',
                    fontWeight: '600',
                    color: '#071119',
                    marginBottom: '24px',
                    letterSpacing: '-0.01em'
                  }}>
                    {sectionName}
                  </h4>
                  
                  {/* Styrkor */}
                  {items.strengths && items.strengths.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#02443E',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Styrkor
                      </p>
                      <div style={{ paddingLeft: '8px' }}>
                        {items.strengths.map((item, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            marginBottom: '12px'
                          }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#CAE780',
                              marginTop: '8px',
                              flexShrink: 0
                            }}></div>
                            <p style={{
                              color: '#02443E',
                              fontSize: '15px',
                              lineHeight: '1.6',
                              margin: 0
                            }}>
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Svagheter */}
                  {items.weaknesses && items.weaknesses.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#071119',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        opacity: 0.8
                      }}>
                        Förbättringsområden
                      </p>
                      <div style={{ paddingLeft: '8px' }}>
                        {items.weaknesses.map((item, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            marginBottom: '12px'
                          }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#071119',
                              opacity: 0.4,
                              marginTop: '8px',
                              flexShrink: 0
                            }}></div>
                            <p style={{
                              color: '#071119',
                              fontSize: '15px',
                              lineHeight: '1.6',
                              margin: 0,
                              opacity: 0.8
                            }}>
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Osäkerheter (för bildanalys) */}
                  {items.uncertainties && items.uncertainties.length > 0 && (
                    <div>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#02443E',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        opacity: 0.9
                      }}>
                        Osäkerheter
                      </p>
                      <div style={{ paddingLeft: '8px' }}>
                        {items.uncertainties.map((item, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            marginBottom: '12px'
                          }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#02443E',
                              opacity: 0.6,
                              marginTop: '8px',
                              flexShrink: 0
                            }}></div>
                            <p style={{
                              color: '#02443E',
                              fontSize: '15px',
                              lineHeight: '1.6',
                              margin: 0,
                              opacity: 0.9
                            }}>
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '32px',
            marginBottom: '64px'
          }}>
            {/* Övergripande styrkor */}
            {analysisResult.analysisResult.overallStrengths && analysisResult.analysisResult.overallStrengths.length > 0 && (
              <div style={{
                backgroundColor: '#f8fdf4',
                borderRadius: '12px',
                padding: '32px',
                border: '1px solid #CAE780'
              }}>
                <h4 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#02443E',
                  marginBottom: '24px',
                  letterSpacing: '-0.01em'
                }}>
                  Övergripande styrkor
                </h4>
                <div>
                  {analysisResult.analysisResult.overallStrengths.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#CAE780',
                        marginTop: '6px',
                        flexShrink: 0
                      }}></div>
                      <p style={{
                        color: '#02443E',
                        fontSize: '16px',
                        lineHeight: '1.7',
                        margin: 0
                      }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Övergripande svagheter */}
            {analysisResult.analysisResult.overallWeaknesses && analysisResult.analysisResult.overallWeaknesses.length > 0 && (
              <div style={{
                backgroundColor: '#fafafa',
                borderRadius: '12px',
                padding: '32px',
                border: '1px solid #e0e0e0'
              }}>
                <h4 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#071119',
                  marginBottom: '24px',
                  letterSpacing: '-0.01em'
                }}>
                  Förbättringsområden
                </h4>
                <div>
                  {analysisResult.analysisResult.overallWeaknesses.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#071119',
                        opacity: 0.4,
                        marginTop: '6px',
                        flexShrink: 0
                      }}></div>
                      <p style={{
                        color: '#071119',
                        fontSize: '16px',
                        lineHeight: '1.7',
                        margin: 0,
                        opacity: 0.8
                      }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Sammanfattning (för bildanalys) */}
        {analysisResult.analysisResult.type === 'image' && analysisResult.analysisResult.summary && (
          <div style={{
            backgroundColor: '#fafafa',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '48px',
            borderLeft: '4px solid #CAE780'
          }}>
            <h4 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#071119',
              marginBottom: '16px',
              letterSpacing: '-0.01em'
            }}>
              Sammanfattning
            </h4>
            <p style={{
              color: '#02443E',
              fontSize: '16px',
              lineHeight: '1.7',
              margin: 0
            }}>
              {analysisResult.analysisResult.summary}
            </p>
          </div>
        )}
        
        {/* Förbättringsförslag */}
        {analysisResult.analysisResult.improvements && analysisResult.analysisResult.improvements.length > 0 && (
          <div style={{
            backgroundColor: '#f8fdf4',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '48px',
            border: '1px solid #CAE780'
          }}>
            <h4 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#071119',
              marginBottom: '24px',
              letterSpacing: '-0.01em'
            }}>
              Konkreta förbättringsförslag
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analysisResult.analysisResult.improvements.map((item, idx) => (
                <div key={idx} style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '24px',
                  border: '1px solid #e8f5d3',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    backgroundColor: '#CAE780',
                    color: '#071119',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>
                  <p style={{
                    margin: 0,
                    color: '#02443E',
                    fontSize: '16px',
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
            backgroundColor: '#fafafa',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '48px',
            borderLeft: '4px solid #02443E'
          }}>
            <h4 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#071119',
              marginBottom: '16px',
              letterSpacing: '-0.01em'
            }}>
              Motivering
            </h4>
            <p style={{
              color: '#02443E',
              fontSize: '16px',
              lineHeight: '1.7',
              margin: 0
            }}>
              {analysisResult.analysisResult.motivation}
            </p>
          </div>
        )}
        
        {/* Rekommendation (för videoanalys) */}
        {analysisResult.analysisResult.type === 'video' && analysisResult.analysisResult.recommendation && (
          <div style={{
            backgroundColor: '#f8fdf4',
            borderRadius: '12px',
            padding: '32px',
            border: '2px solid #CAE780'
          }}>
            <h4 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#071119',
              marginBottom: '16px',
              letterSpacing: '-0.01em'
            }}>
              Samlad rekommendation
            </h4>
            <p style={{
              color: '#02443E',
              fontSize: '16px',
              lineHeight: '1.7',
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
        backgroundColor: '#fafafa',
        padding: '32px',
        borderRadius: '12px',
        marginTop: '32px',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: '#071119', 
          marginBottom: '16px',
          letterSpacing: '-0.01em'
        }}>
          ⚠️ Fel vid parsning av analys
        </h3>
        {analysisResult.analysisResult.error && (
          <p style={{ color: '#02443E', marginBottom: '16px', fontSize: '15px' }}>
            {analysisResult.analysisResult.error}
          </p>
        )}
        {analysisResult.analysisResult.rawContent && (
          <details>
            <summary style={{ 
              cursor: 'pointer', 
              color: '#02443E',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              Visa rå innehåll
            </summary>
            <div style={{ 
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
              color: '#071119',
              fontFamily: 'monospace',
              fontSize: '14px',
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '12px',
              border: '1px solid #e0e0e0'
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
        backgroundColor: '#f8fdf4',
        padding: '32px',
        borderRadius: '12px',
        marginTop: '32px',
        border: '1px solid #CAE780',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '3px solid #CAE780',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ 
          color: '#02443E', 
          margin: 0,
          fontSize: '16px',
          fontWeight: '500'
        }}>
          Väntar på AI-analys från n8n workflow...
        </p>
      </div>
    )}
    
    {/* CSS-animation för laddningsikonen */}
    <style jsx>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
  );
};

export default AnalysisResult;
