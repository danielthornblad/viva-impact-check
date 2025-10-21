import React from 'react';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#071119',
    lineHeight: 1.4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  messageBox: {
    padding: 12,
    backgroundColor: '#E6F7F4',
    borderRadius: 6,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 11,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metadataLabel: {
    fontWeight: 'bold',
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  badge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#02443E',
    border: '1px solid #02443E',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  card: {
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: '1px solid #D6D6D7',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletSymbol: {
    marginRight: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
  },
  numberedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  numberCircle: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  paragraph: {
    fontSize: 11,
  },
  fallbackBox: {
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 6,
  },
  codeBlock: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F4F4F5',
    borderRadius: 4,
    fontSize: 9,
  },
  waitingBox: {
    padding: 12,
    backgroundColor: '#F0F4FF',
    borderRadius: 6,
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

const BulletList = ({ items }) => (
  <View>
    {items.map((item, index) => (
      <View key={`${item}-${index}`} style={styles.bulletRow}>
        <Text style={styles.bulletSymbol}>•</Text>
        <Text style={styles.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
);

const AnalysisResultPDF = ({ analysisResult }) => {
  const result = analysisResult?.analysisResult;
  const data = analysisResult?.data ?? {};
  const fileName = analysisResult?.fileName ?? data.fileName ?? 'Okänt filnamn';
  const adType = data.adType ?? result?.type;
  const adTypeLabel = adType === 'video' ? 'Videoannons' : 'Bildannons';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Viva Impact Check</Text>

        {analysisResult?.message && (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{analysisResult.message}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metadata</Text>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Filnamn:</Text>
            <Text>{fileName}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Filstorlek:</Text>
            <Text>{formatFileSize(data.fileSize)}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Annonstyp:</Text>
            <Text>{adTypeLabel}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Plattform:</Text>
            <Text>{data.platform ?? analysisResult?.platform ?? 'N/A'}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Målgrupp:</Text>
            <Text>{data.targetAudience ?? analysisResult?.targetAudience ?? 'N/A'}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>AI-modell:</Text>
            <Text>{data.aiProvider ?? analysisResult?.aiProvider ?? 'N/A'}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Tidsstämpel:</Text>
            <Text>{formatTimestamp(data.timestamp)}</Text>
          </View>
        </View>

        {result?.parsed && (
          <View>
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>{result.type === 'video' ? 'Videoanalys' : 'Bildanalys'}</Text>
            </View>

            {result.sections && Object.keys(result.sections).length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resultat</Text>
                {Object.entries(result.sections).map(([sectionName, items]) => (
                  <View key={sectionName} style={styles.card}>
                    <Text style={styles.subsectionTitle}>{sectionName}</Text>

                    {items.strengths && items.strengths.length > 0 && (
                      <View style={{ marginBottom: 6 }}>
                        <Text style={styles.paragraph}>Styrkor</Text>
                        <BulletList items={items.strengths} />
                      </View>
                    )}

                    {items.weaknesses && items.weaknesses.length > 0 && (
                      <View style={{ marginBottom: 6 }}>
                        <Text style={styles.paragraph}>Förbättringsområden</Text>
                        <BulletList items={items.weaknesses} />
                      </View>
                    )}

                    {items.uncertainties && items.uncertainties.length > 0 && (
                      <View>
                        <Text style={styles.paragraph}>Osäkerheter</Text>
                        <BulletList items={items.uncertainties} />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {result.type === 'video' && (
              <View style={styles.section}>
                {result.overallStrengths && result.overallStrengths.length > 0 && (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.subsectionTitle}>Övergripande styrkor</Text>
                    <BulletList items={result.overallStrengths} />
                  </View>
                )}

                {result.overallWeaknesses && result.overallWeaknesses.length > 0 && (
                  <View>
                    <Text style={styles.subsectionTitle}>Förbättringsområden</Text>
                    <BulletList items={result.overallWeaknesses} />
                  </View>
                )}
              </View>
            )}

            {result.type === 'image' && result.summary && (
              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>Sammanfattning</Text>
                <Text style={styles.paragraph}>{result.summary}</Text>
              </View>
            )}

            {result.improvements && result.improvements.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Konkreta förbättringsförslag</Text>
                {result.improvements.map((item, index) => (
                  <View key={`${item}-${index}`} style={styles.numberedRow}>
                    <Text style={styles.numberCircle}>{index + 1}.</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {result.type === 'image' && result.motivation && (
              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>Motivering</Text>
                <Text style={styles.paragraph}>{result.motivation}</Text>
              </View>
            )}

            {result.type === 'video' && result.recommendation && (
              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>Samlad rekommendation</Text>
                <Text style={styles.paragraph}>{result.recommendation}</Text>
              </View>
            )}
          </View>
        )}

        {result && !result.parsed && (
          <View style={[styles.section, styles.fallbackBox]}>
            <Text style={styles.sectionTitle}>⚠️ Fel vid parsning av analys</Text>
            {result.error && <Text style={styles.paragraph}>{result.error}</Text>}
            {result.rawContent && <Text style={styles.codeBlock}>{`${result.rawContent}`}</Text>}
          </View>
        )}

        {!result && (
          <View style={[styles.section, styles.waitingBox]}>
            <Text style={styles.paragraph}>Väntar på AI-analys från n8n workflow...</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default AnalysisResultPDF;
