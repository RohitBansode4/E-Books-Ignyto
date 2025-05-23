// pages/Worksheets/[subject]/index.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../../styles/Worksheets.module.css';
import Header from '@/components/Header';

interface Worksheet {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  subject: string;
  subtopic: string;
}

// Moved outside component for performance
const toSlug = (text: string) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

const SubjectWorksheets = () => {
  const router = useRouter();
  const { subject } = router.query;
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subtopics, setSubtopics] = useState<string[]>([]);

  useEffect(() => {
    const fetchWorksheets = async () => {
      setLoading(true);
      setError('');
      try {
        if (!subject || typeof subject !== 'string') {
          setError('Invalid subject');
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/worksheets/${encodeURIComponent(subject)}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to load worksheets.');
        }
        const data = await res.json();

        if (data.status === 'success') {
          setWorksheets(data.data);

          const uniqueSubtopics: string[] = [
            ...new Set(
              (data.data as Worksheet[]).map((worksheet) => worksheet.subtopic)
            ),
          ];

          setSubtopics(uniqueSubtopics);
        } else {
          setError(data.message || 'Failed to load worksheets.');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch worksheets.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (subject) fetchWorksheets();
  }, [subject]);

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
        {/* Breadcrumb with Home and Worksheets navigation */}
        <nav
          aria-label="breadcrumb"
          style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '10px 20px',
          }}
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
                <a
                  className="btn btn-link p-0 text-decoration-none"
                  style={{ fontSize: '1.1rem' }}
                >
                  Worksheets
                </a>
              </Link>
            </li>
            <li
              className="breadcrumb-item active"
              aria-current="page"
              style={{ color: '#6c757d', fontSize: '1rem' }}
            >
              {subject}
            </li>
          </ol>
        </nav>

        <h2 className={styles.heading}>
          Worksheets for Subject: {worksheets[0]?.subject || subject}
        </h2>

        {/* Subtopics Section */}
        <div className={styles.subtopicsContainer}>
          <h3 className={styles.subtopicsHeading}>Subtopics</h3>
          <div className={styles.subtopicsList}>
            {subtopics.length > 0 ? (
              subtopics.map((subtopic, index) => (
                <Link
                  key={index}
                  href={{
                    pathname: '/Worksheets/[subject]/[subtopic]',
                    query: { subject, subtopic: toSlug(subtopic) },
                  }}
                  legacyBehavior
                >
                  <a className={styles.subtopicItem}>{subtopic}</a>
                </Link>
              ))
            ) : (
              <p>No subtopics available for this subject.</p>
            )}
          </div>
        </div>

        <div className={styles.cardContainer}>
          {worksheets.map((worksheet: Worksheet) => (
            <Link
              key={worksheet.id}
              href={{
                pathname: '/Worksheets/[subject]/[subtopic]/[worksheet]',
                query: {
                  subject,
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
      </div>
    </>
  );
};

export default SubjectWorksheets;