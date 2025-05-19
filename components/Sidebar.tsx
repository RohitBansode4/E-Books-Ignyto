import React from 'react';
import Link from 'next/link';
import styles from '../styles/Sidebar.module.css'; // Import dedicated sidebar styles

interface SidebarProps {
  subjects: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ subjects }) => {
  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.sidebarHeading}>Subjects</h3>
      <nav className={styles.subjectList}>
        {subjects.map((subject, index) => (
          <Link
            key={index}
            href={`/Worksheets/${subject.toLowerCase().replace(/\s+/g, '-')}`}
            passHref
          >
            <div className={styles.subjectItem}>{subject}</div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
