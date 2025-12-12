// src/pages/PortfolioCaseStudy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './PortfolioCaseStudy.css';

const PortfolioCaseStudy = () => {
  return (
    <div className="case-study-page">
      {/* Christmas Snowfall */}
      <div className="snowfall">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="snowflake"></div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="case-study-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / 
            <Link to="/portfolio">Portfolio</Link> / 
            <span>Santa's Workshop Branding</span>
          </div>
          
          <div className="hero-content">
            <div className="case-study-badge">
              <span>🎅 Christmas Special Project</span>
            </div>
            <h1 className="case-study-title">Santa's Workshop Branding</h1>
            <p className="case-study-subtitle">
              Complete Christmas branding package for a holiday retail store
            </p>
            
            <div className="project-meta">
              <div className="meta-item">
                <i className="fas fa-calendar"></i>
                <span>December 2023</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-tags"></i>
                <span>Branding, Christmas, Retail</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-clock"></i>
                <span>4 Weeks</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-user"></i>
                <span>Team Project</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="project-overview">
        <div className="container">
          <div className="overview-grid">
            <div className="overview-content">
              <h2>Project Overview</h2>
              <p>
                Santa's Workshop needed a complete Christmas-themed brand identity 
                to stand out during the holiday season. The goal was to create a 
                magical, festive brand that would attract families and create 
                memorable shopping experiences.
              </p>
              
              <div className="challenge-solution">
                <div className="challenge">
                  <h3>🎯 The Challenge</h3>
                  <p>
                    Create a brand identity that captures the magic of Christmas 
                    while maintaining professionalism for a retail business. The 
                    design needed to work across physical and digital platforms.
                  </p>
                </div>
                <div className="solution">
                  <h3>✨ The Solution</h3>
                  <p>
                    Developed a comprehensive brand system with a festive color 
                    palette, custom typography, and magical illustrations that 
                    brought the North Pole to life in the retail space.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="overview-stats">
              <div className="stat-card">
                <div className="stat-number">200%</div>
                <div className="stat-label">Increase in Sales</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">85%</div>
                <div className="stat-label">Customer Satisfaction</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">30%</div>
                <div className="stat-label">Social Media Growth</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Brand Assets Created</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Showcase */}
      <section className="project-showcase">
        <div className="container">
          <h2 className="section-title">Project Showcase</h2>
          
          <div className="showcase-item">
            <div className="showcase-image">
              <img 
                src="https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Santa's Workshop Logo"
              />
            </div>
            <div className="showcase-content">
              <h3>Logo Design</h3>
              <p>
                Created a magical logo featuring Santa's hat integrated with 
                workshop tools. The logo works in both color and monochrome, 
                maintaining its festive spirit across all applications.
              </p>
              <div className="design-elements">
                <span className="design-element">Festive Colors</span>
                <span className="design-element">Custom Typography</span>
                <span className="design-element">Magical Illustrations</span>
              </div>
            </div>
          </div>

          <div className="showcase-item reverse">
            <div className="showcase-content">
              <h3>Packaging System</h3>
              <p>
                Designed a complete packaging system including gift boxes, 
                wrapping paper, and tags. Each element tells a story from the 
                North Pole workshop.
              </p>
              <div className="design-elements">
                <span className="design-element">Eco-friendly Materials</span>
                <span className="design-element">Interactive Elements</span>
                <span className="design-element">Seasonal Variations</span>
              </div>
            </div>
            <div className="showcase-image">
              <img 
                src="https://images.unsplash.com/photo-1512386233331-f023884a92e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Packaging Design"
              />
            </div>
          </div>

          <div className="showcase-item">
            <div className="showcase-image">
              <img 
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Digital Campaign"
              />
            </div>
            <div className="showcase-content">
              <h3>Digital Campaign</h3>
              <p>
                Developed a complete digital marketing campaign including social 
                media graphics, email templates, and animated banners that 
                brought the Christmas magic to digital platforms.
              </p>
              <div className="design-elements">
                <span className="design-element">Social Media Kit</span>
                <span className="design-element">Email Templates</span>
                <span className="design-element">Animated Content</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Elements */}
      <section className="brand-elements">
        <div className="container">
          <h2 className="section-title">Brand Elements</h2>
          
          <div className="brand-grid">
            <div className="brand-item">
              <div className="color-palette">
                <div className="color" style={{ backgroundColor: '#C41E3A' }}></div>
                <div className="color" style={{ backgroundColor: '#0B6623' }}></div>
                <div className="color" style={{ backgroundColor: '#FFD700' }}></div>
                <div className="color" style={{ backgroundColor: '#FFFFFF' }}></div>
              </div>
              <h3>Color Palette</h3>
              <p>Festive red, green, gold, and white for a classic Christmas feel</p>
            </div>
            
            <div className="brand-item">
              <div className="typography">
                <h4 className="font-display">Festive Display</h4>
                <p className="font-body">Cozy Body Text</p>
              </div>
              <h3>Typography</h3>
              <p>Combination of playful display fonts with readable body text</p>
            </div>
            
            <div className="brand-item">
              <div className="iconography">
                <i className="fas fa-tree"></i>
                <i className="fas fa-gift"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-snowflake"></i>
              </div>
              <h3>Iconography</h3>
              <p>Custom Christmas-themed icons for consistent branding</p>
            </div>
            
            <div className="brand-item">
              <div className="pattern">
                <div className="pattern-grid">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="pattern-cell"></div>
                  ))}
                </div>
              </div>
              <h3>Patterns</h3>
              <p>Custom geometric patterns with Christmas motifs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Results & Testimonial */}
      <section className="results-section">
        <div className="container">
          <div className="results-content">
            <h2>Results & Impact</h2>
            <p>
              The new branding transformed Santa's Workshop into a destination 
              Christmas store. Customer feedback praised the magical atmosphere, 
              and sales exceeded projections by 200%.
            </p>
            
            <div className="testimonial">
              <div className="testimonial-content">
                <i className="fas fa-quote-left"></i>
                <p>
                  Working with Fast Multimedia was like having elves from the 
                  North Pole on our team! They captured the magic of Christmas 
                  perfectly and helped us create an unforgettable brand experience.
                </p>
                <div className="testimonial-author">
                  <strong>Mrs. Claus</strong>
                  <span>Owner, Santa's Workshop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="case-study-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Want a Magical Christmas Brand?</h2>
            <p>
              Let's create something amazing for your holiday season. 
              Get your free Christmas design consultation today!
            </p>
            <div className="cta-buttons">
              <Link to="/contact?project=christmas" className="btn btn-primary">
                <i className="fas fa-gift"></i> Get Christmas Quote
              </Link>
              <Link to="/portfolio" className="btn btn-secondary">
                <i className="fas fa-images"></i> View More Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioCaseStudy;