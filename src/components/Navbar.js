import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { authAPI, supabase } from '../supabase';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authAPI.getCurrentUserWithProfile();
        setCurrentUser(user);
        setUserRole(user?.profile?.role || null);
        setUserProfile(user?.profile || null);
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const user = await authAPI.getCurrentUserWithProfile();
          setCurrentUser(user);
          setUserRole(user?.profile?.role || null);
          setUserProfile(user?.profile || null);
        } else {
          setCurrentUser(null);
          setUserRole(null);
          setUserProfile(null);
        }
      }
    );

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(path);
  };

  const handleLogout = async () => {
    await authAPI.logout();
    setCurrentUser(null);
    setUserRole(null);
    setUserProfile(null);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', name: 'Home' },
    { path: '/services', name: 'Services' },
    { path: '/portfolio', name: 'Portfolio' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' }
  ];

  const getUserDisplayName = () => {
    if (!currentUser) return '';
    
    if (userProfile?.name) {
      const firstName = userProfile.name.split(' ')[0];
      return firstName;
    }
    
    if (currentUser.email) {
      const username = currentUser.email.split('@')[0];
      return username.length > 10 ? username.substring(0, 10) + '...' : username;
    }
    
    return 'User';
  };

  const getUserAvatar = () => {
    if (userProfile?.avatar_url) {
      return (
        <img 
          src={userProfile.avatar_url} 
          alt="User Avatar" 
          className="nav-avatar-image"
        />
      );
    }
    return (
      <div className="avatar-placeholder">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill="currentColor"/>
          <path d="M20 17.5C20 19.985 16.418 22 12 22C7.582 22 4 19.985 4 17.5C4 15.015 7.582 13 12 13C16.418 13 20 15.015 20 17.5Z" fill="currentColor"/>
        </svg>
      </div>
    );
  };

  return (
    <div className={`nav-container ${scrolled ? 'scrolled' : ''}`}>
      <nav className="nav">
        {/* Logo */}
        <Link 
          to="/" 
          className="nav-logo"
          onClick={() => handleNavigation('/')}
        >
          <div className="logo-container">
  <div className="logo-icon">
    {/* Using image from public folder - fallback to SVG if image doesn't load */}
    <img 
      src="/logo.png" 
      alt="Fast Multimedia Logo" 
      className="logo-image"
      onError={(e) => {
        // If image fails to load, show SVG fallback
        e.target.style.display = 'none';
        const parent = e.target.parentElement;
        parent.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="logo-svg-fallback">
            <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
            <path d="M12 10L20 16L12 22V10Z" fill="white"/>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#007AFF"/>
                <stop offset="1" stopColor="#5856D6"/>
              </linearGradient>
            </defs>
          </svg>
        `;
      }}
    />
  </div>
  <div className="logo-text">
    <span className="logo-primary">Fast</span>
    <span className="logo-secondary">Multimedia</span>
  </div>
</div>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => handleNavigation(link.path)}
              end
            >
              <span className="link-text">{link.name}</span>
              <span className="link-indicator"></span>
            </NavLink>
          ))}
        </div>

        {/* Desktop Action Buttons */}
        <div className="nav-actions">
          {currentUser ? (
            <div 
              className="user-menu-container"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button 
                className="user-trigger"
                onClick={toggleUserMenu}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <div className="user-avatar">
                  {getUserAvatar()}
                </div>
                <span className="user-name">{getUserDisplayName()}</span>
                <svg className="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className={`user-dropdown ${isUserMenuOpen ? 'show' : ''}`}>
                <div className="dropdown-header">
                  <div className="user-info-large">
                    <div className="user-avatar-large">
                      {userProfile?.avatar_url ? (
                        <img src={userProfile.avatar_url} alt={userProfile.name} />
                      ) : (
                        <div className="avatar-placeholder-large">
                          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path d="M20 20C24.418 20 28 16.418 28 12C28 7.582 24.418 4 20 4C15.582 4 12 7.582 12 12C12 16.418 15.582 20 20 20Z" fill="currentColor"/>
                            <path d="M30 30C30 34.418 25.523 38 20 38C14.477 38 10 34.418 10 30C10 25.582 14.477 22 20 22C25.523 22 30 25.582 30 30Z" fill="currentColor"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="user-details">
                      <div className="user-name-large">{userProfile?.name || currentUser.email}</div>
                      <div className="user-email">{currentUser.email}</div>
                      <div className={`role-tag ${userRole}`}>
                        {userRole === 'admin' ? 'Administrator' : 'User'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <Link 
                  to={userRole === 'admin' ? '/admin' : '/user/dashboard'}
                  className="dropdown-item"
                  onClick={() => {
                    handleNavigation(userRole === 'admin' ? '/admin' : '/user/dashboard');
                    setIsUserMenuOpen(false);
                  }}
                >
                  <svg className="item-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M14 2H2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V3C15 2.44772 14.5523 2 14 2Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M1 5H15" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 2V14" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span>{userRole === 'admin' ? 'Admin Panel' : 'Dashboard'}</span>
                </Link>
                
                <div className="dropdown-divider"></div>
                
                <button 
                  onClick={handleLogout}
                  className="dropdown-item logout"
                >
                  <svg className="item-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 2H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M10 11L13 8L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link 
                to="/login" 
                className="btn btn-login"
                onClick={() => handleNavigation('/login')}
              >
               
              </Link>
            
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-overlay" onClick={toggleMenu}></div>
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'show' : ''}`}>
        <div className="mobile-header">
          <div className="mobile-logo">
            <div className="logo-container">
              <div className="logo-icon">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
                  <path d="M12 10L20 16L12 22V10Z" fill="white"/>
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#007AFF"/>
                      <stop offset="1" stopColor="#5856D6"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="logo-text">
                <span className="logo-primary">Fast</span>
                <span className="logo-secondary">Multimedia</span>
              </div>
            </div>
          </div>
          <button 
            className="mobile-close"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="mobile-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="mobile-link"
              onClick={() => handleNavigation(link.path)}
            >
              <span className="mobile-link-text">{link.name}</span>
              <svg className="mobile-link-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 8H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 4L12 8L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ))}
        </div>

        <div className="mobile-footer">
          {currentUser ? (
            <div className="mobile-user">
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">
                  {userProfile?.avatar_url ? (
                    <img src={userProfile.avatar_url} alt={userProfile.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M20 20C24.418 20 28 16.418 28 12C28 7.582 24.418 4 20 4C15.582 4 12 7.582 12 12C12 16.418 15.582 20 20 20Z" fill="currentColor"/>
                        <path d="M30 30C30 34.418 25.523 38 20 38C14.477 38 10 34.418 10 30C10 25.582 14.477 22 20 22C25.523 22 30 25.582 30 30Z" fill="currentColor"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mobile-user-details">
                  <div className="mobile-user-name">{userProfile?.name || currentUser.email}</div>
                  <div className="mobile-user-email">{currentUser.email}</div>
                  <div className={`role-tag ${userRole}`}>
                    {userRole === 'admin' ? 'Administrator' : 'User'}
                  </div>
                </div>
              </div>
              <div className="mobile-user-actions">
                <Link 
                  to={userRole === 'admin' ? '/admin' : '/user/dashboard'}
                  className="btn btn-outline"
                  onClick={() => handleNavigation(userRole === 'admin' ? '/admin' : '/user/dashboard')}
                >
                  {userRole === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn btn-logout"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="mobile-auth">
              <Link 
                to="/login" 
                className="btn btn-login"
                onClick={() => handleNavigation('/login')}
              >
                Sign In
              </Link>
              <Link 
                to="/contact" 
                className="btn btn-primary"
                onClick={() => handleNavigation('/contact')}
              >
                Get Started
                <svg className="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 4L12 8L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;