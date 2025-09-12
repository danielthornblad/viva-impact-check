import React from 'react';
import styles from './ImprovementsSection.module.css';

const ImprovementsSection = ({ improvements }) => (
  <div className={styles.wrapper}>
    <h4 className={styles.title}>Konkreta förbättringsförslag</h4>
    <div className={styles.list}>
      {improvements.map((item, idx) => (
        <div key={item} className={styles.listItem}>
          <div className={styles.numberCircle}>{idx + 1}</div>
          <p className={styles.text}>{item}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ImprovementsSection;
