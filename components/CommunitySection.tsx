import React from 'react';
import styles from '../styles/CommunitySection.module.css';
import Image from 'next/image';


const CommunitySection: React.FC = () => {
  return (
    <div className={styles.communityContainer}>
      {/* Heading */}
      <h1 className={styles.heading}>Join the Education.com community!</h1>

      {/* Icons Section */}
      <div className={styles.iconsContainer}>
         <div className={styles.iconBox}>
            <Image
              src="/images/Community_Floyd_1.png"
              alt="Parents Served"
              width={60}
              height={60}
              className={styles.icon}
            />
            <p className={styles.iconText}>
              <span>44 million</span> parents, teachers, and students served
            </p>
          </div>

          <div className={styles.iconBox}>
            <Image
              src="/images/Community_IceCream_2.png"
              alt="Teachers Served"
              width={60}
              height={60}
              className={styles.icon}
            />
            <p className={styles.iconText}>
              Used in <span>20 countries</span> across 6 continents
            </p>
          </div>

          <div className={styles.iconBox}>
            <Image
              src="/images/Community_TuTu_3.png"
              alt="Students Served"
              width={60}
              height={60}
              className={styles.icon}
            />
            <p className={styles.iconText}>
              Library with <span>37,000</span> educational resources
            </p>
          </div>
      </div>

      {/* Message Box Section with new background color */}
      <div className={styles.messagesContainer}>
        {/* Message container with a different background color */}
        <div className={styles.messageContainer}>
          {/* Receiver Message */}
          <div className={styles.receiverMessage}>
            <div className={styles.messageBox}>
              <p className={styles.messageText}>I love that it shows me the areas my child needs to improve on and directs me to resources to work with him on. It's easy to understand and navigate to each area I need to go.</p>
            </div>
          </div>

          {/* Sender Message */}
          <div className={styles.senderMessage}>
            <div className={styles.messageBox}>
              <p className={styles.messageText}>Education.com has multiple resources organized for any learning tool you might need as a teacher, parent, and student, and I love the ability to be able to sort by grade, subject, enrichment, or type!</p>
            </div>
          </div>
        </div>
        <a href="#" className={styles.ctaButton}>Read more</a>
      </div>
    </div>
  );
};

export default CommunitySection;
