import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col footer-about">
              <div className="footer-logo">
                <div className="logo-icon">
                  <span className="logo-icon-text">CS</span>
                </div>
                <div className="logo-text">
                  <span className="logo-primary">Fast</span>
                  <span className="logo-secondary">Multimedia</span>
                </div>
              </div>
              <p className="footer-about-text">
                We transform ideas into stunning visual experiences. 
                Professional graphic design services for businesses 
                looking to elevate their brand.
              </p>
              <div className="footer-social">
                <a href="#facebook" className="social-link">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#twitter" className="social-link">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#instagram" className="social-link">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#linkedin" className="social-link">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#dribbble" className="social-link">
                  <i className="fab fa-dribbble"></i>
                </a>
              </div>
            </div>

            <div className="footer-col footer-links">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/portfolio">Portfolio</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-col footer-services">
              <h3 className="footer-title">Services</h3>
              <ul className="footer-menu">
                <li><a href="#branding">Brand Identity</a></li>
                <li><a href="#uiux">UI/UX Design</a></li>
                <li><a href="#web">Web Design</a></li>
                <li><a href="#packaging">Packaging Design</a></li>
                <li><a href="#print">Print Design</a></li>
              </ul>
            </div>

            <div className="footer-col footer-contact">
              <h3 className="footer-title">Contact Info</h3>
              <ul className="footer-contact-info">
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>123 Design Street, San Francisco, CA 94107</span>
                </li>
                <li>
                  <i className="fas fa-phone-alt"></i>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>fasttech227@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {currentYear} Fast Multimedia. All rights reserved.
            </p>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;