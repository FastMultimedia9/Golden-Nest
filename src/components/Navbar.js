import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  // Handle scroll effect
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

  // Close mobile menu when clicking a link
  const handleLinkClick = (section) => {
    setActiveLink(section);
    setIsOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <a href="#home" className="logo" onClick={() => handleLinkClick('home')}>
          <div className="logo-icon">
            <span className="logo-icon-text">CS</span>
          </div>
          <div className="logo-text">
            <span className="logo-primary">Creative</span>
            <span className="logo-secondary">Studio</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="nav-menu">
          <ul className="nav-list">
            <li className="nav-item">
              <a 
                href="#home" 
                className={`nav-link ${activeLink === 'home' ? 'active' : ''}`}
                onClick={() => handleLinkClick('home')}
              >
                <span className="nav-icon">
                  <i className="fas fa-home"></i>
                </span>
                <span className="nav-text">Home</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#portfolio" 
                className={`nav-link ${activeLink === 'portfolio' ? 'active' : ''}`}
                onClick={() => handleLinkClick('portfolio')}
              >
                <span className="nav-icon">
                  <i className="fas fa-briefcase"></i>
                </span>
                <span className="nav-text">Portfolio</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#services" 
                className={`nav-link ${activeLink === 'services' ? 'active' : ''}`}
                onClick={() => handleLinkClick('services')}
              >
                <span className="nav-icon">
                  <i className="fas fa-palette"></i>
                </span>
                <span className="nav-text">Services</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#about" 
                className={`nav-link ${activeLink === 'about' ? 'active' : ''}`}
                onClick={() => handleLinkClick('about')}
              >
                <span className="nav-icon">
                  <i className="fas fa-users"></i>
                </span>
                <span className="nav-text">About</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#contact" 
                className={`nav-link ${activeLink === 'contact' ? 'active' : ''}`}
                onClick={() => handleLinkClick('contact')}
              >
                <span className="nav-icon">
                  <i className="fas fa-envelope"></i>
                </span>
                <span className="nav-text">Contact</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Call-to-action button */}
        <div className="nav-cta">
          <button className="cta-button">
            <span className="cta-icon">
              <i className="fas fa-paper-plane"></i>
            </span>
            <span className="cta-text">Get Quote</span>
          </button>
        </div>

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
            <a 
              href="#home" 
              className={`mobile-nav-link ${activeLink === 'home' ? 'active' : ''}`}
              onClick={() => handleLinkClick('home')}
            >
              <i className="fas fa-home"></i>
              Home
            </a>
          </li>
          <li className="mobile-nav-item">
            <a 
              href="#portfolio" 
              className={`mobile-nav-link ${activeLink === 'portfolio' ? 'active' : ''}`}
              onClick={() => handleLinkClick('portfolio')}
            >
              <i className="fas fa-briefcase"></i>
              Portfolio
            </a>
          </li>
          <li className="mobile-nav-item">
            <a 
              href="#services" 
              className={`mobile-nav-link ${activeLink === 'services' ? 'active' : ''}`}
              onClick={() => handleLinkClick('services')}
            >
              <i className="fas fa-palette"></i>
              Services
            </a>
          </li>
          <li className="mobile-nav-item">
            <a 
              href="#about" 
              className={`mobile-nav-link ${activeLink === 'about' ? 'active' : ''}`}
              onClick={() => handleLinkClick('about')}
            >
              <i className="fas fa-users"></i>
              About
            </a>
          </li>
          <li className="mobile-nav-item">
            <a 
              href="#contact" 
              className={`mobile-nav-link ${activeLink === 'contact' ? 'active' : ''}`}
              onClick={() => handleLinkClick('contact')}
            >
              <i className="fas fa-envelope"></i>
              Contact
            </a>
          </li>
          <li className="mobile-nav-item">
            <button className="mobile-cta-button">
              <i className="fas fa-paper-plane"></i>
              Get Free Quote
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;