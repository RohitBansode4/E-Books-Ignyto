// UnlockSection.tsx

import React from 'react';
import styles from '../styles/UnlockSection.module.css';
import Image from 'next/image';

const CustomSection: React.FC = () => {
  return (
    <div className={styles.sectionContainer}>
      {/* Top Heading and Subtitle */}
      <div className={styles.topContent}>
        <h1 className={styles.topHeading}>Unlock every student&apos;s true potential</h1>
        <p className={styles.topSubtitle}>
          A premium membership gives you unlimited access to all of Education.com&apos;s resources and tools like playlists of guided lessons, progress insights for each student, and more!
        </p>
      </div>

      {/* Left Section */}
      <div className={styles.leftContent}>
        <h2 className={styles.leftHeading}>Guided lessons</h2>
        <p className={styles.leftSubtitle}>
          Follow our expertly-designed pathways of fun games that help learners practice and build upon skills in math, reading, writing, and typing!
        </p>
      </div>

      {/* Centered Image */}
      <div className={styles.imageContainer}>
        <Image
          src="/images/UnlockSection_Image.png"
          alt="Students engaged in guided learning activities"
          width={500}
          height={300}
          className={styles.centeredImage}
          priority // optional: preload for better performance
        />
      </div>

      {/* Right Section */}
      <div className={styles.rightContent}>
        <h2 className={styles.rightHeading}>Support for individual learners</h2>
        <p className={styles.rightSubtitle}>
          Create assignments for individual learners, an entire household, or a classroom&mdash;with insights to celebrate each student&apos;s achievements and milestones.
        </p>
      </div>

      {/* Updated CTA with real link */}
      <a href="/premium" className={styles.ctaButton}>
        Learn more
      </a>
    </div>
  );
};

export default CustomSection;
