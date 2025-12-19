import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { supabase, authAPI } from './supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MetaCacheFix from './components/MetaCacheFix'; // ADD THIS IMPORT

// Main Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// User Pages
import UserDashboard from './pages/UserDashboard';

// Resource Pages
import ResourcesPage from './pages/ResourcesPage';
import TrainingPage from './pages/resources/TrainingPage';
import TutorialsPage from './pages/resources/TutorialsPage';
import TemplatesPage from './pages/resources/TemplatesPage';
import ToolsPage from './pages/resources/ToolsPage';
import EbooksPage from './pages/resources/EbooksPage';
import AffiliatesPage from './pages/resources/AffiliatesPage';

// Legal Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

// Portfolio Pages
import PortfolioCaseStudy from './pages/portfolio/PortfolioCaseStudy';

// Utility Pages
import DownloadGuide from './pages/DownloadGuide';

// Test & Debug Pages
import TestSupabase from './pages/TestSupabase';
import AdminView from './pages/AdminView';
import BlogAdmin from './pages/BlogAdmin';
import DatabaseViewer from './pages/DatabaseViewer';

// New Post Page
import NewPostPage from './pages/NewPostPage';

import './App.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route Component with Role-Based Access
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [auth, setAuth] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authAPI.getCurrentUserWithProfile();
        
        if (user) {
          setAuth(true);
          const role = user.profile?.role || 'user';
          setUserRole(role);
          
          // Redirect based on role and route
          const currentPath = window.location.pathname;
          
          if (adminOnly && role !== 'admin') {
            // Non-admin trying to access admin-only route
            window.location.href = '/user/dashboard';
            return;
          }
          
          if (!adminOnly && role === 'admin' && currentPath.includes('/user/')) {
            // Admin trying to access user dashboard
            window.location.href = '/admin';
            return;
          }
          
          if (!adminOnly && role === 'user' && currentPath.includes('/admin/')) {
            // User trying to access admin area
            window.location.href = '/user/dashboard';
            return;
          }
        } else {
          setAuth(false);
          // Redirect to login page (not admin/login)
          window.location.href = '/login';
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuth(false);
        window.location.href = '/login';
        return;
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  return auth ? children : null;
};

// Test Route Component (no protection)
const TestRoute = ({ children }) => {
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <MetaCacheFix /> {/* ADDED THIS COMPONENT */}
        <Navbar />
        <ScrollToTop />
        <main>
          <Routes>
            {/* ===== MAIN PAGES ===== */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:projectId" element={<PortfolioCaseStudy />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/download-guide" element={<DownloadGuide />} />
            
            {/* ===== BLOG PAGES ===== */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<ArticlePage />} />
            
            {/* ===== AUTH PAGES ===== */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* ===== USER DASHBOARD (For Regular Users) ===== */}
            <Route 
              path="/user/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* ===== USER NEW POST PAGE ===== */}
            <Route 
              path="/user/new-post" 
              element={
                <ProtectedRoute>
                  <NewPostPage />
                </ProtectedRoute>
              } 
            />
            
            {/* ===== ADMIN PAGES (ADMIN ONLY) ===== */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blog" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <BlogAdmin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/database" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <DatabaseViewer />
                </ProtectedRoute>
              } 
            />
            
            {/* ===== NEW POST PAGE (ADMIN ONLY) ===== */}
            <Route 
              path="/admin/posts/new" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <NewPostPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/posts/edit/:id" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <NewPostPage />
                </ProtectedRoute>
              } 
            />
            
            {/* ===== TEST & DEBUG PAGES (Public) ===== */}
            <Route 
              path="/test" 
              element={
                <TestRoute>
                  <TestSupabase />
                </TestRoute>
              } 
            />
            <Route 
              path="/admin-view" 
              element={
                <TestRoute>
                  <AdminView />
                </TestRoute>
              } 
            />
            
            {/* ===== RESOURCE PAGES ===== */}
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/training" element={<TrainingPage />} />
            <Route path="/resources/tutorials" element={<TutorialsPage />} />
            <Route path="/resources/templates" element={<TemplatesPage />} />
            <Route path="/resources/tools" element={<ToolsPage />} />
            <Route path="/resources/ebooks" element={<EbooksPage />} />
            <Route path="/resources/affiliates" element={<AffiliatesPage />} />
            
            {/* ===== LEGAL PAGES ===== */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            
            {/* ===== 404 PAGE ===== */}
            <Route path="*" element={
              <div className="not-found-page">
                <div className="container">
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <div className="suggestions">
                    <p>You might want to:</p>
                    <ul>
                      <li><a href="/">Go to Homepage</a></li>
                      <li><a href="/blog">Browse the Blog</a></li>
                      <li><a href="/test">Test Database Connection</a></li>
                      <li><a href="/login">Login</a></li>
                      <li><a href="/admin/login">Admin Login</a></li>
                      <li><a href="/admin/posts/new">Create New Post</a></li>
                    </ul>
                  </div>
                  <a href="/" className="back-home-btn">Back to Home</a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;