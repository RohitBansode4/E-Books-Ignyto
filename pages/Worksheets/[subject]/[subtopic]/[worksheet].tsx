// pages/Worksheets/[subject]/[subtopic]/[worksheet].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../../../../styles/WorksheetDetail.module.css';
import Header from '@/components/Header';
import Link from 'next/link';

interface WorksheetData {
  id: number;
  title: string;
  description: string;
  subject: string;
  category: string;
  subtopic: string;
  created_at: string;
  thumbnail_url: string;
}

const WorksheetDetail: React.FC = () => {
  const router = useRouter();
  const { subject, subtopic, worksheet: slug } = router.query;

  const [worksheet, setWorksheet] = useState<WorksheetData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', email: '', mobile: '' });
  const [fetchError, setFetchError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!router.isReady || !slug || !subject || !subtopic) return;

    const fetchWorksheet = async () => {
      setFetchError('');
      setSuccessMessage('');
      setWorksheet(null);

      try {
        const res = await fetch(
          `/api/worksheets/${encodeURIComponent(subject as string)}/${encodeURIComponent(
            subtopic as string
          )}/${encodeURIComponent(slug as string)}`
        );

        const data = await res.json();

        if (!res.ok || data.status !== 'success' || !data.data) {
          setFetchError(data.error || 'Worksheet not found.');
          return;
        }

        setWorksheet(data.data);
      } catch (err) {
        setFetchError('Failed to load worksheet.');
        console.error(err);
      }
    };

    fetchWorksheet();
  }, [router.isReady, slug, subject, subtopic]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!userDetails.name || !userDetails.email || !userDetails.mobile) {
      setFormError('Please fill in all fields.');
      return;
    }

    if (!worksheet?.id) {
      setFormError('Worksheet ID is missing.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userDetails,
          worksheet_id: worksheet.id,
          subject,
          subtopic,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setSuccessMessage(`✅ Email successfully sent to ${userDetails.email}. Please check your inbox. Note: The download link is valid for only 4 hours, so make sure to download the worksheet before it expires.`);
        setShowForm(false);
        setUserDetails({ name: '', email: '', mobile: '' });
      } else {
        setFormError(result.error || 'Error sending the email.');
      }
    } catch (err) {
      setFormError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
            marginBottom: '1rem',
          }}
        >
          <ol className="breadcrumb" style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', gap: '0.5rem' }}>
            <li className="breadcrumb-item">
              <Link href="/" legacyBehavior>
                <a
                  className="btn btn-link p-0 text-decoration-none"
                  style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
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
              style={{ color: '#6c757d', fontSize: '1rem', alignSelf: 'center' }}
            >
              {subject || 'Loading...'}
            </li>
          </ol>
        </nav>
        
        <h2 className={styles.heading}>{worksheet ? worksheet.title : 'Loading worksheet...'}</h2>

       {fetchError && (
          <div
            className={`${styles.alertError} ${
              fetchError === 'No worksheets found for this subtopic.' ? styles.backendMessage : ''
            }`}
            role="alert"
          >
            ❌ {fetchError}
          </div>
        )}


        {successMessage && (
          <div className={styles.alertSuccess} role="alert">
            {successMessage}
          </div>
        )}

        {worksheet && (
          <div className={styles.worksheetDetails}>
            <div className={styles.worksheetWrapper}>
              <div className={styles.cardHeader}>
                <Image
                  src={worksheet.thumbnail_url || 'https://via.placeholder.com/300x200.png?text=No+Thumbnail'}
                  alt={worksheet.title}
                  width={300}
                  height={200}
                  className={styles.cardImage}
                  loading="lazy"
                  unoptimized={true}
                />
              </div>
              <div className={styles.worksheetContent}>
                <p>
                  <strong>Description:</strong> {worksheet.description || 'No description available'}
                </p>
                <p>
                  <strong>Subject:</strong> {worksheet.subject || 'N/A'}
                </p>
                <p>
                  <strong>Subtopic:</strong> {worksheet.subtopic || 'N/A'}
                </p>
                <p>
                  <strong>Created At:</strong>{' '}
                  {new Date(worksheet.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {!showForm && worksheet && (
          <button onClick={() => setShowForm(true)} className={styles.cardButton}>
            Request Worksheet Link
          </button>
        )}

        {showForm && (
          <div className={styles.overlay}>
            <div className={styles.formContainer}>
              <h3 className={styles.formTitle}>Enter Your Details</h3>

              {formError && (
                <div className="text-danger" role="alert" style={{ marginBottom: '1em' }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleFormSubmit} noValidate>
                <label htmlFor="name" className="visually-hidden">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  required
                />

                <label htmlFor="email" className="visually-hidden">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  required
                />

                <label htmlFor="mobile" className="visually-hidden">
                  Your Mobile Number
                </label>
                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  placeholder="Your Mobile"
                  value={userDetails.mobile}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  required
                />

                <button type="submit" disabled={loading} className={styles.submitButton}>
                  {loading ? 'Sending...' : 'Send Email'}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setFormError('');
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WorksheetDetail;
