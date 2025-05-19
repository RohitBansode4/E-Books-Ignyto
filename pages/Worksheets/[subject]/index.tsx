import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
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

const SubjectWorksheets = () => {
  const router = useRouter();
  const { subject } = router.query;
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subtopics, setSubtopics] = useState<string[]>([]);

  // Function to generate a slug from text (used to create clean URL paths)
  const toSlug = (text: string) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

  useEffect(() => {
    const fetchWorksheets = async () => {
      try {
        const res = await fetch('https://worksheets.asvabwarriors.org/Worksheets/api/getWorksheet.php');
        const data = await res.json();
        if (data.status === 'success') {
          const filtered = data.data.filter((w: Worksheet) =>
            toSlug(w.subject) === toSlug(subject as string)
          ) as Worksheet[]; // Explicitly type this as Worksheet[]
          setWorksheets(filtered);

          // Extract unique subtopics and ensure correct typing
          const uniqueSubtopics: string[] = [
            ...new Set(filtered.map((worksheet) => worksheet.subtopic)),
          ];
          setSubtopics(uniqueSubtopics);
        } else {
          setError(data.message || 'Failed to load worksheets.');
        }
      } catch {
        setError('Failed to fetch worksheets.');
      } finally {
        setLoading(false);
      }
    };

    if (subject) fetchWorksheets();
  }, [subject]);

  if (loading) return <p>Loading worksheets...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <Header />
      <div className={styles.librarySection}>
        {/* Breadcrumb with Home and Worksheets navigation */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb" style={{ backgroundColor: '#f8f9fa', borderRadius: '5px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '10px 20px' }}>
            <li className="breadcrumb-item">
              <button
                onClick={() => router.push('/')} // Navigate to home page
                className="btn btn-link p-0 text-decoration-none"
                style={{ fontSize: '1.1rem' }}
              >
                <i className="bi bi-house-door"></i> Home {/* Icon for Home */}
              </button>
            </li>
            <li className="breadcrumb-item">
              <button
                onClick={() => router.push('/Worksheets')} // Navigate to /Worksheets
                className="btn btn-link p-0 text-decoration-none"
                style={{ fontSize: '1.1rem' }}
              >
                Worksheets
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: '#6c757d', fontSize: '1rem' }}>
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
                    pathname: '/Worksheets/[subject]/[subtopic]', // Adjust path for subtopic page
                    query: { subject, subtopic: toSlug(subtopic) },
                  }}
                >
                  <div className={styles.subtopicItem}>{subtopic}</div>
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
                pathname: '/Worksheets/[subject]/[subtopic]/[worksheet]', // Adjust path to use the worksheet title slug
                query: {
                  subject,
                  subtopic: toSlug(worksheet.subtopic), // Pass the subtopic as slug
                  worksheet: toSlug(worksheet.title), // Pass the worksheet title as slug
                },
              }}
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
      </div>
    </>
  );
};

export default SubjectWorksheets;
