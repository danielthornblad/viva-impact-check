import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Professionella stilar med Viva-färger
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
    color: '#071119',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#071119',
  },
  metadataBox: {
    backgroundColor: '#f8fdf4',
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
    border: '1 solid #CAE780',
  },
  metadataTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#02443E',
  },
  checkmark: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#CAE780',
    color: '#071119',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 6,
  },
  metadataRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  metadataLabel: {
    width: 120,
    fontWeight: 'bold',
    color: '#071119',
  },
  metadataValue: {
    flex: 1,
    color: '#02443E',
  },
  badge: {
    backgroundColor: '#CAE780',
    padding: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#02443E',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    color: '#071119',
  },
  subsectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#02443E',
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#02443E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
    marginTop: 4,
  },
  bulletGreen: {
    backgroundColor: '#CAE780',
  },
  bulletDark: {
    backgroundColor: '#071119',
    opacity: 0.4,
  },
  bulletText: {
    flex: 1,
    color: '#02443E',
  },
  sectionCard: {
    marginBottom: 16,
  },
  improvementBox: {
    backgroundColor: '#f8fdf4',
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
    border: '1 solid #CAE780',
  },
  improvementItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  improvementNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CAE780',
    color: '#071119',
    textAlign: 'center',
    lineHeight: 1.8,
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 11,
  },
  recommendationBox: {
    backgroundColor: '#f8fdf4',
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    border: '2 solid #CAE780',
  },
  summaryText: {
    color: '#02443E',
    lineHeight: 1.6,
  },
  fallbackBox: {
    backgroundColor: '#fef2f2',
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    border: '1 solid #fca5a5',
  },
  fallbackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#991b1b',
    marginBottom: 8,
  },
  fallbackText: {
    color: '#b91c1c',
    fontSize: 10,
  },
  waitingBox: {
    backgroundColor: '#f8fdf4',
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    border: '1 solid #CAE780',
  },
});

const formatFileSize = (fileSize) => {
  if (!fileSize) return 'N/A';
  const size = Number(fileSize);
  if (Number.isNaN(size)) return 'N/A';
  return `${(size / 1024).toFixed(2)} KB`;
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return new Date().toLocaleString('sv-SE');
  }
  const parsed = Number(timestamp);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toLocaleString('sv-SE');
  }
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? new Date().toLocaleString('sv-SE') : date.toLocaleString('sv-SE');
};

const AnalysisResultPDF = ({ analysisResult }) => {
  const result = analysisResult?.analysisResult;
  const data = analysisResult?.data || {};
  const fileName = analysisResult?.fileName || data.fileName || 'Okänt filnamn';
  const adType = data.adType || result?.type;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Viva Impact Check</Text>

        {/* Metadata */}
        <View style={styles.metadataBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={styles.checkmark}>
              <Text>✓</Text>
            </View>
            <Text style={styles.metadataTitle}>{analysisResult?.message || 'Analysresultat'}</Text>
          </View>
          
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Filnamn:</Text>
            <Text style={styles.metadataValue}>{fileName}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Filstorlek:</Text>
            <Text style={styles.metadataValue}>{formatFileSize(data.fileSize)}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Annonstyp:</Text>
            <Text style={styles.metadataValue}>
              {adType === 'video' ? 'Videoannons' : 'Bildannons'}
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Platform:</Text>
            <Text style={styles.metadataValue}>{data.platform || analysisResult?.platform || 'N/A'}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Målgrupp:</Text>
            <Text style={styles.metadataValue}>{data.targetAudience || analysisResult?.targetAudience || 'N/A'}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>AI-modell:</Text>
            <Text style={styles.metadataValue}>{data.aiProvider || analysisResult?.aiProvider || 'N/A'}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Tidsstämpel:</Text>
            <Text style={styles.metadataValue}>{formatTimestamp(data.timestamp)}</Text>
          </View>
        </View>

        {result?.parsed && (
          <View>
            <Text style={styles.badge}>
              {result.type === 'video' ? 'Videoanalys' : 'Bildanalys'}
            </Text>

            {/* Sektioner med styrkor/svagheter */}
            {result.sections && Object.keys(result.sections).length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Resultat</Text>
                {Object.entries(result.sections).map(([sectionName, items]) => (
                  <View key={sectionName} style={styles.sectionCard}>
                    <Text style={styles.subsectionTitle}>{sectionName}</Text>
                    
                    {items.strengths && items.strengths.length > 0 && (
                      <View>
                        <Text style={styles.categoryLabel}>Styrkor</Text>
                        {items.strengths.map((item, idx) => (
                          <View key={idx} style={styles.bulletPoint}>
                            <View style={[styles.bullet, styles.bulletGreen]} />
                            <Text style={styles.bulletText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    
                    {items.weaknesses && items.weaknesses.length > 0 && (
                      <View>
                        <Text style={styles.categoryLabel}>Förbättringsområden</Text>
                        {items.weaknesses.map((item, idx) => (
                          <View key={idx} style={styles.bulletPoint}>
                            <View style={[styles.bullet, styles.bulletDark]} />
                            <Text style={styles.bulletText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {items.uncertainties && items.uncertainties.length > 0 && (
                      <View>
                        <Text style={styles.categoryLabel}>Osäkerheter</Text>
                        {items.uncertainties.map((item, idx) => (
                          <View key={idx} style={styles.bulletPoint}>
                            <View style={[styles.bullet, styles.bulletGreen]} />
                            <Text style={styles.bulletText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Övergripande styrkor (video) */}
            {result.type === 'video' && result.overallStrengths && result.overallStrengths.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Övergripande styrkor</Text>
                {result.overallStrengths.map((item, idx) => (
                  <View key={idx} style={styles.bulletPoint}>
                    <View style={[styles.bullet, styles.bulletGreen]} />
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Förbättringsområden (video) */}
            {result.type === 'video' && result.overallWeaknesses && result.overallWeaknesses.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Förbättringsområden</Text>
                {result.overallWeaknesses.map((item, idx) => (
                  <View key={idx} style={styles.bulletPoint}>
                    <View style={[styles.bullet, styles.bulletDark]} />
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Sammanfattning (bild) */}
            {result.type === 'image' && result.summary && (
              <View style={styles.improvementBox}>
                <Text style={styles.subsectionTitle}>Sammanfattning</Text>
                <Text style={styles.summaryText}>{result.summary}</Text>
              </View>
            )}

            {/* Förbättringsförslag */}
            {result.improvements && result.improvements.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Konkreta förbättringsförslag</Text>
                <View style={styles.improvementBox}>
                  {result.improvements.map((item, idx) => (
                    <View key={idx} style={styles.improvementItem}>
                      <Text style={styles.improvementNumber}>{idx + 1}</Text>
                      <Text style={[styles.bulletText, { flex: 1 }]}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Motivering (bild) */}
            {result.type === 'image' && result.motivation && (
              <View style={styles.improvementBox}>
                <Text style={styles.subsectionTitle}>Motivering</Text>
                <Text style={styles.summaryText}>{result.motivation}</Text>
              </View>
            )}

            {/* Rekommendation (video) */}
            {result.type === 'video' && result.recommendation && (
              <View style={styles.recommendationBox}>
                <Text style={styles.subsectionTitle}>Samlad rekommendation</Text>
                <Text style={styles.summaryText}>{result.recommendation}</Text>
              </View>
            )}
          </View>
        )}

        {/* Om parsning misslyckades */}
        {result && !result.parsed && (
          <View style={styles.fallbackBox}>
            <Text style={styles.fallbackTitle}>⚠️ Fel vid parsning av analys</Text>
            {result.error && (
              <Text style={styles.fallbackText}>{result.error}</Text>
            )}
          </View>
        )}

        {/* Väntar på resultat */}
        {!result && (
          <View style={styles.waitingBox}>
            <Text style={styles.summaryText}>Väntar på AI-analys från n8n workflow...</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default AnalysisResultPDF;
