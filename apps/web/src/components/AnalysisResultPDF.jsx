import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// MODERN & PROFESSIONELL STYLING
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#1a1a1a',
    backgroundColor: '#FFFFFF',
  },
  
  // Header - mer elegant
  headerContainer: {
    marginBottom: 24,
    borderBottom: '2 solid #CAE780',
    paddingBottom: 16,
  },
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#071119',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  
  subtitle: {
    fontSize: 12,
    color: '#02443E',
    fontWeight: 'light',
  },
  
  // Metadata box - modernare design
  metadataBox: {
    backgroundColor: 'linear-gradient(135deg, #F8FDF4 0%, #FFFFFF 100%)',
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    borderLeft: '4 solid #CAE780',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  
  metadataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottom: '1 solid #E8F5D3',
  },
  
  checkmarkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CAE780',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  checkmarkText: {
    fontSize: 12,
    color: '#071119',
    fontWeight: 'bold',
  },
  
  metadataTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#02443E',
    flex: 1,
  },
  
  metadataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  metadataItem: {
    width: '48%',
    marginBottom: 10,
    marginRight: '2%',
  },
  
  metadataLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  
  metadataValue: {
    fontSize: 11,
    color: '#02443E',
    fontWeight: 'medium',
  },
  
  // Badge - mer modern
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  
  badge: {
    backgroundColor: '#CAE780',
    color: '#071119',
    fontSize: 9,
    fontWeight: 'bold',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginRight: 8,
    shadowColor: '#CAE780',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  // Sektioner - förbättrad typografi
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#071119',
    letterSpacing: -0.3,
  },
  
  subsectionContainer: {
    backgroundColor: '#FAFBFC',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    borderLeft: '3 solid #CAE780',
  },
  
  subsectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#02443E',
    letterSpacing: -0.2,
  },
  
  categoryContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  
  categoryLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1 solid #E5E7EB',
  },
  
  // Bullets - elegantare
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 4,
  },
  
  bulletIcon: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
    marginTop: 5,
  },
  
  bulletGreen: {
    backgroundColor: '#CAE780',
  },
  
  bulletOrange: {
    backgroundColor: '#FFB84D',
  },
  
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
  },
  
  // Förbättringsbox - modernare
  improvementBox: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    marginTop: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderTop: '2 solid #CAE780',
    borderLeft: '2 solid #CAE780',
  },
  
  improvementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#02443E',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  
  improvementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CAE780',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  numberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#071119',
  },
  
  improvementText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
  },
  
  // Rekommendationsbox - premium look
  recommendationBox: {
    backgroundColor: '#02443E',
    padding: 20,
    marginTop: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  recommendationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CAE780',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  recommendationIconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#02443E',
  },
  
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  
  recommendationText: {
    fontSize: 10,
    lineHeight: 1.7,
    color: '#F0FDF4',
  },
  
  // Stats cards - ny feature
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  
  statCard: {
    backgroundColor: '#F8FDF4',
    borderRadius: 8,
    padding: 12,
    width: '31%',
    alignItems: 'center',
    borderTop: '3 solid #CAE780',
  },
  
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#02443E',
    marginBottom: 4,
  },
  
  statLabel: {
    fontSize: 8,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Dividers
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  
  // Footer
  footer: {
    marginTop: 30,
    paddingTop: 16,
    borderTop: '1 solid #E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
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

  // Räkna stats
  const totalStrengths = result?.parsed ? 
    (result.overallStrengths?.length || 0) + 
    Object.values(result.sections || {}).reduce((acc, section) => 
      acc + (section.strengths?.length || 0), 0) : 0;
  
  const totalWeaknesses = result?.parsed ?
    (result.overallWeaknesses?.length || 0) +
    Object.values(result.sections || {}).reduce((acc, section) => 
      acc + (section.weaknesses?.length || 0), 0) : 0;
  
  const improvementCount = result?.improvements?.length || 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Viva Impact Check</Text>
          <Text style={styles.subtitle}>
            Professionell annonsanalys för maximal effekt
          </Text>
        </View>

        {/* Stats cards */}
        {result?.parsed && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalStrengths}</Text>
              <Text style={styles.statLabel}>Styrkor</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalWeaknesses}</Text>
              <Text style={styles.statLabel}>Förbättringar</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{improvementCount}</Text>
              <Text style={styles.statLabel}>Förslag</Text>
            </View>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.metadataBox}>
          <View style={styles.metadataHeader}>
            <View style={styles.checkmarkCircle}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
            <Text style={styles.metadataTitle}>
              {analysisResult?.message || 'Analysresultat'}
            </Text>
          </View>
          
          <View style={styles.metadataGrid}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Fil</Text>
              <Text style={styles.metadataValue}>{fileName}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Storlek</Text>
              <Text style={styles.metadataValue}>{formatFileSize(data.fileSize)}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Format</Text>
              <Text style={styles.metadataValue}>
                {adType === 'video' ? 'Videoannons' : 'Bildannons'}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Plattform</Text>
              <Text style={styles.metadataValue}>
                {data.platform || analysisResult?.platform || 'N/A'}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Målgrupp</Text>
              <Text style={styles.metadataValue}>
                {data.targetAudience || analysisResult?.targetAudience || 'N/A'}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>AI-Modell</Text>
              <Text style={styles.metadataValue}>
                {data.aiProvider || analysisResult?.aiProvider || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {result?.parsed && (
          <View>
            {/* Badges */}
            <View style={styles.badgeContainer}>
              <Text style={styles.badge}>
                {result.type === 'video' ? '🎬 Videoanalys' : '🖼️ Bildanalys'}
              </Text>
            </View>

            {/* Resultat-sektioner */}
            {result.sections && Object.keys(result.sections).length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>📊 Detaljerad Analys</Text>
                
                {Object.entries(result.sections).map(([sectionName, items]) => (
                  <View key={sectionName} style={styles.subsectionContainer}>
                    <Text style={styles.subsectionTitle}>{sectionName}</Text>
                    
                    {/* Styrkor */}
                    {items.strengths && items.strengths.length > 0 && (
                      <View style={styles.categoryContainer}>
                        <Text style={styles.categoryLabel}>✅ Styrkor</Text>
                        {items.strengths.map((item, i) => (
                          <View key={i} style={styles.bulletRow}>
                            <View style={[styles.bulletIcon, styles.bulletGreen]} />
                            <Text style={styles.bulletText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    
                    {/* Förbättringsområden */}
                    {items.weaknesses && items.weaknesses.length > 0 && (
                      <View style={styles.categoryContainer}>
                        <Text style={styles.categoryLabel}>⚠️ Utvecklingsområden</Text>
                        {items.weaknesses.map((item, i) => (
                          <View key={i} style={styles.bulletRow}>
                            <View style={[styles.bulletIcon, styles.bulletOrange]} />
                            <Text style={styles.bulletText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Förbättringsförslag */}
            {result.improvements && result.improvements.length > 0 && (
              <View style={styles.improvementBox}>
                <Text style={styles.improvementTitle}>
                  💡 Konkreta Förbättringsförslag
                </Text>
                {result.improvements.map((item, i) => (
                  <View key={i} style={styles.improvementRow}>
                    <View style={styles.numberBadge}>
                      <Text style={styles.numberText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.improvementText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Samlad rekommendation */}
            {(result.recommendation || result.summary) && (
              <View style={styles.recommendationBox}>
                <View style={styles.recommendationHeader}>
                  <View style={styles.recommendationIcon}>
                    <Text style={styles.recommendationIconText}>⭐</Text>
                  </View>
                  <Text style={styles.recommendationTitle}>
                    Samlad Rekommendation
                  </Text>
                </View>
                <Text style={styles.recommendationText}>
                  {result.recommendation || result.summary}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Genererad: {formatTimestamp(data.timestamp)}
          </Text>
          <Text style={styles.footerText}>
            Viva Impact Check © 2025
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default AnalysisResultPDF;
