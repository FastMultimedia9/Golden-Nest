// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // In production, you should use Firebase Auth or a proper backend
  // This is a simple frontend-only authentication for demo purposes
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123' // Change this in production!
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.username && 
          password === ADMIN_CREDENTIALS.password) {
        // Store login state
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_username', username);
        
        // Redirect to admin dashboard
        navigate('/admin');
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <i className="fas fa-lock"></i>
          </div>
          <h1>Admin Login</h1>
          <p>Enter your credentials to access the admin dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="login-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-group">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          
          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span className="checkbox-custom"></span>
              Remember me
            </label>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>
          
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
          
          <div className="login-footer">
            <p>
              <strong>Demo Credentials:</strong><br />
              Username: <code>admin</code><br />
              Password: <code>admin123</code>
            </p>
            <p className="security-note">
              <i className="fas fa-shield-alt"></i>
              For production, replace with Firebase Authentication
            </p>
          </div>
        </form>
        
        <div className="login-back">
          <button 
            onClick={() => navigate('/')}
            className="back-button"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;