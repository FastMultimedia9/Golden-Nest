// App.js - Using react-helmet instead
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
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
import './App.css';

// Default SEO configuration
const defaultSEO = {
  title: 'Fast Multimedia - Professional Design Services',
  description: 'Professional logo design, web design, graphic design services. Free resources, tutorials, and training for designers.',
  keywords: 'logo design, web design, graphic design, multimedia, design services, Ghana',
  author: 'Fast Multimedia',
  siteUrl: 'https://fastmultimedia.site',
  ogImage: 'https://fastmultimedia.site/og-image.jpg',
  twitterHandle: '@fastmultimedia',
};

// Page-specific SEO configurations
const pageSEO = {
  '/': {
    title: 'Fast Multimedia - Professional Design Services in Ghana',
    description: 'Get professional logo design, web design, and graphic design services. Quality designs at affordable prices for businesses in Ghana.',
  },
  '/about': {
    title: 'About Us - Fast Multimedia',
    description: 'Learn about Fast Multimedia team, our mission, and our passion for creating stunning visual designs for businesses.',
  },
  '/portfolio': {
    title: 'Our Portfolio - Fast Multimedia Design Work',
    description: 'Browse our portfolio of logo designs, website designs, and graphic design projects for clients across Ghana.',
  },
  '/services': {
    title: 'Our Design Services - Fast Multimedia',
    description: 'Professional logo design, web design, graphic design, branding, and digital marketing services.',
  },
  '/blog': {
    title: 'Design Blog - Tips & Tutorials - Fast Multimedia',
    description: 'Read our latest articles on design trends, tips, tutorials, and industry insights from Fast Multimedia.',
  },
  '/resources': {
    title: 'Free Design Resources - Fast Multimedia',
    description: 'Access free design resources including templates, tutorials, tools, ebooks, and training materials.',
  },
  '/resources/training': {
    title: 'Design Training & Courses - Fast Multimedia',
    description: 'Learn design skills with our free and paid training courses, workshops, and tutorials.',
  },
  '/resources/tutorials': {
    title: 'Design Tutorials - Step-by-Step Guides - Fast Multimedia',
    description: 'Free step-by-step design tutorials for beginners and advanced designers.',
  },
  '/resources/templates': {
    title: 'Free Design Templates - Fast Multimedia',
    description: 'Download free professional design templates for logos, business cards, social media, and more.',
  },
  '/resources/tools': {
    title: 'Design Tools & Software - Fast Multimedia',
    description: 'Discover essential design tools, software, and resources for graphic and web designers.',
  },
  '/resources/ebooks': {
    title: 'Free Design Ebooks - Fast Multimedia',
    description: 'Download free ebooks on design principles, branding, web design, and graphic design.',
  },
  '/resources/affiliates': {
    title: 'Affiliate Program - Fast Multimedia',
    description: 'Join our affiliate program and earn commissions by promoting Fast Multimedia design services.',
  },
  '/contact': {
    title: 'Contact Us - Fast Multimedia',
    description: 'Get in touch with Fast Multimedia for design inquiries, quotes, and collaboration opportunities.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy - Fast Multimedia',
    description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
  },
  '/terms': {
    title: 'Terms of Service - Fast Multimedia',
    description: 'Terms and conditions for using Fast Multimedia website and services.',
  },
  '/cookies': {
    title: 'Cookie Policy - Fast Multimedia',
    description: 'Learn how Fast Multimedia uses cookies to improve your browsing experience.',
  },
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function SEOHead({ config = defaultSEO }) {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{config.title}</title>
      <meta name="description" content={config.description} />
      <meta name="keywords" content={config.keywords || defaultSEO.keywords} />
      <meta name="author" content={defaultSEO.author} />
      <link rel="canonical" href={`${defaultSEO.siteUrl}${window.location.pathname}`} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${defaultSEO.siteUrl}${window.location.pathname}`} />
      <meta property="og:title" content={config.title} />
      <meta property="og:description" content={config.description} />
      <meta property="og:image" content={config.ogImage || defaultSEO.ogImage} />
      <meta property="og:site_name" content="Fast Multimedia" />
      <meta property="og:locale" content="en_GH" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={defaultSEO.twitterHandle} />
      <meta name="twitter:creator" content={defaultSEO.twitterHandle} />
      <meta name="twitter:title" content={config.title} />
      <meta name="twitter:description" content={config.description} />
      <meta name="twitter:image" content={config.ogImage || defaultSEO.ogImage} />
      
      {/* Additional SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="General" />
      
      {/* Favicon Links */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
    </Helmet>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <SEOHead />
        <Navbar />
        <ScrollToTop />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <SEOHead config={pageSEO['/']} />
                <HomePage />
              </>
            } />
            <Route path="/about" element={
              <>
                <SEOHead config={pageSEO['/about']} />
                <AboutPage />
              </>
            } />
            <Route path="/portfolio" element={
              <>
                <SEOHead config={pageSEO['/portfolio']} />
                <PortfolioPage />
              </>
            } />
            <Route path="/services" element={
              <>
                <SEOHead config={pageSEO['/services']} />
                <ServicesPage />
              </>
            } />
            <Route path="/blog" element={
              <>
                <SEOHead config={pageSEO['/blog']} />
                <BlogPage />
              </>
            } />
            <Route path="/resources" element={
              <>
                <SEOHead config={pageSEO['/resources']} />
                <ResourcesPage />
              </>
            } />
            <Route path="/resources/training" element={
              <>
                <SEOHead config={pageSEO['/resources/training']} />
                <TrainingPage />
              </>
            } />
            <Route path="/resources/tutorials" element={
              <>
                <SEOHead config={pageSEO['/resources/tutorials']} />
                <TutorialsPage />
              </>
            } />
            <Route path="/resources/templates" element={
              <>
                <SEOHead config={pageSEO['/resources/templates']} />
                <TemplatesPage />
              </>
            } />
            <Route path="/resources/tools" element={
              <>
                <SEOHead config={pageSEO['/resources/tools']} />
                <ToolsPage />
              </>
            } />
            <Route path="/resources/ebooks" element={
              <>
                <SEOHead config={pageSEO['/resources/ebooks']} />
                <EbooksPage />
              </>
            } />
            <Route path="/resources/affiliates" element={
              <>
                <SEOHead config={pageSEO['/resources/affiliates']} />
                <AffiliatesPage />
              </>
            } />
            <Route path="/contact" element={
              <>
                <SEOHead config={pageSEO['/contact']} />
                <ContactPage />
              </>
            } />
            <Route path="/privacy-policy" element={
              <>
                <SEOHead config={pageSEO['/privacy-policy']} />
                <PrivacyPolicy />
              </>
            } />
            <Route path="/terms" element={
              <>
                <SEOHead config={pageSEO['/terms']} />
                <TermsOfService />
              </>
            } />
            <Route path="/cookies" element={
              <>
                <SEOHead config={pageSEO['/cookies']} />
                <CookiePolicy />
              </>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;