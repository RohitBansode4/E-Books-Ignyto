import React from 'react';
import styles from '../styles/GetAccessSection.module.css'; // Adjust path accordingly

const GetAccessSection: React.FC = () => {
  return (
    <div className={styles.GetAccessSection}>
      <div className={styles.GetAccessTextContainer}>
        <h2 className={styles.GetAccessHeading}>Get Access Today</h2>
        <p className={styles.GetAccessSubtitle}>
          {/* Join thousands of educators and students who are unlocking their potential with our tailored programs. Start now and see the difference! */}
        </p>
        <button className={styles.GetAccessCtaButton}>Join for free</button>
      </div>
    </div>
  );
};

export default GetAccessSection;
