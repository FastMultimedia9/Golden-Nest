// Navbar.js
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    // Close mobile menu
    setIsMenuOpen(false);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Navigate to the page
    navigate(path);
  };

  const navLinks = [
    { path: '/', name: 'Home', icon: 'fas fa-home' },
    { path: '/services', name: 'Services', icon: 'fas fa-paint-brush' },
    { path: '/work', name: 'Work', icon: 'fas fa-briefcase' },
    { path: '/process', name: 'Process', icon: 'fas fa-cogs' },
    { path: '/about', name: 'About', icon: 'fas fa-info-circle' },
    { path: '/blog', name: 'Blog', icon: 'fas fa-blog' },
    { path: '/contact', name: 'Contact', icon: 'fas fa-envelope' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => handleNavigation('/')}>
          <div className="logo-icon">
            <i className="fas fa-palette"></i>
          </div>
          <div className="logo-text">
            <span className="logo-primary">Fast</span>
            <span className="logo-secondary">Multimedia</span>
          </div>
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className="navbar-toggle" 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => handleNavigation(link.path)}
            >
              <i className={link.icon}></i>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="navbar-cta">
          <Link to="/contact" className="btn btn-primary" onClick={() => handleNavigation('/contact')}>
            <i className="fas fa-rocket"></i>
            Get Quote
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;