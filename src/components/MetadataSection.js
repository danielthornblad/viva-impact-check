import React from 'react';
import styles from './MetadataSection.module.css';

const MetadataSection = ({ analysisResult }) => {
  if (!analysisResult) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.messageRow}>
        <div className={styles.iconWrapper}>
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4.5L4.5 8L11 1.5" stroke="#02443E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className={styles.messageText}>{analysisResult.message}</p>
      </div>

      <div className={styles.dataContainer}>
        <div className={styles.grid}>
          <strong className={styles.label}>Filnamn:</strong>
          <span className={styles.value}>{analysisResult.fileName || analysisResult.data?.fileName}</span>

          <strong className={styles.label}>Filstorlek:</strong>
          <span className={styles.value}>{analysisResult.data?.fileSize ? `${(analysisResult.data.fileSize / 1024).toFixed(2)} KB` : 'N/A'}</span>

          <strong className={styles.label}>Annonstyp:</strong>
          <span className={styles.value}>{analysisResult.data?.adType === 'video' ? 'Videoannons' : 'Bildannons'}</span>

          <strong className={styles.label}>Platform:</strong>
          <span className={styles.value}>{analysisResult.data?.platform || analysisResult.platform}</span>

          <strong className={styles.label}>Målgrupp:</strong>
          <span className={styles.value}>{analysisResult.data?.targetAudience || analysisResult.targetAudience}</span>

          <strong className={styles.label}>AI-modell:</strong>
          <span className={styles.value}>
            {analysisResult.data?.aiProvider ?? analysisResult.aiProvider ?? 'N/A'}
          </span>

          <strong className={styles.label}>Tidsstämpel:</strong>
          <span className={styles.value}>{analysisResult.data?.timestamp ? new Date(parseInt(analysisResult.data.timestamp)).toLocaleString('sv-SE') : new Date().toLocaleString('sv-SE')}</span>
        </div>
      </div>
    </div>
  );
};

export default MetadataSection;
