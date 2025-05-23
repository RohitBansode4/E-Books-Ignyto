// EducationSection.tsx

import React from 'react';
import styles from '../styles/EducationSection.module.css';
import Image from 'next/image';

const EducationSection: React.FC = () => {
  return (
    <div className={styles.educationSection}>
      <div className={styles.textContainer}>
        <h2 className={styles.heading}>Education.com for schools and districts</h2>
        <p className={styles.subtitle}>
          Our comprehensive, standards-aligned supplemental program empowers school administrators and teachers to help students build essential skills in math, reading, writing, science, social studies, and more.
        </p>
        <button
          className={styles.ctaButton}
          onClick={() => {
            // Replace with your actual navigation or action
            window.location.href = '/get-started';
          }}
          aria-label="Get started with Education.com for schools and districts"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default EducationSection;