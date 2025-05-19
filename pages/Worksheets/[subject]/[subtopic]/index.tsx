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

const SubjectSubtopicWorksheets = () => {
  const router = useRouter();
  const { subject, subtopic } = router.query;

  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toSlug = (text: string) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

  useEffect(() => {
    const fetchWorksheets = async () => {
      try {
        const res = await fetch('https://worksheets.asvabwarriors.org/Worksheets/api/getWorksheet.php');
        const data = await res.json();

        if (data.status === 'success') {
          const filtered = data.data.filter((w: Worksheet) =>
            toSlug(w.subject) === toSlug(subject as string) &&
            toSlug(w.subtopic) === toSlug(subtopic as string)
          );
          setWorksheets(filtered);
        } else {
          setError(data.message || 'Failed to load worksheets.');
        }
      } catch {
        setError('Failed to fetch worksheets.');
      } finally {
        setLoading(false);
      }
    };

    if (subject && subtopic) {
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
        <nav aria-label="breadcrumb">
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

            <li className="breadcrumb-item active" aria-current="page">
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
