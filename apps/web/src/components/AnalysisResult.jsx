import React from 'react';
import MetadataSection from './MetadataSection';
import StrengthsWeaknessesSection from './StrengthsWeaknessesSection';
import ImprovementsSection from './ImprovementsSection';
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

  return (
    <div style={analysisContainer}>
      <h2 style={analysisTitle}>Viva Impact Check</h2>

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
