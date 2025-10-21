import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// KOMPAKT STYLING MED VIVA-FÄRGER
const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.4,
    color: '#071119',
    backgroundColor: '#FFFFFF',
  },
  
  // Header - kompakt
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#071119',
  },
  
  // Metadata box - kompakt med grön accent
  metadataBox: {
    backgroundColor: '#F8FDF4',
    padding: 12,
    marginBottom: 14,
    borderRadius: 6,
    borderLeft: '3 solid #CAE780',
    borderTop: '0.5 solid #E8F5D3',
    borderRight: '0.5 solid #E8F5D3',
    borderBottom: '0.5 solid #E8F5D3',
  },
  
  metadataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  checkmarkCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CAE780',
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  checkmarkText: {
    fontSize: 9,
    color: '#071119',
    fontWeight: 'bold',
  },
  
  metadataTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#02443E',
  },
  
  metadataRow: {
    flexDirection: 'row',
    marginBottom: 4,
    fontSize: 8.5,
  },
  
  metadataLabel: {
    width: 90,
    fontWeight: 'bold',
    color: '#071119',
  },
  
  metadataValue: {
    flex: 1,
    color: '#02443E',
  },
  
  // Badge - kompakt
  badge: {
    backgroundColor: '#CAE780',
    color: '#071119',
    fontSize: 8,
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Sektioner - kompakt
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 8,
    color: '#071119',
  },
  
  subsectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
    color: '#02443E',
  },
  
  categoryLabel: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#02443E',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 6,
    marginBottom: 3,
  },
  
  // Bullets - kompakta med färg
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 2,
  },
  
  bulletCircle: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 7,
    marginTop: 4,
  },
  
  bulletGreen: {
    backgroundColor: '#CAE780',
  },
  
  bulletDark: {
    backgroundColor: '#071119',
    opacity: 0.5,
  },
  
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: '#02443E',
  },
  
  // Förbättringsbox - kompakt
  improvementBox: {
    backgroundColor: '#F8FDF4',
    padding: 12,
    marginTop: 10,
    marginBottom: 8,
    borderRadius: 6,
    borderLeft: '3 solid #CAE780',
    borderTop: '0.5 solid #E8F5D3',
    borderRight: '0.5 solid #E8F5D3',
    borderBottom: '0.5 solid #E8F5D3',
  },
  
  improvementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  
  numberCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#CAE780',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  
  numberText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#071119',
  },
  
  improvementText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: '#02443E',
  },
  
  // Rekommendationsbox - kompakt
  recommendationBox: {
    backgroundColor: '#F8FDF4',
    padding: 12,
    marginTop: 12,
    borderRadius: 6,
    borderLeft: '3 solid #CAE780',
    borderTop: '1.5 solid #CAE780',
    borderRight: '1.5 solid #CAE780',
    borderBottom: '1.5 solid #CAE780',
  },
  
  recommendationTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#02443E',
  },
  
  recommendationText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#02443E',
  },
  
  // Summarybox - kompakt
  summaryBox: {
    backgroundColor: '#FAFAFA',
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    borderLeft: '3 solid #CAE780',
  },
  
  // Sektionskort - kompakt
  sectionCard: {
    marginBottom: 12,
    paddingBottom: 8,
  },
  
  divider: {
    height: 0.5,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },
  
  // Fel och väntan - kompakt
  errorBox: {
    backgroundColor: '#FEF2F2',
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    borderLeft: '3 solid #FCA5A5',
  },
  
  errorTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 5,
  },
  
  errorText: {
    fontSize: 8,
    color: '#B91C1C',
  },
});

// Hjälpfunktioner
const formatFileSize = (fileSize) => {
  if (!fileSize) return 'N/A';
  const size = Number(fileSize);
  if (Number.isNaN(size)) return 'N/A';
  return `${(size / 1024).toFixed(2)} KB`;
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return new Date().toLocaleString('sv-SE');
  const parsed = Number(timestamp);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toLocaleString('sv-SE');
  }
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? new Date().toLocaleString('sv-SE') : date.toLocaleString('sv-SE');
};

// Huvudkomponent
const AnalysisResultPDF = ({ analysisResult }) => {
  const result = analysisResult?.analysisResult;
  const data = analysisResult?.data || {};
  const fileName = analysisResult?.fileName || data.fileName || 'Okänt filnamn';
  const adType = data.adType || result?.type;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Titel */}
        <Text style={styles.title}>Viva Impact Check</Text>

        {/* Metadata med grön accent */}
        <View style={styles.metadataBox}>
          <View style={styles.metadataHeader}>
            <View style={styles.checkmarkCircle}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
            <Text style={styles.metadataTitle}>
              {analysisResult?.message || 'Analysresultat'}
            </Text>
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
            <Text style={styles.metadataValue}>
              {data.platform || analysisResult?.platform || 'N/A'}
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Målgrupp:</Text>
            <Text style={styles.metadataValue}>
              {data.targetAudience || analysisResult?.targetAudience || 'N/A'}
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>AI-modell:</Text>
            <Text style={styles.metadataValue}>
              {data.aiProvider || analysisResult?.aiProvider || 'N/A'}
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Tidsstämpel:</Text>
            <Text style={styles.metadataValue}>{formatTimestamp(data.timestamp)}</Text>
          </View>
        </View>

        {result?.parsed && (
          <View>
            {/* Badge */}
            <Text style={styles.badge}>
              {result.type === 'video' ? 'Videoanalys' : 'Bildanalys'}
            </Text>

            {/* Resultat-sektioner */}
            {result.sections && Object.keys(result.sections).length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Resultat</Text>
                
                {Object.entries(result.sections).map(([sectionName, items], idx) => (
                  <View key={sectionName} style={styles.sectionCard}>
                    <Text style={styles.subsectionTitle}>{sectionName}</Text>
                    
                    {/* Styrkor */}
                    {items.strengths && items.strengths.length > 0 && (
                      <View>
                        <Text style={styles.categoryLabel}>STYRKOR</Text>
                        {items.strengths.map((item, i) => (
                          <View key={i} style={styles.bulletRow}>
                            <View style={[styles.bulletCircle, styles.bulletGreen]} />
                            <Text style={styles.bulletText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    
                    {/* Förbättringsområden */}
                    {items.weaknesses && items.weaknesses.length > 0 && (
                      <View>
                        <Text style={styles.categoryLabel}>FÖRBÄTTRINGSOMRÅDEN</Text>
                        {items.weaknesses.map((item, i) => (
                          <View key={i} style={styles.bulletRow}>
                            <View style={[styles.bulletCircle, styles.bulletDark]} />
                            <Text style={styles.bulletText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    
                    {idx < Object.keys(result.sections).length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Övergripande styrkor (video) */}
            {result.type === 'video' && result.overallStrengths && result.overallStrengths.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Övergripande styrkor</Text>
                {result.overallStrengths.map((item, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <View style={[styles.bulletCircle, styles.bulletGreen]} />
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Förbättringsområden (video) */}
            {result.type === 'video' && result.overallWeaknesses && result.overallWeaknesses.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Förbättringsområden</Text>
                {result.overallWeaknesses.map((item, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <View style={[styles.bulletCircle, styles.bulletDark]} />
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Sammanfattning (bild) */}
            {result.type === 'image' && result.summary && (
              <View style={styles.summaryBox}>
                <Text style={styles.subsectionTitle}>Sammanfattning</Text>
                <Text style={styles.recommendationText}>{result.summary}</Text>
              </View>
            )}

            {/* Förbättringsförslag */}
            {result.improvements && result.improvements.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Konkreta förbättringsförslag</Text>
                <View style={styles.improvementBox}>
                  {result.improvements.map((item, i) => (
                    <View key={i} style={styles.improvementRow}>
                      <View style={styles.numberCircle}>
                        <Text style={styles.numberText}>{i + 1}</Text>
                      </View>
                      <Text style={styles.improvementText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Motivering (bild) */}
            {result.type === 'image' && result.motivation && (
              <View style={styles.summaryBox}>
                <Text style={styles.subsectionTitle}>Motivering</Text>
                <Text style={styles.recommendationText}>{result.motivation}</Text>
              </View>
            )}

            {/* Samlad rekommendation (video) */}
            {result.type === 'video' && result.recommendation && (
              <View style={styles.recommendationBox}>
                <Text style={styles.recommendationTitle}>Samlad rekommendation</Text>
                <Text style={styles.recommendationText}>{result.recommendation}</Text>
              </View>
            )}
          </View>
        )}

        {/* Fel */}
        {result && !result.parsed && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>⚠️ Fel vid parsning av analys</Text>
            {result.error && <Text style={styles.errorText}>{result.error}</Text>}
          </View>
        )}

        {/* Väntar */}
        {!result && (
          <View style={styles.improvementBox}>
            <Text style={styles.recommendationText}>
              Väntar på AI-analys från n8n workflow...
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default AnalysisResultPDF;
