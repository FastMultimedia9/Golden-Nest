import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../supabase';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in - FIXED VERSION
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authAPI.getCurrentUser();
        if (user) {
          const userWithProfile = await authAPI.getCurrentUserWithProfile();
          if (userWithProfile?.profile?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/user/dashboard'); // Changed from '/blog' to '/user/dashboard'
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await authAPI.adminLogin(email, password);
      
      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('admin_remember', 'true');
        }
        
        // Show success message
        setError('success:Login successful! Redirecting...');
        
        // Redirect based on user role
        setTimeout(() => {
          if (result.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/user/dashboard'); // Changed from '/blog' to '/user/dashboard'
          }
        }, 500);
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await authAPI.resetPassword(resetEmail);
      
      if (result.success) {
        setResetSuccess(result.message);
        setError('');
      } else {
        setError(result.error || 'Failed to send reset instructions');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowResetForm(false);
    setResetEmail('');
    setResetSuccess('');
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <div className="login-logo">
              <i className="fas fa-cogs"></i>
            </div>
            <h1>Blog Dashboard</h1>
            <p className="login-tagline">
              Secure login powered by Supabase authentication
            </p>
          </div>
          
          <div className="login-features">
            <h3><i className="fas fa-check-circle"></i> Features</h3>
            <ul>
              <li><i className="fas fa-blog"></i> Create and manage blog posts</li>
              <li><i className="fas fa-comments"></i> Comment on articles</li>
              <li><i className="fas fa-chart-line"></i> Track post analytics</li>
              <li><i className="fas fa-users"></i> User role management</li>
              <li><i className="fas fa-bell"></i> Real-time updates</li>
            </ul>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-card">
            {showResetForm ? (
              <>
                <div className="login-header">
                  <h2>Reset Password</h2>
                  <p>Enter your email to receive reset instructions</p>
                </div>
                
                <form onSubmit={handleResetPassword} className="login-form">
                  {error && !resetSuccess && (
                    <div className="alert alert-error">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>{error}</span>
                    </div>
                  )}
                  
                  {resetSuccess && (
                    <div className="alert alert-success">
                      <i className="fas fa-check-circle"></i>
                      <span>{resetSuccess}</span>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="resetEmail">
                      <i className="fas fa-envelope"></i> Email Address
                    </label>
                    <div className="input-group">
                      <input
                        type="email"
                        id="resetEmail"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="login-input"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="login-submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Send Reset Instructions
                      </>
                    )}
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={handleBackToLogin}
                    className="back-btn"
                    disabled={isLoading}
                  >
                    <i className="fas fa-arrow-left"></i> Back to Login
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="login-header">
                  <h2>Sign In</h2>
                  <p>Enter your credentials to access your account</p>
                </div>
                
                <form onSubmit={handleLogin} className="login-form">
                  {error && (
                    <div className={`alert ${error.includes('success:') ? 'alert-success' : 'alert-error'}`}>
                      <i className={`fas ${error.includes('success:') ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                      <span>{error.includes('success:') ? error.replace('success:', '') : error}</span>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="email">
                      <i className="fas fa-envelope"></i> Email Address
                    </label>
                    <div className="input-group">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="login-input"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password">
                      <i className="fas fa-key"></i> Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="login-input"
                        required
                        disabled={isLoading}
                      />
                      <button 
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                        disabled={isLoading}
                      >
                        <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="form-options">
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={isLoading}
                      />
                      <label htmlFor="remember" className="checkbox-label">
                        <span className="checkmark"></span>
                        Remember me
                      </label>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="login-submit"
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

                  {/* Registration Link */}
                  <div className="register-link">
                    <p>Don't have an account? 
                      <button 
                        type="button"
                        onClick={() => navigate('/register')}
                        className="register-btn"
                      >
                        Create Account
                      </button>
                    </p>
                  </div>
                  {!showResetForm && (
                    <button 
                      onClick={() => setShowResetForm(true)}
                      className="forgot-password"
                    >
                      <i className="fas fa-question-circle"></i> Forgot Password?
                    </button>
                  )}
                </form>
              </>
            )}
            
            <div className="login-footer">
              <div className="footer-links">
                {/* Empty as requested */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;