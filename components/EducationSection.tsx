import React from 'react';
import styles from '../styles/EducationSection.module.css'; // Assuming the CSS module is named EducationSection.module.css

const EducationSection: React.FC = () => {
  return (
    <div className={styles.educationSection}>
      <div className={styles.textContainer}>
        <h2 className={styles.heading}>Education.com for schools and districts</h2>
        <p className={styles.subtitle}>
          Our comprehensive, standards-aligned supplemental program empowers school administrators and teachers to help students build essential skills in math, reading, writing, science, social studies, and more.
        </p>
        <button className={styles.ctaButton}>
          Get Started
        </button>
      </div>
      
      <div className={styles.imagesContainer}>
        <img
          src="/images/Education_left.svg"
          alt="Education"
          className={styles.leftImage}
        />
        <img
          src="/images/Education_right.svg"
          alt="Learning"
          className={styles.rightImage}
        />
      </div>
    </div>
  );
};

export default EducationSection;
