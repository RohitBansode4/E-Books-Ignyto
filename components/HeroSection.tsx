import React from 'react';
import styles from '../styles/HeroSection.module.css';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroContainer} aria-label="Hero Section">
      <h1 className={styles.title}>Discover a limitless world of learning</h1>
      <div className={styles.contentLeft}>
        <p className={styles.subtitle}>
          Review concepts and explore new topics with worksheets, hands-on activities, puzzles, games, and more–the options are endless! Access our library of 37,000+ resources today.
        </p>
        <Link href="/Packages" passHref legacyBehavior>
          <a className={styles.ctaButton} role="button" aria-label="Join for free">
            Join for free
          </a>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
