import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { authAPI, supabase } from '../supabase';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
    
    // Listen for auth state changes
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
    
    return () => subscription.unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isResourcesOpen) setIsResourcesOpen(false);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const toggleResources = () => {
    setIsResourcesOpen(!isResourcesOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
    setIsUserMenuOpen(false);
    window.scrollTo(0, 0);
    navigate(path);
  };

  const handleLogout = async () => {
    await authAPI.logout();
    setCurrentUser(null);
    setUserRole(null);
    setUserProfile(null);
    setIsUserMenuOpen(false);
    navigate('/');
    window.location.reload();
  };

  const navLinks = [
    { path: '/', name: 'Home', icon: 'fas fa-home' },
    { path: '/services', name: 'Services', icon: 'fas fa-paint-brush' },
    { path: '/portfolio', name: 'Portfolio', icon: 'fas fa-images' },
    { path: '/about', name: 'About', icon: 'fas fa-info-circle' },
    { path: '/blog', name: 'Blog', icon: 'fas fa-blog' },
    { 
      name: 'Resources', 
      icon: 'fas fa-book-open',
      hasDropdown: true,
      submenu: [
        { path: '/resources', name: 'All Resources', icon: 'fas fa-th' },
        { path: '/resources/training', name: 'Training', icon: 'fas fa-graduation-cap' },
        { path: '/resources/tutorials', name: 'Tutorials', icon: 'fas fa-video' },
        { path: '/resources/templates', name: 'Templates', icon: 'fas fa-file-download' },
        { path: '/resources/tools', name: 'Tools', icon: 'fas fa-tools' }
      ]
    },
    { path: '/contact', name: 'Contact', icon: 'fas fa-envelope' }
  ];

  // Get user display info
  const getUserDisplayName = () => {
    if (!currentUser) return '';
    
    if (userProfile?.name) {
      const firstName = userProfile.name.split(' ')[0];
      return firstName.length > 6 ? firstName.substring(0, 6) + '...' : firstName;
    }
    
    if (currentUser.email) {
      const username = currentUser.email.split('@')[0];
      return username.length > 6 ? username.substring(0, 6) + '...' : username;
    }
    
    return 'User';
  };

  const getUserAvatar = () => {
    if (userProfile?.avatar_url) {
      return (
        <img 
          src={userProfile.avatar_url} 
          alt="User Avatar" 
          className="user-avatar-image"
        />
      );
    }
    return <i className="fas fa-user-circle"></i>;
  };

  const getLargeUserAvatar = () => {
    if (userProfile?.avatar_url) {
      return (
        <img 
          src={userProfile.avatar_url} 
          alt="User Avatar" 
          className="user-avatar-large-image"
        />
      );
    }
    return <i className="fas fa-user-circle"></i>;
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={() => handleNavigation('/')}>
            <img 
              src="/logo.png" 
              alt="Fast Multimedia Logo" 
              className="navbar-logo-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="logo-text-fallback">
                    <div class="logo-icon">
                      <i class="fas fa-rocket"></i>
                    </div>
                    <div class="logo-text">
                      <span class="logo-primary">Fast</span>
                      <span class="logo-secondary">Multimedia</span>
                    </div>
                  </div>
                `;
              }}
            />
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="navbar-toggle" 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

          {/* Navigation Links */}
          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div 
                  key={link.name} 
                  className={`nav-link dropdown ${isResourcesOpen ? 'open' : ''}`}
                  onMouseEnter={() => window.innerWidth > 768 && setIsResourcesOpen(true)}
                  onMouseLeave={() => window.innerWidth > 768 && setIsResourcesOpen(false)}
                >
                  <button 
                    className="dropdown-toggle"
                    onClick={() => {
                      if (window.innerWidth <= 768) {
                        toggleResources();
                      }
                    }}
                    aria-expanded={isResourcesOpen}
                    aria-haspopup="true"
                  >
                    <i className={link.icon}></i>
                    <span className="link-text">{link.name}</span>
                    <i className="fas fa-chevron-down dropdown-arrow"></i>
                  </button>
                  
                  <div className={`dropdown-menu ${isResourcesOpen ? 'show' : ''}`}>
                    {link.submenu.map((subitem) => (
                      <Link
                        key={subitem.path}
                        to={subitem.path}
                        className="dropdown-item"
                        onClick={() => handleNavigation(subitem.path)}
                      >
                        <i className={subitem.icon}></i>
                        <span>{subitem.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => handleNavigation(link.path)}
                  end
                >
                  <i className={link.icon}></i>
                  <span className="link-text">{link.name}</span>
                </NavLink>
              )
            ))}

            {/* Mobile Auth Buttons */}
            {!currentUser && isMenuOpen && (
              <div className="mobile-auth-buttons">
                <Link 
                  to="/login" 
                  className="btn btn-outline mobile-auth-btn"
                  onClick={() => handleNavigation('/login')}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary mobile-auth-btn"
                  onClick={() => handleNavigation('/register')}
                >
                  <i className="fas fa-user-plus"></i>
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Mobile User Menu */}
            {currentUser && isMenuOpen && (
              <div className="mobile-user-menu">
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    {userProfile?.avatar_url ? (
                      <img src={userProfile.avatar_url} alt={userProfile.name} />
                    ) : (
                      <i className="fas fa-user-circle"></i>
                    )}
                  </div>
                  <div className="mobile-user-details">
                    <strong>{userProfile?.name || currentUser.email}</strong>
                    <small>{userRole === 'admin' ? 'Administrator' : 'Regular User'}</small>
                    <span className={`role-badge ${userRole}`}>
                      {userRole === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>
                <div className="mobile-user-links">
                  <Link 
                    to={userRole === 'admin' ? '/admin' : '/user/dashboard'}
                    className="mobile-user-link"
                    onClick={() => handleNavigation(userRole === 'admin' ? '/admin' : '/user/dashboard')}
                  >
                    <i className="fas fa-columns"></i>
                    <span>{userRole === 'admin' ? 'Admin Panel' : 'Dashboard'}</span>
                  </Link>
                  {userRole === 'user' && (
                    <Link 
                      to="/user/dashboard?tab=posts"
                      className="mobile-user-link"
                      onClick={() => handleNavigation('/user/dashboard?tab=posts')}
                    >
                      <i className="fas fa-plus"></i>
                      <span>Create Post</span>
                    </Link>
                  )}
                  <Link 
                    to="/blog"
                    className="mobile-user-link"
                    onClick={() => handleNavigation('/blog')}
                  >
                    <i className="fas fa-newspaper"></i>
                    <span>Blog</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="mobile-user-link logout"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop User Account Section */}
          <div className="navbar-account">
            {currentUser ? (
              <div 
                className="user-dropdown"
                onMouseEnter={() => window.innerWidth > 768 && setIsUserMenuOpen(true)}
                onMouseLeave={() => window.innerWidth > 768 && setIsUserMenuOpen(false)}
              >
                <button 
                  className="user-toggle"
                  onClick={() => {
                    if (window.innerWidth <= 768) {
                      toggleUserMenu();
                    }
                  }}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="user-avatar">
                    {getUserAvatar()}
                  </div>
                  <span className="user-name">{getUserDisplayName()}</span>
                  <i className="fas fa-chevron-down dropdown-arrow"></i>
                </button>
                
                <div className={`dropdown-menu user-menu ${isUserMenuOpen ? 'show' : ''}`}>
                  <div className="dropdown-header">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        {getLargeUserAvatar()}
                      </div>
                      <div className="user-details">
                        <strong>{userProfile?.name || currentUser.email}</strong>
                        <small>{currentUser.email}</small>
                        <span className={`role-badge ${userRole}`}>
                          {userRole === 'admin' ? 'Administrator' : 'Regular User'}
                        </span>
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
                    <i className="fas fa-columns"></i>
                    <span>{userRole === 'admin' ? 'Admin Panel' : 'My Dashboard'}</span>
                  </Link>
                  
                  {userRole === 'user' && (
                    <Link 
                      to="/user/dashboard?tab=create-post"
                      className="dropdown-item"
                      onClick={() => {
                        handleNavigation('/user/dashboard?tab=create-post');
                        setIsUserMenuOpen(false);
                      }}
                    >
                      <i className="fas fa-plus"></i>
                      <span>Create Post</span>
                    </Link>
                  )}
                  
                  <Link 
                    to="/blog"
                    className="dropdown-item"
                    onClick={() => {
                      handleNavigation('/blog');
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <i className="fas fa-newspaper"></i>
                    <span>Blog</span>
                  </Link>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item logout"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="desktop-auth-buttons">
                <Link 
                  to="/login" 
                  className="btn btn-outline btn-small"
                  onClick={() => handleNavigation('/login')}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <span className="auth-text">Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary btn-small"
                  onClick={() => handleNavigation('/register')}
                >
                  <i className="fas fa-user-plus"></i>
                  <span className="auth-text">Register</span>
                </Link>
              </div>
            )}

            {/* Desktop CTA Button */}
            <div className="navbar-cta">
              <Link to="/contact" className="btn btn-primary btn-small cta-btn" onClick={() => handleNavigation('/contact')}>
                <i className="fas fa-rocket"></i>
                <span className="cta-text">Get Quote</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;