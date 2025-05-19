import React from 'react';
import styles from '../styles/HeroSection.module.css';

const HeroSection: React.FC = () => {
  return (
    <div className={styles.heroContainer}>
      <h1 className={styles.title}>Discover a limitless world of learning</h1>
      <div className={styles.contentLeft}>
        <p className={styles.subtitle}>Review concepts and explore new topics with worksheets, hands-on activities, puzzles, games, and more–the options are endless! Access our library of 37,000+ resources today.</p>
        <a href="/Packages" className={styles.ctaButton}>Join for free</a>
      </div>
    </div>
  );
};

export default HeroSection;
