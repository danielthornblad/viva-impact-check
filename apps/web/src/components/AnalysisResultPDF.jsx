import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Path, Circle } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  
  // Cover section with dramatic dark design
  cover: {
    height: 280,
    backgroundColor: '#000000',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  
  // Green accent bar at top
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#00FF41',
  },
  
  coverContent: {
    paddingHorizontal: 60,
    paddingTop: 80,
  },
  
  logo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00FF41',
    letterSpacing: 4,
    marginBottom: 40,
  },
  
  mainTitle: {
    fontSize: 42,
    fontWeight: 'thin',
    color: '#FFFFFF',
    letterSpacing: -1,
    lineHeight: 1.1,
    marginBottom: 12,
  },
  
  subtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: 'light',
    letterSpacing: 0.5,
  },
  
  timestamp: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    fontSize: 10,
    color: '#444444',
    letterSpacing: 0.5,
  },
  
  // Metrics bar
  metricsBar: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    paddingVertical: 32,
    paddingHorizontal: 60,
  },
  
  metric: {
    flex: 1,
    borderRight: '1 solid #E0E0E0',
  },
  
  metricLast: {
    flex: 1,
  },
  
  metricValue: {
    fontSize: 32,
    fontWeight: 'light',
    color: '#000000',
    marginBottom: 6,
  },
  
  metricLabel: {
    fontSize: 9,
    fontWeight: 'normal',
    color: '#888888',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  
  // Content container
  content: {
    paddingHorizontal: 60,
    paddingTop: 48,
    paddingBottom: 60,
  },
  
  // Metadata section
  metadata: {
    marginBottom: 48,
  },
  
  metadataGrid: {
    flexDirection: 'row',
    borderTop: '1 solid #000000',
    paddingTop: 24,
  },
  
  metadataColumn: {
    flex: 1,
  },
  
  metadataItem: {
    marginBottom: 20,
  },
  
  metadataLabel: {
    fontSize: 8,
    color: '#888888',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  
  metadataValue: {
    fontSize: 13,
    color: '#000000',
    fontWeight: 'light',
  },
  
  // Section styling
  analysisSection: {
    marginBottom: 48,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  
  sectionNumber: {
    fontSize: 36,
    fontWeight: 'thin',
    color: '#000000',
    marginRight: 24,
    width: 48,
  },
  
  sectionTitleWrapper: {
    flex: 1,
  },
  
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'light',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  
  sectionCategory: {
    fontSize: 10,
    color: '#888888',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  // Content blocks
  contentBlock: {
    marginBottom: 32,
    paddingLeft: 72,
  },
  
  blockTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: '1 solid #E0E0E0',
  },
  
  // List items
  listItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  
  bullet: {
    width: 20,
    marginRight: 16,
    paddingTop: 6,
  },
  
  bulletDot: {
    width: 4,
    height: 4,
    backgroundColor: '#00FF41',
    borderRadius: 2,
  },
  
  bulletDotWeak: {
    backgroundColor: '#FFB800',
  },
  
  listText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.8,
    color: '#333333',
  },
  
  listTextBold: {
    fontWeight: 'bold',
    color: '#000000',
  },
  
  // Improvements section
  improvementsSection: {
    backgroundColor: '#000000',
    marginHorizontal: -60,
    padding: 48,
    paddingHorizontal: 60,
    marginTop: 60,
    marginBottom: 48,
  },
  
  improvementsTitle: {
    fontSize: 28,
    fontWeight: 'thin',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  
  improvementsSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 36,
  },
  
  improvementItem: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  
  improvementIndex: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#00FF41',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  
  improvementIndexText: {
    fontSize: 14,
    color: '#00FF41',
    fontWeight: 'light',
  },
  
  improvementText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 1.8,
    color: '#CCCCCC',
    paddingTop: 8,
  },
  
  // Summary section
  summarySection: {
    borderTop: '2 solid #000000',
    paddingTop: 36,
    marginTop: 48,
  },
  
  summaryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#000000',
    marginBottom: 20,
  },
  
  summaryText: {
    fontSize: 14,
    lineHeight: 1.9,
    color: '#000000',
    fontWeight: 'light',
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAFAFA',
    paddingVertical: 20,
    paddingHorizontal: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  footerLeft: {
    fontSize: 10,
    color: '#888888',
  },
  
  footerRight: {
    fontSize: 10,
    color: '#888888',
    textAlign: 'right',
  },
});

const formatFileSize = (fileSize) => {
  if (!fileSize) return '—';
  const size = Number(fileSize);
  if (Number.isNaN(size)) return '—';
  const mb = size / 1024 / 1024;
  if (mb > 1) return `${mb.toFixed(2)} MB`;
  return `${(size / 1024).toFixed(0)} KB`;
};

const formatDate = (timestamp) => {
  if (!timestamp) return new Date().toLocaleDateString('sv-SE');
  const date = new Date(timestamp);
  return date.toLocaleDateString('sv-SE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const AnalysisResultPDF = ({ analysisResult }) => {
  const result = analysisResult?.analysisResult;
  const data = analysisResult?.data || {};
  const fileName = analysisResult?.fileName || data.fileName || 'Unknown';
  const adType = data.adType || result?.type;
  
  const totalStrengths = result?.parsed ? 
    (result.overallStrengths?.length || 0) + 
    Object.values(result.sections || {}).reduce((acc, section) => 
      acc + (section.strengths?.length || 0), 0) : 0;
  
  const totalWeaknesses = result?.parsed ?
    (result.overallWeaknesses?.length || 0) +
    Object.values(result.sections || {}).reduce((acc, section) => 
      acc + (section.weaknesses?.length || 0), 0) : 0;
  
  const improvementCount = result?.improvements?.length || 0;

  // Helper to extract bold text from items
  const extractBoldText = (text) => {
    const colonIndex = text.indexOf(':');
    if (colonIndex > 0) {
      return {
        bold: text.substring(0, colonIndex),
        rest: text.substring(colonIndex)
      };
    }
    return { bold: '', rest: text };
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cover Section */}
        <View style={styles.cover}>
          <View style={styles.topBar} />
          <View style={styles.coverContent}>
            <Text style={styles.logo}>VIVA</Text>
            <Text style={styles.mainTitle}>Impact Analysis</Text>
            <Text style={styles.subtitle}>Advertisement Performance Report</Text>
          </View>
          <Text style={styles.timestamp}>{formatDate(data.timestamp)}</Text>
        </View>

        {/* Metrics Bar */}
        {result?.parsed && (
          <View style={styles.metricsBar}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{totalStrengths}</Text>
              <Text style={styles.metricLabel}>Identified Strengths</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{totalWeaknesses}</Text>
              <Text style={styles.metricLabel}>Areas to Improve</Text>
            </View>
            <View style={styles.metricLast}>
              <Text style={styles.metricValue}>{improvementCount}</Text>
              <Text style={styles.metricLabel}>Recommendations</Text>
            </View>
          </View>
        )}

        {/* Main Content */}
        <View style={styles.content}>
          {/* Metadata */}
          <View style={styles.metadata}>
            <View style={styles.metadataGrid}>
              <View style={styles.metadataColumn}>
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>File Name</Text>
                  <Text style={styles.metadataValue}>{fileName}</Text>
                </View>
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>File Size</Text>
                  <Text style={styles.metadataValue}>{formatFileSize(data.fileSize)}</Text>
                </View>
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Format</Text>
                  <Text style={styles.metadataValue}>
                    {adType === 'video' ? 'Video' : 'Static Image'}
                  </Text>
                </View>
              </View>
              <View style={styles.metadataColumn}>
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Platform</Text>
                  <Text style={styles.metadataValue}>{data.platform || 'Not specified'}</Text>
                </View>
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Target Audience</Text>
                  <Text style={styles.metadataValue}>{data.targetAudience || 'General'}</Text>
                </View>
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Analysis Model</Text>
                  <Text style={styles.metadataValue}>{data.aiProvider || 'Advanced AI'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Analysis Sections */}
          {result?.parsed && result.sections && (
            <>
              {Object.entries(result.sections).map(([sectionName, items], index) => (
                <View key={sectionName} style={styles.analysisSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionNumber}>{String(index + 1).padStart(2, '0')}</Text>
                    <View style={styles.sectionTitleWrapper}>
                      <Text style={styles.sectionTitle}>{sectionName}</Text>
                      <Text style={styles.sectionCategory}>Performance Analysis</Text>
                    </View>
                  </View>
                  
                  {items.strengths && items.strengths.length > 0 && (
                    <View style={styles.contentBlock}>
                      <Text style={styles.blockTitle}>Strengths</Text>
                      {items.strengths.map((item, i) => {
                        const { bold, rest } = extractBoldText(item);
                        return (
                          <View key={i} style={styles.listItem}>
                            <View style={styles.bullet}>
                              <View style={styles.bulletDot} />
                            </View>
                            <Text style={styles.listText}>
                              {bold && <Text style={styles.listTextBold}>{bold}</Text>}
                              {rest}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                  
                  {items.weaknesses && items.weaknesses.length > 0 && (
                    <View style={styles.contentBlock}>
                      <Text style={styles.blockTitle}>Areas for Development</Text>
                      {items.weaknesses.map((item, i) => {
                        const { bold, rest } = extractBoldText(item);
                        return (
                          <View key={i} style={styles.listItem}>
                            <View style={styles.bullet}>
                              <View style={[styles.bulletDot, styles.bulletDotWeak]} />
                            </View>
                            <Text style={styles.listText}>
                              {bold && <Text style={styles.listTextBold}>{bold}</Text>}
                              {rest}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              ))}
            </>
          )}

          {/* Improvements Section */}
          {result?.improvements && result.improvements.length > 0 && (
            <View style={styles.improvementsSection}>
              <Text style={styles.improvementsTitle}>Strategic Recommendations</Text>
              <Text style={styles.improvementsSubtitle}>
                Actionable improvements for enhanced performance
              </Text>
              {result.improvements.map((item, i) => (
                <View key={i} style={styles.improvementItem}>
                  <View style={styles.improvementIndex}>
                    <Text style={styles.improvementIndexText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.improvementText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Summary */}
          {(result?.recommendation || result?.summary) && (
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Executive Summary</Text>
              <Text style={styles.summaryText}>
                {result.recommendation || result.summary}
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>Viva Impact Analysis</Text>
          <Text style={styles.footerRight}>Page 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default AnalysisResultPDF;
