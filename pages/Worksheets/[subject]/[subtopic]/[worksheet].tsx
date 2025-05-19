import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../../styles/Worksheets.module.css';
import Header from '@/components/Header';
import Image from 'next/image';


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

// Convert slug to readable title, e.g. "number-series-practice" → "Number Series Practice"
const fromSlug = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

const WorksheetDetail: React.FC = () => {
  const router = useRouter();
  const { subject, subtopic, worksheet: slug } = router.query;

  const [worksheet, setWorksheet] = useState<WorksheetData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', email: '', mobile: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch worksheet details by slug and match with subject/subtopic
  useEffect(() => {
    if (!slug || !subject || !subtopic) return;

    const fetchWorksheet = async () => {
      setError('');
      setWorksheet(null);
      setSuccessMessage('');

      try {
        const originalTitle = fromSlug(slug as string);

        const res = await fetch(
          `https://worksheets.asvabwarriors.org/Worksheets/api/getWorksheet.php?title=${encodeURIComponent(originalTitle)}`
        );
        const data = await res.json();

        if (data.status === 'success' && data.data?.length > 0) {
          const match = data.data.find((w: WorksheetData) =>
            w.subject.toLowerCase() === (subject as string).toLowerCase() &&
            w.subtopic.toLowerCase() === (subtopic as string).toLowerCase()
          );

          if (match) {
            setWorksheet(match);
          } else {
            setError('Worksheet not found or does not match the URL.');
          }
        } else {
          setError('Worksheet not found.');
        }
      } catch {
        setError('Failed to load worksheet.');
      }
    };

    fetchWorksheet();
  }, [slug, subject, subtopic]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, mobile } = userDetails;
    if (!name || !email || !mobile) {
      setError('Please fill in all fields.');
      return;
    }

    if (!worksheet?.id) {
      setError('Worksheet ID is missing.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('https://worksheets.asvabwarriors.org/Worksheets/api/send-email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userDetails, worksheet_id: worksheet.id, subject, subtopic }), // Pass subject and subtopic
      });

      const result = await res.json();

      if (result.success) {
        setSuccessMessage(`✅ Email successfully sent to ${email}. Please check your inbox.`);
        setShowForm(false);
        setUserDetails({ name: '', email: '', mobile: '' });
      } else {
        setError(result.error || 'Error sending the email.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <>
      <Header />
      <div className={styles.librarySection}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <button onClick={goBack} className="btn btn-link p-0">
                <i className="bi bi-arrow-left-circle"></i> Go Back
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {worksheet ? worksheet.title : 'Worksheet Detail'}
            </li>
          </ol>
        </nav>

        <h2 className={styles.heading}>
          {worksheet ? worksheet.title : 'Loading worksheet...'}
        </h2>

        {error && <div className={styles.alertError}>❌ {error}</div>}
        {successMessage && <div className={styles.alertSuccess}>✅ {successMessage}</div>}

        {!worksheet && error && <p className="text-danger">{error}</p>}

        {worksheet && (
          <div className={styles.worksheetDetails}>
            <div className={styles.cardHeader}>
              <Image
                src={worksheet.thumbnail_url || 'https://via.placeholder.com/300x200.png?text=No+Thumbnail'}
                alt={worksheet.title}
                className={styles.cardImage}
              />
            </div>
            <p><strong>Description:</strong> {worksheet.description || 'No description available'}</p>
            <p><strong>Subject:</strong> {worksheet.subject || 'N/A'}</p>
            <p><strong>Subtopic:</strong> {worksheet.subtopic || 'N/A'}</p>
            <p><strong>Created At:</strong> {new Date(worksheet.created_at).toLocaleDateString()}</p>
          </div>
        )}

        {successMessage && !showForm && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        {worksheet && (
          <button onClick={() => setShowForm(true)} className={styles.cardButton}>
            Request Worksheet Link
          </button>
        )}

        {showForm && (
          <div className={styles.overlay}>
            <div className={styles.formContainer}>
              <h3 className={styles.formTitle}>Enter Your Details</h3>

              {error && <div className="text-danger">{error}</div>}
              <form onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  required
                />
                <input
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
                <button type="button" className={styles.cancelButton} onClick={() => setShowForm(false)}>
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
