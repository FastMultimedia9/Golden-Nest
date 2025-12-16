// App.js - UPDATED VERSION with Admin Panel
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import AdminPanel from './pages/AdminPanel'; // ADD THIS
import LoginPage from './pages/LoginPage'; // ADD THIS
import ResourcesPage from './pages/ResourcesPage';
import TrainingPage from './pages/resources/TrainingPage';
import TutorialsPage from './pages/resources/TutorialsPage';
import TemplatesPage from './pages/resources/TemplatesPage';
import ToolsPage from './pages/resources/ToolsPage';
import EbooksPage from './pages/resources/EbooksPage';
import AffiliatesPage from './pages/resources/AffiliatesPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import PortfolioCaseStudy from './pages/portfolio/PortfolioCaseStudy';
import DownloadGuide from './pages/DownloadGuide';
import './App.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Simple authentication check (you can enhance this later)
const isAuthenticated = () => {
  return localStorage.getItem('admin_logged_in') === 'true';
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <ScrollToTop />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:projectId" element={<PortfolioCaseStudy />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<ArticlePage />} />
            
            {/* ADMIN ROUTES */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            
            {/* RESOURCES */}
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/training" element={<TrainingPage />} />
            <Route path="/resources/tutorials" element={<TutorialsPage />} />
            <Route path="/resources/templates" element={<TemplatesPage />} />
            <Route path="/resources/tools" element={<ToolsPage />} />
            <Route path="/resources/ebooks" element={<EbooksPage />} />
            <Route path="/resources/affiliates" element={<AffiliatesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/download-guide" element={<DownloadGuide />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;