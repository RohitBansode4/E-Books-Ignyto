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

const Header: React.FC = () => {
  const [bgColor, setBgColor] = useState('black');
  const [menuOpen, setMenuOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subtopics, setSubtopics] = useState<Record<string, Subtopic[]>>({});
  const [error, setError] = useState('');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

  // New: state for mobile dropdowns open/close (Subjects and Worksheets)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<{ subjects: boolean; worksheets: boolean }>({
    subjects: false,
    worksheets: false,
  });

  const router = useRouter();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 992;

  const debounceFetchSubtopics = useRef(
    debounce(async (subjectId: string) => {
      if (!subtopics[subjectId]) {
        try {
          const response = await fetch(
            `https://worksheets.asvabwarriors.org/Subjects/Subtopics/api/get_subtopics.php?subject_id=${subjectId}`
          );
          if (!response.ok) throw new Error('Failed to fetch subtopics');
          const data = await response.json();
          setSubtopics((prev) => ({ ...prev, [subjectId]: data.subtopics }));
        } catch (error: unknown) {
          setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
        }
      }
    }, 500)
  );

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('https://worksheets.asvabwarriors.org/Subjects/api/get_subjects.php');
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
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
    debounceFetchSubtopics.current(subjectId);
  };

  const handleSubjectClick = (subjectName: string) => {
    const subjectSlug = subjectName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/Worksheets/${subjectSlug}`);
  };

  const handleSubtopicClick = (subjectName: string, subtopicName: string) => {
    const subjectSlug = subjectName.toLowerCase().replace(/\s+/g, '-');
    const subtopicSlug = subtopicName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/Worksheets/${subjectSlug}/${subtopicSlug}`);
  };

  // New: toggle mobile dropdown open/close
  const toggleMobileDropdown = (dropdownName: 'subjects' | 'worksheets') => {
    setMobileDropdownOpen((prev) => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }));
  };

  return (
    <Navbar expand="lg" className={`${styles.customNavbar} ${bgColor === 'black' ? styles.bgBlack : ''}`}>
      <Navbar.Brand>
        <Link href="/" className={styles.navbarBrand}>
          <Image src="/images/Ignyto_Logo.jpeg" alt="ASVAB WARRIORS" className={styles.navbarLogo} width={120} height={40} />
        </Link>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="navbarNavDropdown" className={styles.navbarToggler} onClick={handleToggleClick}>
        <FaBars className={styles.navbarTogglerIcon} />
      </Navbar.Toggle>

      <Navbar.Collapse id="navbarNavDropdown" className={menuOpen ? styles.navbarCollapseOpen : ''}>
        <Nav className={`ms-auto d-flex flex-column flex-lg-row align-items-start align-items-lg-center ${styles.navContainer}`}>

          {/* SUBJECTS Dropdown */}
          <div className={styles.customDropdown} onMouseLeave={handleMouseLeave}>
            <button
              className={styles.navDropdownButton}
              onClick={() => isMobile && toggleMobileDropdown('subjects')}
              type="button"
              aria-expanded={mobileDropdownOpen.subjects}
            >
              SUBJECTS <FaChevronDown className={styles.dropdownArrow} />
            </button>

            {/* Show dropdown menu based on hover (desktop) or toggle state (mobile) */}
            {( !isMobile || mobileDropdownOpen.subjects ) && (
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

          {/* WORKSHEETS Dropdown */}
          <div className={styles.customDropdown}>
            <button
              className={styles.navDropdownButton}
              onClick={() => isMobile && toggleMobileDropdown('worksheets')}
              type="button"
              aria-expanded={mobileDropdownOpen.worksheets}
            >
              WORKSHEETS <FaChevronDown className={styles.dropdownArrow} />
            </button>
            {( !isMobile || mobileDropdownOpen.worksheets ) && (
              <div className={styles.customDropdownMenu}>
                <Link href="/Worksheets" className={styles.customDropdownItem}>
                  VIEW WORKSHEETS
                </Link>
              </div>
            )}
          </div>

          {/* CONTACT US */}
          <Link href="/Contact" className={styles.navLink}>
            CONTACT US
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
