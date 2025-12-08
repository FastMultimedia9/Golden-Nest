import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">
            <span className="logo-icon-text">FM</span>
          </div>
          <div className="logo-text">
            <span className="logo-primary">Fast</span>
            <span className="logo-secondary">Multimedia</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-menu">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActive('/')}`}>
                <span className="nav-icon">
                  <i className="fas fa-home"></i>
                </span>
                <span className="nav-text">Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/portfolio" className={`nav-link ${isActive('/portfolio')}`}>
                <span className="nav-icon">
                  <i className="fas fa-briefcase"></i>
                </span>
                <span className="nav-text">Portfolio</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={`nav-link ${isActive('/about')}`}>
                <span className="nav-icon">
                  <i className="fas fa-users"></i>
                </span>
                <span className="nav-text">About</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>
                <span className="nav-icon">
                  <i className="fas fa-envelope"></i>
                </span>
                <span className="nav-text">Contact</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Call-to-action button */}
       

        {/* Mobile Menu Toggle */}
        <div 
          className={`mobile-toggle ${isOpen ? 'open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-list">
          <li className="mobile-nav-item">
            <Link to="/" className={`mobile-nav-link ${isActive('/')}`} onClick={() => setIsOpen(false)}>
              <i className="fas fa-home"></i>
              Home
            </Link>
          </li>
          <li className="mobile-nav-item">
            <Link to="/portfolio" className={`mobile-nav-link ${isActive('/portfolio')}`} onClick={() => setIsOpen(false)}>
              <i className="fas fa-briefcase"></i>
              Portfolio
            </Link>
          </li>
          <li className="mobile-nav-item">
            <Link to="/about" className={`mobile-nav-link ${isActive('/about')}`} onClick={() => setIsOpen(false)}>
              <i className="fas fa-users"></i>
              About
            </Link>
          </li>
          <li className="mobile-nav-item">
            <Link to="/contact" className={`mobile-nav-link ${isActive('/contact')}`} onClick={() => setIsOpen(false)}>
              <i className="fas fa-envelope"></i>
              Contact
            </Link>
          </li>
          <li className="mobile-nav-item">
            <Link to="/contact" className="mobile-cta-button" onClick={() => setIsOpen(false)}>
              <i className="fas fa-paper-plane"></i>
              Get Free Quote
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;