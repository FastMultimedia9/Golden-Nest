import React from 'react';
import { Link } from 'react-router-dom';
import './DownloadGuide.css';

const DownloadGuide = () => {
  const handleDownload = () => {
    // Create download link
    const link = document.createElement('a');
    link.href = '/christmas-design-guide.pdf';
    link.download = 'Fast-Multimedia-Christmas-Design-Guide.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="download-guide-page">
      {/* Christmas Snowfall */}
      <div className="snowfall">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="snowflake"></div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="download-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🎁 Free Christmas Resource</span>
            </div>
            <h1 className="hero-title">Christmas Design Guide 2023</h1>
            <p className="hero-subtitle">
              Everything you need to create magical holiday designs for your brand
            </p>
            
            <div className="download-card">
              <div className="card-content">
                <div className="guide-icon">
                  <i className="fas fa-book-open"></i>
                </div>
                <div className="guide-info">
                  <h3>Ultimate Christmas Design Guide</h3>
                  <p className="guide-description">
                    48 pages of festive design inspiration, tips, and templates to 
                    make your brand shine this holiday season
                  </p>
                  
                  <div className="guide-features">
                    <div className="feature">
                      <i className="fas fa-check"></i>
                      <span>Festive color palettes with HEX codes</span>
                    </div>
                    <div className="feature">
                      <i className="fas fa-check"></i>
                      <span>Christmas typography guide</span>
                    </div>
                    <div className="feature">
                      <i className="fas fa-check"></i>
                      <span>Social media templates (Canva & Photoshop)</span>
                    </div>
                    <div className="feature">
                      <i className="fas fa-check"></i>
                      <span>Marketing campaign ideas</span>
                    </div>
                    <div className="feature">
                      <i className="fas fa-check"></i>
                      <span>Packaging design inspiration</span>
                    </div>
                    <div className="feature">
                      <i className="fas fa-check"></i>
                      <span>Holiday email templates</span>
                    </div>
                  </div>
                  
                  <button onClick={handleDownload} className="btn btn-christmas btn-large">
                    <i className="fas fa-download"></i> Download Free Guide
                  </button>
                  
                  <p className="download-note">
                    <i className="fas fa-gift"></i> No email required. Instant download.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="guide-contents">
        <div className="container">
          <h2 className="section-title">What's Inside the Guide</h2>
          
          <div className="contents-grid">
            <div className="content-card">
              <div className="content-icon">
                <i className="fas fa-palette"></i>
              </div>
              <h3>Festive Color Palettes</h3>
              <p>Complete Christmas color systems with HEX codes and usage guidelines for different platforms.</p>
            </div>
            
            <div className="content-card">
              <div className="content-icon">
                <i className="fas fa-font"></i>
              </div>
              <h3>Typography Guide</h3>
              <p>Best fonts for holiday designs with pairing suggestions for headers, body text, and accents.</p>
            </div>
            
            <div className="content-card">
              <div className="content-icon">
                <i className="fas fa-images"></i>
              </div>
              <h3>Design Templates</h3>
              <p>Ready-to-use templates for social media posts, stories, banners, and marketing materials.</p>
            </div>
            
            <div className="content-card">
              <div className="content-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>Creative Ideas</h3>
              <p>Inspiration for Christmas campaigns, promotions, and engaging holiday content strategies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="guide-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Need Professional Christmas Designs?</h2>
            <p>
              Let our team create custom holiday designs that will make your 
              brand stand out this Christmas season.
            </p>
            <div className="cta-buttons">
              <Link to="/contact?project=christmas" className="btn btn-christmas">
                <i className="fas fa-gift"></i> Get Christmas Quote
              </Link>
              <Link to="/portfolio" className="btn btn-secondary">
                <i className="fas fa-images"></i> View Christmas Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DownloadGuide;