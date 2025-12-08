import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
          element.classList.add('animated');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
    
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content animate-on-scroll">
          <div className="hero-badge">
            <span className="badge-text">Award Winning Design Studio</span>
            <div className="badge-dot"></div>
          </div>
          <h1 className="hero-title">
            We Create <span className="highlight">Beautiful</span> & 
            <span className="highlight"> Effective</span> Designs
          </h1>
          <p className="hero-subtitle">
            Transforming ideas into stunning visual experiences. 
            We craft memorable brand identities that connect with your audience.
          </p>
          <div className="hero-buttons">
            <Link to="/contact" className="btn btn-primary">
              <i className="fas fa-rocket"></i> Start Your Project
            </Link>
            <Link to="/portfolio" className="btn btn-secondary">
              <i className="fas fa-images"></i> View Portfolio
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <h3 className="stat-number">250+</h3>
              <p className="stat-label">Projects Completed</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">98%</h3>
              <p className="stat-label">Client Satisfaction</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">50+</h3>
              <p className="stat-label">Happy Clients</p>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
          <div className="hero-image-container">
            <div className="hero-image">
              <img 
                src="https://images.unsplash.com/photo-1558655146-364adaf1fcc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Design Studio Workspace" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section section">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">Our Design Services</h2>
          <p className="section-subtitle">
            Comprehensive design solutions tailored to your business needs
          </p>
        </div>
        
        <div className="services-grid">
          <div className="service-card animate-on-scroll">
            <div className="service-icon">
              <i className="fas fa-paint-brush"></i>
            </div>
            <h3 className="service-title">Brand Identity</h3>
            <p className="service-description">
              Create a unique visual identity that communicates your brand's values and personality.
            </p>
            <ul className="service-features">
              <li>Logo Design</li>
              <li>Color Palette</li>
              <li>Typography System</li>
              <li>Brand Guidelines</li>
            </ul>
          </div>
          
          <div className="service-card animate-on-scroll">
            <div className="service-icon">
              <i className="fas fa-desktop"></i>
            </div>
            <h3 className="service-title">UI/UX Design</h3>
            <p className="service-description">
              Design intuitive and engaging digital experiences that users love.
            </p>
            <ul className="service-features">
              <li>Wireframing</li>
              <li>Prototyping</li>
              <li>User Testing</li>
              <li>Responsive Design</li>
            </ul>
          </div>
          
          <div className="service-card animate-on-scroll">
            <div className="service-icon">
              <i className="fas fa-bullhorn"></i>
            </div>
            <h3 className="service-title">Marketing Design</h3>
            <p className="service-description">
              Create compelling marketing materials that drive engagement and conversions.
            </p>
            <ul className="service-features">
              <li>Social Media Graphics</li>
              <li>Print Materials</li>
              <li>Digital Ads</li>
              <li>Email Campaigns</li>
            </ul>
          </div>
        </div>
        
        <div className="section-cta animate-on-scroll">
          <Link to="/contact" className="btn btn-outline">
            <i className="fas fa-list"></i> View All Services
          </Link>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="portfolio-preview section">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Explore our recent work that showcases creativity and innovation
          </p>
        </div>
        
        <div className="portfolio-grid">
          <div className="portfolio-item animate-on-scroll">
            <div className="portfolio-image">
              <img 
                src="https://images.unsplash.com/photo-1634942537034-2531766767d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="EcoBrand Identity Project"
              />
              <div className="portfolio-overlay">
                <div className="overlay-content">
                  <h4>EcoBrand Identity</h4>
                  <p>Complete brand identity for sustainable products company</p>
                  <Link to="/portfolio" className="btn btn-small">
                    <i className="fas fa-eye"></i> View Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="portfolio-item animate-on-scroll">
            <div className="portfolio-image">
              <img 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80" 
                alt="Finance Mobile App Design"
              />
              <div className="portfolio-overlay">
                <div className="overlay-content">
                  <h4>Finance Mobile App</h4>
                  <p>UI/UX design for personal finance management app</p>
                  <Link to="/portfolio" className="btn btn-small">
                    <i className="fas fa-eye"></i> View Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="portfolio-item animate-on-scroll">
            <div className="portfolio-image">
              <img 
                src="https://images.unsplash.com/photo-1580995170656-f0aa5c5c31dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Organic Food Packaging Design"
              />
              <div className="portfolio-overlay">
                <div className="overlay-content">
                  <h4>Organic Food Packaging</h4>
                  <p>Packaging design for organic food product line</p>
                  <Link to="/portfolio" className="btn btn-small">
                    <i className="fas fa-eye"></i> View Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="section-cta animate-on-scroll">
          <Link to="/portfolio" className="btn btn-primary">
            <i className="fas fa-images"></i> View Full Portfolio
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container animate-on-scroll">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Brand?</h2>
            <p className="cta-text">
              Let's discuss your project and create something amazing together.
              Get a free consultation and quote.
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-light">
                <i className="fas fa-calendar-alt"></i> Schedule Call
              </Link>
              <Link to="/contact" className="btn btn-outline-light">
                <i className="fas fa-download"></i> Download Brochure
              </Link>
            </div>
          </div>
          <div className="cta-visual">
            <div className="cta-image">
              <img 
                src="https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Design Collaboration"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;