import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Sidebar.module.css';

interface Subject {
  id: string;
  name: string;
}

const Sidebar: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/subjects'); // Using internal API route
        if (!response.ok) throw new Error('Failed to fetch subjects');
        const data = await response.json();

        if (Array.isArray(data)) {
          setSubjects(data);
        } else if (Array.isArray(data.data)) {
          setSubjects(data.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const toSlug = (text: string) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.sidebarHeading}>Subjects</h3>
      <nav className={styles.subjectList}>
        {loading ? (
          <p>Loading subjects...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          subjects.map((subject) => (
            <Link key={subject.id} href={`/Worksheets/${toSlug(subject.name)}`}>
              <div className={styles.subjectItem}>
                {subject.name}
              </div>
            </Link>
          ))
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
