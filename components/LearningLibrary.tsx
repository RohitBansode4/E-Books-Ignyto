import React from 'react';
import styles from '../styles/LearningLibrary.module.css';
import { FaBookOpen, FaChalkboardTeacher, FaGamepad, FaPuzzlePiece } from 'react-icons/fa';
import Link from 'next/link';

const cardData = [
  {
    icon: <FaBookOpen aria-hidden="true" />,
    title: 'Lesson Plans',
    subtitle: 'Free, ready-made lesson plans make it easy to provide meaningful, standards-aligned instruction in both classroom and homeschool settings.',
    buttonLabel: 'Explore',
    href: '/LessonPlans',
  },
  {
    icon: <FaChalkboardTeacher aria-hidden="true" />,
    title: 'Worksheets',
    subtitle: "We've got a worksheet for anything your student is learning! Our printables make it easy to practice everything from handwriting to multiplication to sight words, and much more!",
    buttonLabel: 'Join Now',
    href: '/Worksheets',
  },
  {
    icon: <FaGamepad aria-hidden="true" />,
    title: 'Games',
    subtitle: "Transform study time into an adventure! Sharpen math fluency and learn letters with immersive games like Flipping Pancakes Fractions and Irregular Nouns Ski Race.",
    buttonLabel: 'Take Test',
    href: '/Games',
  },
  {
    icon: <FaPuzzlePiece aria-hidden="true" />,
    title: 'Activities',
    subtitle: 'Our curated activities bring topics to life through hands-on science experiments, creative art projects, inspirational writing prompts, and more!',
    buttonLabel: 'Try Tools',
    href: '/Activities',
  },
];

const LearningLibrary: React.FC = () => {
  return (
    <section className={styles.librarySection} aria-label="Learning Library">
      <h2 className={styles.heading}>Our Learning Library</h2>
      <p className={styles.subtitle}>
        With thousands of digital and printable resources, find the best resource for your student.
      </p>

      <div className={styles.centerButton}>
        <Link href="/Library" passHref legacyBehavior>
          <a className={styles.ctaButton} role="button" aria-label="Explore Library">Dive Right In</a>
        </Link>
      </div>

      <div className={styles.cardContainer}>
        {cardData.map((card, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>{card.icon}</span>
              <h4 className={styles.cardTitle}>{card.title}</h4>
            </div>
            <p className={styles.cardSubtitle}>{card.subtitle}</p>
            <Link href={card.href} passHref legacyBehavior>
              <a className={styles.cardButton} role="button" aria-label={card.buttonLabel}>{card.buttonLabel}</a>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearningLibrary;
