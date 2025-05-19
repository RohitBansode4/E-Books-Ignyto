import React from 'react';
import styles from '../styles/LearningLibrary.module.css';
import { FaBookOpen, FaChalkboardTeacher, FaClipboardList, FaGamepad, FaPuzzlePiece } from 'react-icons/fa';

const cardData = [
  {
    icon: <FaBookOpen />,
    title: 'Lesson Plans',
    subtitle: 'Free, ready-made lesson plans make it easy to provide meaningful, standards-aligned instruction in both classroom and homeschool settings.',
    buttonLabel: 'Explore',
  },
  {
    icon: <FaChalkboardTeacher />,
    title: 'Worksheets',
    subtitle: "We've got a worksheet for anything your student is learning! Our printables make it easy to practice everything from handwriting to multiplication to sight words, and much more!",
    buttonLabel: 'Join Now',
  },
  {
    icon: <FaGamepad />,
    title: 'Games',
    subtitle: "Transform study time into an adventure! Sharpen math fluency and learn letters with immersive games like Flipping Pancakes Fractions and Irregular Nouns Ski Race.",
    buttonLabel: 'Take Test',
  },
  {
    icon: <FaPuzzlePiece />,
    title: 'Activities',
    subtitle: 'Our curated activities bring topics to life through hands-on science experiments, creative art projects, inspirational writing prompts, and more!',
    buttonLabel: 'Try Tools',
  },
];

const LearningLibrary: React.FC = () => {
  return (
    <div className={styles.librarySection}>
      <h2 className={styles.heading}>Our Learning Library</h2>
      <p className={styles.subtitle}>
        With thousands of digital and printable resources, find the best resource for your student.
      </p>
      <div className={styles.centerButton}>
        <a href="/Library" className={styles.ctaButton}>Dive Right In</a>
      </div>

      <div className={styles.cardContainer}>
        {cardData.map((card, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>{card.icon}</span>
              <h4 className={styles.cardTitle}>{card.title}</h4>
            </div>
            <p className={styles.cardSubtitle}>{card.subtitle}</p>
            <a href="#" className={styles.cardButton}>{card.buttonLabel}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningLibrary;
