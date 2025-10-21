import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

/**
 * GOLDEN TEMPLATE for stable layout in @react-pdf/renderer
 * - Proper TTF/OTF fonts (no WOFF/WOFF2)
 * - Hyphenation callback (basic, safe)
 * - Fixed header & footer with page numbers
 * - Predictable borders (no shorthands) & no shadows
 * - Section break hints: break, minPresenceAhead, wrap={false}
 * - Chunked lists to avoid awkward page splits
 */

// 1) Register fonts (TTF/OTF only). Replace paths with your actual hosted files.
try {
  Font.register({
    family: 'Inter',
    fonts: [
      { src: '/fonts/Inter-Regular.ttf', fontWeight: 400 },
      { src: '/fonts/Inter-SemiBold.ttf', fontWeight: 600 },
      { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
    ],
  });
} catch (e) {
  // Fallback handled by default fontFamily in styles.page
}

// 2) Hyphenation: safe fallback—keeps URLs and numbers intact.
Font.registerHyphenationCallback((word) => {
  if (!word) return [''];
  if (/^https?:\/\//.test(word) || /\d/.test(word)) return [word];
  // naive chunking to allow breaks for long words in Swedish/English
  const parts = word.match(/.{1,6}/g) || [word];
  return parts;
});

// 3) Utilities
const formatFileSize = (fileSize) => {
  if (!fileSize) return 'N/A';
  const size = Number(fileSize);
  if (Number.isNaN(size)) return 'N/A';
  const kb = size / 1024;
  return `${kb.toFixed(2)} KB`;
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return new Date().toLocaleString('sv-SE');
  const parsed = Number(timestamp);
  if (!Number.isNaN(parsed)) return new Date(parsed).toLocaleString('sv-SE');
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? new Date().toLocaleString('sv-SE') : date.toLocaleString('sv-SE');
};

const chunkArray = (arr = [], size = 6) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

// 4) Styles – avoid unsupported shorthands, keep spacing generous
const styles = StyleSheet.create({
  page: {
    paddingTop: 120, // reserve space for fixed header
    paddingBottom: 72, // reserve space for fixed footer
    paddingHorizontal: 48,
    fontFamily: 'Inter', // will fallback to Helvetica if registration fails
    backgroundColor: '#FFFFFF',
  },

  // Fixed header
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#0A1628',
    paddingTop: 28,
    paddingBottom: 16,
    paddingLeft: 48,
    paddingRight: 48,
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#86EF90',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: 400,
    color: '#94A3B8',
  },
  headerDate: {
    position: 'absolute',
    right: 48,
    bottom: 16,
    fontSize: 10,
    color: '#64748B',
  },

  // Fixed footer
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderTopStyle: 'solid',
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0A1628',
  },
  footerText: {
    fontSize: 9,
    color: '#94A3B8',
    textAlign: 'right',
  },

  // Score strip (compact, non-wrapping to avoid bad splits)
  scoreSection: {
    marginTop: 12,
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreItem: { alignItems: 'center' },
  scoreValue: { fontSize: 28, fontWeight: 700, color: '#0A1628', marginBottom: 2 },
  scoreLabel: { fontSize: 9, fontWeight: 600, color: '#64748B', textTransform: 'uppercase' },
  scoreAccent: { width: 32, height: 3, backgroundColor: '#86EF90', marginTop: 6 },

  // Cards & sections
  section: { marginBottom: 28 },
  sectionHeader: { marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#0A1628', marginBottom: 2 },
  sectionSubtitle: { fontSize: 10, color: '#64748B' },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 18,
    paddingRight: 18,
    marginBottom: 10,
  },

  gridRow: { flexDirection: 'row', flexWrap: 'wrap' },
  gridCol: { width: '33.33%', paddingRight: 12, marginBottom: 12 },
  label: { fontSize: 8, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 3 },
  value: { fontSize: 11, fontWeight: 500, color: '#0F172A' },

  tag: {
    backgroundColor: '#EFF6FF',
    color: '#1E40AF',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 600,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },

  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  bulletBox: { width: 20, height: 20, backgroundColor: '#F1F5F9', borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  bulletText: { fontSize: 9, fontWeight: 700, color: '#64748B' },
  listText: { fontSize: 10, color: '#475569', lineHeight: 14 },

  // Dark improvement panel
  improvementSection: {
    backgroundColor: '#0A1628',
    borderRadius: 12,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    paddingRight: 24,
    marginTop: 24,
  },
  improvementTitle: { fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 },
  improvementSubtitle: { fontSize: 10, color: '#94A3B8', marginBottom: 10 },
  improvementItem: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  improvementNumber: { width: 28, height: 28, backgroundColor: '#86EF90', borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  improvementNumberText: { fontSize: 12, fontWeight: 700, color: '#0A1628' },
  improvementText: { fontSize: 10, color: '#FFFFFF', lineHeight: 15 },

  recommendationBox: {
    marginTop: 24,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 18,
    paddingRight: 18,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#86EF90',
    borderLeftStyle: 'solid',
  },
  recommendationTitle: { fontSize: 12, fontWeight: 700, color: '#0A1628', marginBottom: 8 },
  recommendationText: { fontSize: 10, color: '#0F172A', lineHeight: 15 },
});

// 5) Component
const AnalysisResultPDF = ({ analysisResult }) => {
  const result = analysisResult?.analysisResult;
  const data = analysisResult?.data || {};
  const fileName = analysisResult?.fileName || data.fileName || 'Okänt filnamn';
  const adType = data.adType || result?.type;

  const parsed = !!result?.parsed;

  // counts
  const totalStrengths = parsed
    ? (result.overallStrengths?.length || 0) +
      Object.values(result.sections || {}).reduce((acc, section) => acc + (section.strengths?.length || 0), 0)
    : 0;

  const totalWeaknesses = parsed
    ? (result.overallWeaknesses?.length || 0) +
      Object.values(result.sections || {}).reduce((acc, section) => acc + (section.weaknesses?.length || 0), 0)
    : 0;

  const improvementCount = result?.improvements?.length || 0;

  const sectionEntries = Object.entries(result?.sections || {});

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Fixed Header */}
        <View style={styles.headerContainer} fixed>
          <View style={styles.headerAccent} />
          <Text style={styles.headerTitle}>Impact Analysis Report</Text>
          <Text style={styles.headerSubtitle}>Comprehensive advertising performance evaluation</Text>
          <Text style={styles.headerDate}>{formatTimestamp(data.timestamp)}</Text>
        </View>

        {/* File Card */}
        <View style={[styles.card, { marginTop: 4 }]} minPresenceAhead={120}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', borderBottomStyle: 'solid' }}>
            <View style={{ width: 36, height: 36, backgroundColor: '#86EF90', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: 700, color: '#0A1628' }}>{adType === 'video' ? '▶' : '■'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{fileName}</Text>
              <Text style={{ fontSize: 10, color: '#64748B' }}>{adType === 'video' ? 'Video Advertisement' : 'Image Advertisement'}</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>File Size</Text>
              <Text style={styles.value}>{formatFileSize(data.fileSize)}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Platform</Text>
              <Text style={styles.value}>{data.platform || 'N/A'}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Target</Text>
              <Text style={styles.value}>{data.targetAudience || 'N/A'}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>AI Model</Text>
              <Text style={styles.value}>{data.aiProvider || 'N/A'}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>Complete</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Quality</Text>
              <Text style={styles.value}>Production</Text>
            </View>
          </View>
        </View>

        {/* Score strip */}
        {parsed && (
          <View style={styles.scoreSection} wrap={false}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{totalStrengths}</Text>
              <Text style={styles.scoreLabel}>Strengths</Text>
              <View style={styles.scoreAccent} />
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{totalWeaknesses}</Text>
              <Text style={styles.scoreLabel}>Areas</Text>
              <View style={styles.scoreAccent} />
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{improvementCount}</Text>
              <Text style={styles.scoreLabel}>Actions</Text>
              <View style={styles.scoreAccent} />
            </View>
          </View>
        )}

        {/* Detailed Analysis */}
        {parsed && sectionEntries.length > 0 && (
          <View style={styles.section} break minPresenceAhead={140}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Detailed Analysis</Text>
              <Text style={styles.sectionSubtitle}>Component-level evaluation and insights</Text>
            </View>

            {sectionEntries.map(([sectionName, items]) => (
              <View key={sectionName} minPresenceAhead={120}>
                <Text style={styles.tag}>{sectionName}</Text>

                {/* Strengths (chunked) */}
                {Array.isArray(items?.strengths) && items.strengths.length > 0 &&
                  chunkArray(items.strengths, 6).map((chunk, idx) => (
                    <View key={`s-${sectionName}-${idx}`} style={styles.card} minPresenceAhead={110}>
                      <Text style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>Strengths</Text>
                      {chunk.map((item, i) => (
                        <View key={i} style={styles.listItem}>
                          <View style={styles.bulletBox}><Text style={styles.bulletText}>{i + 1}</Text></View>
                          <Text style={styles.listText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  ))}

                {/* Weaknesses (chunked) */}
                {Array.isArray(items?.weaknesses) && items.weaknesses.length > 0 &&
                  chunkArray(items.weaknesses, 6).map((chunk, idx) => (
                    <View key={`w-${sectionName}-${idx}`} style={styles.card} minPresenceAhead={110}>
                      <Text style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>Areas for Improvement</Text>
                      {chunk.map((item, i) => (
                        <View key={i} style={styles.listItem}>
                          <View style={styles.bulletBox}><Text style={styles.bulletText}>{i + 1}</Text></View>
                          <Text style={styles.listText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
              </View>
            ))}
          </View>
        )}

        {/* Improvements */}
        {Array.isArray(result?.improvements) && result.improvements.length > 0 && (
          <View style={styles.improvementSection} break minPresenceAhead={140}>
            <Text style={styles.improvementTitle}>Recommended Actions</Text>
            <Text style={styles.improvementSubtitle}>Strategic improvements for maximum impact</Text>

            {chunkArray(result.improvements, 6).map((chunk, idx) => (
              <View key={`imp-${idx}`}>
                {chunk.map((item, i) => (
                  <View key={i} style={styles.improvementItem}>
                    <View style={styles.improvementNumber}><Text style={styles.improvementNumberText}>{i + 1 + idx * 6}</Text></View>
                    <Text style={styles.improvementText}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Summary */}
        {(result?.recommendation || result?.summary) && (
          <View style={styles.recommendationBox} minPresenceAhead={100}>
            <Text style={styles.recommendationTitle}>Executive Summary</Text>
            <Text style={styles.recommendationText}>{result.recommendation || result.summary}</Text>
          </View>
        )}

        {/* Fixed Footer with page numbers */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLogo}>VIVA</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
            `Impact Analysis Report  •  Sida ${pageNumber} av ${totalPages}`
          )} />
        </View>
      </Page>
    </Document>
  );
};

export default AnalysisResultPDF;
