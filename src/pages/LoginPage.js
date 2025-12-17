import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Admin credentials (in production, use Firebase Auth)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123' // CHANGE THIS IN PRODUCTION!
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.username && 
          password === ADMIN_CREDENTIALS.password) {
        
        // Store login state
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_username', username);
        
        if (rememberMe) {
          localStorage.setItem('admin_remember', 'true');
        }
        
        // Show success message
        setError('');
        
        // Redirect to admin dashboard
        navigate('/admin');
      } else {
        setError('Invalid username or password. Try: admin / admin123');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleDemoLogin = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-icon">
              <i className="fas fa-lock"></i>
            </div>
            <h1>Admin Portal</h1>
            <p>Sign in to manage your blog content</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className={`alert ${error.includes('Invalid') ? 'alert-error' : 'alert-info'}`}>
                <i className={`fas ${error.includes('Invalid') ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                <span>{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username">
                <i className="fas fa-user"></i> Username
              </label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  required
                  disabled={isLoading}
                />
                <i className="fas fa-user input-icon"></i>
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-key"></i> Password
              </label>
              <div className="input-with-icon">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <i className="fas fa-lock input-icon"></i>
              </div>
            </div>

            {/* Options */}
            <div className="form-options">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              
              <button 
                type="button" 
                className="forgot-link"
                onClick={() => alert('Contact system administrator to reset password')}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>

            {/* Demo Button */}
            <button 
              type="button" 
              className="demo-button"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <i className="fas fa-magic"></i>
              Use Demo Credentials
            </button>
          </form>

          {/* Demo Info */}
          <div className="demo-info">
            <h4><i className="fas fa-info-circle"></i> Demo Access</h4>
            <div className="credentials">
              <div className="credential">
                <span className="label">Username:</span>
                <code>admin</code>
              </div>
              <div className="credential">
                <span className="label">Password:</span>
                <code>admin123</code>
              </div>
            </div>
            <p className="security-warning">
              <i className="fas fa-shield-alt"></i>
              For production, replace with Firebase Authentication
            </p>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>Need help? <Link to="/contact">Contact Support</Link></p>
            <Link to="/" className="back-link">
              <i className="fas fa-arrow-left"></i>
              Back to Website
            </Link>
          </div>
        </div>

        {/* Side Info */}
        <div className="login-side-info">
          <div className="side-content">
            <h2><i className="fas fa-cogs"></i> Admin Features</h2>
            <ul className="features-list">
              <li><i className="fas fa-check-circle"></i> Create & Edit Blog Posts</li>
              <li><i className="fas fa-check-circle"></i> Manage Comments</li>
              <li><i className="fas fa-check-circle"></i> View Analytics</li>
              <li><i className="fas fa-check-circle"></i> Upload Media</li>
              <li><i className="fas fa-check-circle"></i> User Management</li>
            </ul>
            
            <div className="security-tip">
              <h3><i className="fas fa-lightbulb"></i> Security Tip</h3>
              <p>Always log out from public computers and use strong passwords.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;