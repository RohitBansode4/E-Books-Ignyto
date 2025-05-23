import React, { useEffect, useState, useRef } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';
import { FaChevronDown, FaBars } from 'react-icons/fa';
import { debounce } from 'lodash';
import Link from 'next/link';
import Image from 'next/image';

type Subject = {
  id: string;
  name: string;
};

type Subtopic = {
  id: string;
  name: string;
  subject_id: string;
};

const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-');

const Header: React.FC = () => {
  const [bgColor, setBgColor] = useState('black');
  const [menuOpen, setMenuOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subtopics, setSubtopics] = useState<Record<string, Subtopic[]>>({});
  const [error, setError] = useState('');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState({ subjects: false, worksheets: false });
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debounced subtopic fetch
  const debounceFetchSubtopics = useRef(
    debounce(async (subjectId: string) => {
      if (!subtopics[subjectId]) {
        try {
          const response = await fetch(`/api/subtopics?subject_id=${subjectId}`);
          if (!response.ok) throw new Error('Failed to fetch subtopics');
          const data = await response.json();
          setSubtopics((prev) => ({ ...prev, [subjectId]: data.subtopics }));
        } catch (error: unknown) {
          setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
        }
      }
    }, 150)
  );

  // Cancel debounce on unmount
  useEffect(() => {
    return () => debounceFetchSubtopics.current.cancel();
  }, []);

  // Fetch subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/subjects');
        if (!response.ok) throw new Error('Failed to fetch subjects');
        const data = await response.json();
        setSubjects(data);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
      }
    };
    fetchSubjects();
  }, []);

  const handleToggleClick = () => setMenuOpen(!menuOpen);

  const handleMouseEnter = (subjectId: string) => {
    if (!isMobile) {
      setActiveSubjectId(subjectId);
      debounceFetchSubtopics.current(subjectId);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) setActiveSubjectId(null);
  };

  const toggleSubjectSubtopics = (subjectId: string) => {
    setExpandedSubjects((prev) => ({ ...prev, [subjectId]: !prev[subjectId] }));
    debounceFetchSubtopics.current(subjectId);
  };

  const handleSubjectClick = async (subjectName: string) => {
    try {
      await router.push(`/Worksheets/${toSlug(subjectName)}`);
    } catch {
      setError('Navigation error. Please try again.');
    }
  };

  const handleSubtopicClick = async (subjectName: string, subtopicName: string) => {
    try {
      await router.push(`/Worksheets/${toSlug(subjectName)}/${toSlug(subtopicName)}`);
    } catch {
      setError('Navigation error. Please try again.');
    }
  };

  const toggleMobileDropdown = (key: 'subjects' | 'worksheets') => {
    setMobileDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Navbar expand="lg" className={`${styles.customNavbar} ${bgColor === 'black' ? styles.bgBlack : ''}`}>
      <Navbar.Brand>
        <Link href="/" className={styles.navbarBrand}>
          <Image src="/images/Ignyto_Logo.jpeg" alt="ASVAB WARRIORS" className={styles.navbarLogo} width={120} height={40} />
        </Link>
      </Navbar.Brand>

      <Navbar.Toggle
        aria-controls="navbarNavDropdown"
        onClick={handleToggleClick}
        className={styles.navbarToggler}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
      >
        <FaBars className={styles.navbarTogglerIcon} />
      </Navbar.Toggle>

      <Navbar.Collapse id="navbarNavDropdown" className={menuOpen ? styles.navbarCollapseOpen : ''}>
        <Nav className={`ms-auto d-flex flex-column flex-lg-row align-items-start align-items-lg-center ${styles.navContainer}`}>

          {/* SUBJECTS */}
          <div className={styles.customDropdown} onMouseLeave={handleMouseLeave}>
            <button
              className={styles.navDropdownButton}
              onClick={() => isMobile && toggleMobileDropdown('subjects')}
              type="button"
              aria-haspopup="true"
              aria-expanded={mobileDropdownOpen.subjects}
            >
              SUBJECTS <FaChevronDown className={styles.dropdownArrow} />
            </button>

            {(mobileDropdownOpen.subjects || !isMobile) && (
              <div className={styles.customDropdownMenu}>
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className={styles.subjectItem}
                    onMouseEnter={() => !isMobile && handleMouseEnter(subject.id)}
                  >
                    <div className={styles.customDropdownItemRow}>
                      <div className={styles.customDropdownItem} onClick={() => handleSubjectClick(subject.name)}>
                        {subject.name}
                      </div>
                      <button className={styles.subtopicToggle} onClick={() => toggleSubjectSubtopics(subject.id)}>
                        <FaChevronDown />
                      </button>
                    </div>
                    {((!isMobile && activeSubjectId === subject.id) || (isMobile && expandedSubjects[subject.id])) &&
                      subtopics[subject.id] && (
                        <div className={styles.submenu}>
                          <div className={styles.subtopicScrollContainer}>
                            {subtopics[subject.id].map((subtopic) => (
                              <div
                                key={subtopic.id}
                                className={styles.customDropdownItem}
                                onClick={() => handleSubtopicClick(subject.name, subtopic.name)}
                              >
                                {subtopic.name}
                              </div>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* WORKSHEETS */}
          <div className={styles.customDropdown}>
            <button
              className={styles.navDropdownButton}
              onClick={() => isMobile && toggleMobileDropdown('worksheets')}
              type="button"
              aria-haspopup="true"
              aria-expanded={mobileDropdownOpen.worksheets}
            >
              WORKSHEETS <FaChevronDown className={styles.dropdownArrow} />
            </button>
            {(mobileDropdownOpen.worksheets || !isMobile) && (
              <div className={styles.customDropdownMenu}>
                <Link href="/Worksheets" className={styles.customDropdownItem}>
                  VIEW WORKSHEETS
                </Link>
              </div>
            )}
          </div>

          {/* CONTACT */}
          <Link href="/Contact" className={styles.navLink}>
            CONTACT US
          </Link>
        </Nav>
      </Navbar.Collapse>

      {/* Error message display */}
      {error && <div className={styles.errorMessage}>{error}</div>}
    </Navbar>
  );
};

export default Header;
