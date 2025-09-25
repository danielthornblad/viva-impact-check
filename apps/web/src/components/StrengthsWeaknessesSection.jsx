import React from 'react';
import styles from './StrengthsWeaknessesSection.module.css';

const StrengthsWeaknessesSection = ({ sectionName, items }) => (
  <div className={styles.card}>
    <h4 className={styles.title}>{sectionName}</h4>

    {items.strengths && items.strengths.length > 0 && (
      <div className={styles.block}>
        <p className={styles.blockTitleGreen}>Styrkor</p>
        <div className={styles.list}>
          {items.strengths.map((item) => (
            <div key={`${sectionName}-strength-${item}`} className={styles.listItem}>
              <div className={styles.greenDot}></div>
              <p className={styles.greenText}>{item}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {items.weaknesses && items.weaknesses.length > 0 && (
      <div className={styles.block}>
        <p className={styles.blockTitleDark}>Förbättringsområden</p>
        <div className={styles.list}>
          {items.weaknesses.map((item) => (
            <div key={`${sectionName}-weakness-${item}`} className={styles.listItem}>
              <div className={styles.darkDot}></div>
              <p className={styles.darkText}>{item}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {items.uncertainties && items.uncertainties.length > 0 && (
      <div>
        <p className={styles.blockTitleGreen}>Osäkerheter</p>
        <div className={styles.list}>
          {items.uncertainties.map((item) => (
            <div key={`${sectionName}-uncertainty-${item}`} className={styles.listItem}>
              <div className={styles.greenDotAlt}></div>
              <p className={styles.greenTextAlt}>{item}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default StrengthsWeaknessesSection;
