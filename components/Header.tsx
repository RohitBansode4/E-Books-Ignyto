import React, { useEffect, useState, useRef } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';
import { FaChevronDown, FaBars } from 'react-icons/fa';
import { debounce } from 'lodash';
import Link from 'next/link';

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
  const [isIndexPage, setIsIndexPage] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subtopics, setSubtopics] = useState<Record<string, Subtopic[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);

  const router = useRouter();

  const debounceFetchSubtopics = useRef(
    debounce(async (subjectId: string) => {
      if (!subtopics[subjectId]) {
        try {
          const response = await fetch(
            `https://worksheets.asvabwarriors.org/Subjects/Subtopics/api/get_subtopics.php?subject_id=${subjectId}`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch subtopics');
          }
          const data = await response.json();
          setSubtopics((prev) => ({ ...prev, [subjectId]: data.subtopics }));
        } catch (error: any) {
          setError(error.message);
        }
      }
    }, 500)
  );

  useEffect(() => {
    if (window.location.pathname === '/') {
      setIsIndexPage(true);
      setBgColor('black');
    } else {
      setIsIndexPage(false);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60) {
        setBgColor('black');
      } else {
        setBgColor(isIndexPage ? 'black' : '');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isIndexPage]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('https://worksheets.asvabwarriors.org/Subjects/api/get_subjects.php');
        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }
        const data = await response.json();
        setSubjects(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleToggleClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMouseEnter = (subjectId: string) => {
    setActiveSubjectId(subjectId);
    debounceFetchSubtopics.current(subjectId);
  };

  const handleMouseLeave = () => {
    setActiveSubjectId(null);
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

  return (
    <Navbar
      expand="lg"
      className={`${styles.customNavbar} ${bgColor === 'black' ? styles.bgBlack : ''} ${
        isIndexPage && bgColor === 'black' ? styles.indexPageBg : ''
      }`}
      style={{ top: 0, left: 0, right: 0, zIndex: 1 }}
    >
      <Navbar.Brand>
        <Link href="/" className={styles.navbarBrand}>
          <img alt="ASVAB WARRIORS" src="/images/Asvab_logo.png" className={styles.navbarLogo} />
        </Link>
      </Navbar.Brand>

      <Navbar.Toggle
        aria-controls="navbarNavDropdown"
        className={`${styles.navbarToggler} 
                    ${bgColor === 'black' || menuOpen ? styles.navbarTogglerBlack : ''}
                    ${bgColor === 'transparent' && !menuOpen ? styles.navbarTogglerWhite : ''}`}
        onClick={handleToggleClick}
      >
        <FaBars className={styles.navbarTogglerIcon} />
      </Navbar.Toggle>

      <Navbar.Collapse id="navbarNavDropdown" className={menuOpen ? styles.navbarCollapseOpen : ''}>
        <Nav className="ms-auto d-flex justify-content-center align-items-center">
          {/* SUBJECTS Dropdown */}
          <div className={`${styles.customDropdown}`} onMouseLeave={handleMouseLeave}>
            <button
              className={`${styles.navDropdownButton} ${styles.navLink}`}
              onMouseEnter={() => handleMouseEnter('')}
            >
              SUBJECTS <FaChevronDown className={styles.dropdownArrow} />
            </button>

            <div className={`${styles.customDropdownMenu} ${activeSubjectId ? styles.showSubtopics : ''}`}>
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : error ? (
                <p>{error}</p>
              ) : subjects.length > 0 ? (
                subjects.map((subject) => (
                  <Dropdown key={subject.id} drop="end">
                    <Dropdown.Toggle
                      className={`${styles.customDropdownItem} ${styles.navLink}`}
                      onMouseEnter={() => handleMouseEnter(subject.id)}
                      onClick={() => handleSubjectClick(subject.name)}
                    >
                      {subject.name}
                    </Dropdown.Toggle>

                    {subtopics[subject.id] && (
                      <Dropdown.Menu className={styles.customDropdownSubMenu}>
                        {subtopics[subject.id].map((subtopic) => (
                          <Dropdown.Item
                            key={subtopic.id}
                            className={`${styles.customDropdownItem} ${styles.navLink}`}
                            onClick={() => handleSubtopicClick(subject.name, subtopic.name)}
                          >
                            {subtopic.name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    )}
                  </Dropdown>
                ))
              ) : (
                <p>No subjects available</p>
              )}
            </div>
          </div>

          {/* WORKSHEETS Link */}
          <div className={`${styles.customDropdown}`}>
            <button className={`${styles.navDropdownButton} ${styles.navLink}`}>
              WORKSHEETS <FaChevronDown className={styles.dropdownArrow} />
            </button>
            <div className={styles.customDropdownMenu}>
              <Link href="/Worksheets" className={`${styles.customDropdownItem} ${styles.navLink}`}>
                VIEW WORKSHEETS
              </Link>
            </div>
          </div>

          {/* CONTACT Link */}
          <Link href="/Contact" className={styles.navLink}>
            CONTACT US
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
