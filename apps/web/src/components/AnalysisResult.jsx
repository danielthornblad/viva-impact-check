import React from 'react';
import { pdf } from '@react-pdf/renderer';
import MetadataSection from './MetadataSection';
import StrengthsWeaknessesSection from './StrengthsWeaknessesSection';
import ImprovementsSection from './ImprovementsSection';
import AnalysisResultPDF from './AnalysisResultPDF';
import {
  analysisContainer,
  analysisTitle,
  badgeStyle,
  badgeWrapper,
  resultHeading,
  resultsWrapper,
  sectionGrid,
  overallGrid,
  overallStrengthsBox,
  overallWeaknessesBox,
  overallTitleStrengths,
  overallTitleWeaknesses,
  bulletRow,
  bulletDotGreen8,
  bulletDotDark8,
  bulletTextGreen,
  bulletTextDark,
  summaryBox,
  summaryTitle,
  summaryText,
  motivationBox,
  recommendationBox,
  recommendationTitle,
  recommendationText,
  fallbackBox,
  fallbackTitle,
  fallbackErrorText,
  fallbackSummary,
  fallbackContent,
  waitingBox,
  spinner,
  waitingText,
} from '../styles/commonStyles';

const AnalysisResult = ({ analysisResult }) => {
  if (!analysisResult) return null;

  const handleDownloadPDF = async () => {
    try {
      const blob = await pdf(<AnalysisResultPDF analysisResult={analysisResult} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = analysisResult?.fileName || analysisResult?.data?.fileName || 'annons';
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `viva-impact-${fileName.replace(/\.[^/.]+$/, '')}-${timestamp}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Fel vid skapande av PDF:', error);
      // eslint-disable-next-line no-alert
      alert('Kunde inte skapa PDF. Försök igen.');
    }
  };

  return (
    <div style={analysisContainer}>
      <h2 style={analysisTitle}>Viva Impact Check</h2>

      <button
        onClick={handleDownloadPDF}
        style={{
          padding: '12px 24px',
          backgroundColor: '#CAE780',
          color: '#071119',
          border: 'none',
          borderRadius: '50px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#b8d470';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#CAE780';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Ladda ner PDF
      </button>

      <MetadataSection analysisResult={analysisResult} />

      {analysisResult.analysisResult && analysisResult.analysisResult.parsed && (
        <div>
          <div style={badgeWrapper}>
            <span style={badgeStyle}>
              {analysisResult.analysisResult.type === 'video' ? 'Videoanalys' : 'Bildanalys'}
            </span>
          </div>

          {analysisResult.analysisResult.sections && Object.keys(analysisResult.analysisResult.sections).length > 0 && (
            <div style={resultsWrapper}>
              <h3 style={resultHeading}>Resultat</h3>
              <div style={sectionGrid}>
                {Object.entries(analysisResult.analysisResult.sections).map(([sectionName, items]) => (
                  <StrengthsWeaknessesSection key={sectionName} sectionName={sectionName} items={items} />
                ))}
              </div>
            </div>
          )}

          {analysisResult.analysisResult.type === 'video' && (
            <div style={overallGrid}>
              {analysisResult.analysisResult.overallStrengths && analysisResult.analysisResult.overallStrengths.length > 0 && (
                <div style={overallStrengthsBox}>
                  <h4 style={overallTitleStrengths}>Övergripande styrkor</h4>
                  <div>
                    {analysisResult.analysisResult.overallStrengths.map((item) => (
                      <div key={item} style={bulletRow}>
                        <div style={bulletDotGreen8}></div>
                        <p style={bulletTextGreen}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysisResult.analysisResult.overallWeaknesses && analysisResult.analysisResult.overallWeaknesses.length > 0 && (
                <div style={overallWeaknessesBox}>
                  <h4 style={overallTitleWeaknesses}>Förbättringsområden</h4>
                  <div>
                    {analysisResult.analysisResult.overallWeaknesses.map((item) => (
                      <div key={item} style={bulletRow}>
                        <div style={bulletDotDark8}></div>
                        <p style={bulletTextDark}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {analysisResult.analysisResult.type === 'image' && analysisResult.analysisResult.summary && (
            <div style={summaryBox}>
              <h4 style={summaryTitle}>Sammanfattning</h4>
              <p style={summaryText}>{analysisResult.analysisResult.summary}</p>
            </div>
          )}

          {analysisResult.analysisResult.improvements && analysisResult.analysisResult.improvements.length > 0 && (
            <ImprovementsSection improvements={analysisResult.analysisResult.improvements} />
          )}

          {analysisResult.analysisResult.type === 'image' && analysisResult.analysisResult.motivation && (
            <div style={motivationBox}>
              <h4 style={summaryTitle}>Motivering</h4>
              <p style={summaryText}>{analysisResult.analysisResult.motivation}</p>
            </div>
          )}

          {analysisResult.analysisResult.type === 'video' && analysisResult.analysisResult.recommendation && (
            <div style={recommendationBox}>
              <h4 style={recommendationTitle}>Samlad rekommendation</h4>
              <p style={recommendationText}>{analysisResult.analysisResult.recommendation}</p>
            </div>
          )}
        </div>
      )}

      {analysisResult.analysisResult && !analysisResult.analysisResult.parsed && (
        <div style={fallbackBox}>
          <h3 style={fallbackTitle}>⚠️ Fel vid parsning av analys</h3>
          {analysisResult.analysisResult.error && (
            <p style={fallbackErrorText}>{analysisResult.analysisResult.error}</p>
          )}
          {analysisResult.analysisResult.rawContent && (
            <details>
              <summary style={fallbackSummary}>Visa rå innehåll</summary>
              <div style={fallbackContent}>{analysisResult.analysisResult.rawContent}</div>
            </details>
          )}
        </div>
      )}

      {!analysisResult.analysisResult && (
        <div style={waitingBox}>
          <div style={spinner}></div>
          <p style={waitingText}>Väntar på AI-analys från n8n workflow...</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
