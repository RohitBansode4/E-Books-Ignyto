// pages/Worksheets/[subject]/[subtopic]/index.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../../../../styles/Worksheets.module.css';
import Header from '@/components/Header';

interface Worksheet {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  subject: string;
  subtopic: string;
}

const toSlug = (text: string) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

const SubjectSubtopicWorksheets = () => {
  const router = useRouter();
  const { subject, subtopic } = router.query;

  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorksheets = async () => {
      if (typeof subject !== 'string' || typeof subtopic !== 'string') {
        setError('Invalid subject or subtopic');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/worksheet'); 
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to load worksheets.');
        }
        const data = await res.json();

        if (data.status === 'success') {
          const filteredWorksheets = data.data.filter((w: Worksheet) =>
            toSlug(w.subject) === toSlug(subject) &&
            toSlug(w.subtopic) === toSlug(subtopic)
          );
          setWorksheets(filteredWorksheets);
        } else {
          setError(data.message || 'Failed to load worksheets.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch worksheets.');
      } finally {
        setLoading(false);
      }
    };

    if (subject && subtopic) {
      setLoading(true);
      setError('');
      fetchWorksheets();
    }
  }, [subject, subtopic]);

  if (loading) return <p>Loading worksheets...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <Header />
      <div className={styles.librarySection}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ backgroundColor: '#f8f9fa', borderRadius: 5, padding: '10px 20px' }}>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <button
                onClick={() => router.push('/')}
                className="btn btn-link p-0 text-decoration-none"
                style={{ fontSize: '1.1rem' }}
              >
                <i className="bi bi-house-door"></i> Home
              </button>
            </li>
            <li className="breadcrumb-item">
              <Link href="/Worksheets" className="text-decoration-none">
                Worksheets
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href={`/Worksheets/${toSlug(subject as string)}`} className="text-decoration-none">
                {subject}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: '#6c757d' }}>
              {subtopic}
            </li>
          </ol>
        </nav>

        <h2 className={styles.heading}>
          Worksheets for {subject} → {subtopic}
        </h2>

        {worksheets.length === 0 ? (
          <p>No worksheets found for this subtopic.</p>
        ) : (
          <div className={styles.cardContainer}>
            {worksheets.map((worksheet) => (
              <Link
                key={worksheet.id}
                href={{
                  pathname: '/Worksheets/[subject]/[subtopic]/[worksheet]',
                  query: {
                    subject: toSlug(worksheet.subject),
                    subtopic: toSlug(worksheet.subtopic),
                    worksheet: toSlug(worksheet.title),
                  },
                }}
                className={styles.cardLink}
              >
                <div className={styles.card}>
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
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SubjectSubtopicWorksheets;
