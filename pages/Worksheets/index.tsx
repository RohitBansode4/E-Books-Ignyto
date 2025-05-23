import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/Worksheets.module.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';

interface WorksheetData {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  created_at: string;
  subject: string;
  subtopic?: string;
}

const WorksheetsList: React.FC = () => {
  const [worksheets, setWorksheets] = useState<WorksheetData[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const toSlug = (text: string) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

  useEffect(() => {
    async function fetchWorksheets() {
      try {
        const res = await fetch('/api/worksheet');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: { status: string; data: WorksheetData[]; message?: string } = await res.json();

        if (data.status === 'success') {
          setWorksheets(data.data);
        } else {
          setError(data.message || 'Failed to load worksheets.');
        }
      } catch (err) {
        setError('Failed to fetch worksheets.');
      } finally {
        setLoading(false);
      }
    }

    fetchWorksheets();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.pageWrapper}>
        <Sidebar />
        <main className={styles.contentArea} aria-live="polite">
          <h2 className={styles.heading}>Our Learning Worksheets</h2>
          <p className={styles.subtitle}>
            Browse through our worksheets to help your students learn effectively!
          </p>

          {loading && <p>Loading worksheets...</p>}
          {error && <p className={styles.textDanger} role="alert">{error}</p>}

          {!loading && !error && (
            <div className={styles.cardContainer}>
              {worksheets.map((worksheet) => {
                const subjectSlug = toSlug(worksheet.subject);
                const subtopicSlug = worksheet.subtopic
                  ? toSlug(worksheet.subtopic)
                  : subjectSlug;
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
                    className={styles.card} // <-- directly on Link
                    aria-label={`View worksheet: ${worksheet.title}`}
                  >
                    <div className={styles.cardHeader}>
                      <Image
                        src={
                          worksheet.thumbnail_url ||
                          'https://via.placeholder.com/300x200.png?text=No+Thumbnail'
                        }
                        alt={worksheet.title || 'Worksheet Thumbnail'}
                        width={300}
                        height={200}
                        className={styles.cardImage}
                        loading="lazy"
                        unoptimized={false}
                      />
                      <h4 className={styles.cardTitle}>{worksheet.title}</h4>
                    </div>
                    <p className={styles.cardSubtitle}>{worksheet.description}</p>
                    <span className={styles.cardButton} aria-hidden="true">
                      View Worksheet
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default WorksheetsList;
