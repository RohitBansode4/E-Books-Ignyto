import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/Worksheets.module.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/router';
import Image from 'next/image';


interface WorksheetData {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  created_at: string;
  subject: string;
  // Assuming there could be a 'subtopic' field
  subtopic?: string;
}

const WorksheetsList: React.FC = () => {
  const [worksheets, setWorksheets] = useState<WorksheetData[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const toSlug = (text: string) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

  useEffect(() => {
    const fetchWorksheets = async () => {
      try {
        const res = await fetch('https://worksheets.asvabwarriors.org/Worksheets/api/getWorksheet.php');
        const data: { status: string; data: WorksheetData[]; message?: string } = await res.json();

        if (data.status === 'success') {
          setWorksheets(data.data);

          const uniqueSubjects = [
            ...new Set(data.data.map((worksheet) => worksheet.subject)),
          ];
          setSubjects(uniqueSubjects);
        } else {
          setError(data.message || 'Failed to load worksheets.');
        }
      } catch {
        setError('Failed to fetch worksheets.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorksheets();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.pageWrapper}>
        <Sidebar subjects={subjects} />
        <div className={styles.contentArea}>
          <h2 className={styles.heading}>Our Learning Worksheets</h2>
          <p className={styles.subtitle}>Browse through our worksheets to help your students learn effectively!</p>

          {loading && <p>Loading worksheets...</p>}
          {error && <p className="text-danger">{error}</p>}

          <div className={styles.cardContainer}>
            {worksheets.map((worksheet) => {
              const subjectSlug = toSlug(worksheet.subject);
              const subtopicSlug = worksheet.subtopic ? toSlug(worksheet.subtopic) : subjectSlug; // fallback to subject if no subtopic
              const worksheetSlug = toSlug(worksheet.title);
              return (
                <Link
                  key={worksheet.id}
                  href={{
                    pathname: '/Worksheets/[subject]/[subtopic]/[slug]',
                    query: {
                      subject: subjectSlug,
                      subtopic: subtopicSlug,
                      slug: worksheetSlug,
                      id: worksheet.id.toString(),
                    },
                  }}
                  passHref
                >
                  <div className={`${styles.card}`}>
                    <div className={styles.cardHeader}>
                      <img
                        src={worksheet.thumbnail_url || 'https://via.placeholder.com/300x200.png?text=No+Thumbnail'}
                        alt={worksheet.title}
                        className={styles.cardImage}
                      />
                      <h4 className={styles.cardTitle}>{worksheet.title}</h4>
                    </div>
                    <p className={styles.cardSubtitle}>{worksheet.description}</p>
                    <button className={styles.cardButton}>View Worksheet</button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorksheetsList;
