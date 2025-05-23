// pages/Worksheets/[subject]/[subtopic]/index.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
        // Ideally, you should filter server-side instead of fetching all and filtering client-side
        // But respecting your current API, here we fetch all then filter locally
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
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Failed to fetch worksheets.');
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
  if (error)
    return (
      <p className={styles.textDanger} role="alert">
        {error}
      </p>
    );

  return (
    <>
      <Header />
      <div className={styles.librarySection}>
        {/* Breadcrumb */}
        <nav
          aria-label="breadcrumb"
          style={{ backgroundColor: '#f8f9fa', borderRadius: 5, padding: '10px 20px' }}
        >
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/" legacyBehavior>
                <a
                  className="btn btn-link p-0 text-decoration-none"
                  style={{ fontSize: '1.1rem' }}
                >
                  <i className="bi bi-house-door" aria-hidden="true"></i> Home
                </a>
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/Worksheets" legacyBehavior>
                <a className="text-decoration-none" style={{ fontSize: '1.1rem' }}>
                  Worksheets
                </a>
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link
                href={`/Worksheets/${encodeURIComponent(toSlug(subject as string))}`}
                legacyBehavior
              >
                <a className="text-decoration-none" style={{ fontSize: '1.1rem' }}>
                  {subject}
                </a>
              </Link>
            </li>
            <li
              className="breadcrumb-item active"
              aria-current="page"
              style={{ color: '#6c757d', fontSize: '1.1rem' }}
            >
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
                legacyBehavior
              >
                <a className={styles.card} aria-label={`View worksheet: ${worksheet.title}`}>
                  <div className={styles.cardHeader}>
                    <Image
                      src={
                        worksheet.thumbnail_url ||
                        'https://via.placeholder.com/300x200.png?text=No+Thumbnail'
                      }
                      alt={worksheet.title}
                      width={300}
                      height={200}
                      className={styles.cardImage}
                      loading="lazy"
                      unoptimized={true}
                    />
                    <h4 className={styles.cardTitle}>{worksheet.title}</h4>
                  </div>
                  <p className={styles.cardSubtitle}>{worksheet.description}</p>
                  <span className={styles.cardButton} aria-hidden="true">
                    View Worksheet
                  </span>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SubjectSubtopicWorksheets;
