import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../../../../styles/Worksheets.module.css';
import Header from '@/components/Header';

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
        setSuccessMessage(`✅ Email successfully sent to ${userDetails.email}. Please check your inbox.`);
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
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <button
                onClick={() => router.back()}
                className="btn btn-link p-0"
                aria-label="Go back to previous page"
              >
                <i className="bi bi-arrow-left-circle" aria-hidden="true"></i> Go Back
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {worksheet ? worksheet.title : 'Worksheet Detail'}
            </li>
          </ol>
        </nav>

        <h2 className={styles.heading}>{worksheet ? worksheet.title : 'Loading worksheet...'}</h2>

        {fetchError && (
          <div className={styles.alertError} role="alert">
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
