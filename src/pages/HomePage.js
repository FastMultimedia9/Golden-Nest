import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [snowflakes, setSnowflakes] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProject, setQuickViewProject] = useState(null);
  const [currentGreeting, setCurrentGreeting] = useState(0);
  
  // Christmas-themed hero images
  const heroImages = [
    "https://images.unsplash.com/photo-1543470371-128f2246eb72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1573014089155-d1df965a1aaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1573339882949-8c35cfa6b8a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ];

  // Christmas greeting messages
  const christmasGreetings = [
    "🎄 Merry Christmas!",
    "🌟 Happy Holidays!",
    "✨ Season's Greetings!",
    "🎁 Wishing You Joy!",
    "🦌 Ho Ho Ho!"
  ];

  // Calculate Christmas countdown
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const christmasDate = new Date(currentYear, 11, 25);
      
      if (now > christmasDate) {
        christmasDate.setFullYear(currentYear + 1);
      }
      
      const difference = christmasDate.getTime() - now.getTime();
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate snowflakes for Christmas effect
  useEffect(() => {
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 10 + 5}px`,
      opacity: Math.random() * 0.5 + 0.3,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 10}s`
    }));
    setSnowflakes(flakes);
  }, []);

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

  useEffect(() => {
    // Auto-rotate hero images every 5 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const greetingInterval = setInterval(() => {
      setCurrentGreeting((prev) => (prev + 1) % christmasGreetings.length);
    }, 3000);
    
    return () => clearInterval(greetingInterval);
  }, []);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const openQuickView = (projectId) => {
    setQuickViewProject(projectId);
    setShowQuickView(true);
    document.body.style.overflow = 'hidden';
  };

  const closeQuickView = () => {
    setShowQuickView(false);
    setQuickViewProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="homepage">
      {/* Christmas Snowfall Effect */}
      <div className="snowfall">
        {snowflakes.map(flake => (
          <div 
            key={flake.id}
            className="snowflake"
            style={{
              left: flake.left,
              width: flake.size,
              height: flake.size,
              opacity: flake.opacity,
              animationDelay: flake.delay,
              animationDuration: flake.duration
            }}
          />
        ))}
      </div>

      {/* Christmas Decoration - Top Garland */}
      <div className="christmas-garland top-garland">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="garland-light"></div>
        ))}
      </div>

      {/* Christmas Decoration - Bottom Garland */}
      <div className="christmas-garland bottom-garland">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="garland-light"></div>
        ))}
      </div>

      {/* Floating Christmas Ornaments */}
      <div className="christmas-ornaments">
        <div className="ornament ornament-1">🎄</div>
        <div className="ornament ornament-2">🦌</div>
        <div className="ornament ornament-3">🎁</div>
        <div className="ornament ornament-4">🌟</div>
        <div className="ornament ornament-5">🔔</div>
      </div>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="christmas-banner">
          <span className="banner-text">{christmasGreetings[currentGreeting]}</span>
          <div className="banner-lights">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="banner-light"></div>
            ))}
          </div>
        </div>

        <div className="hero-content animate-on-scroll">
          <div className="hero-badge christmas-badge">
            <span className="badge-text">🎁 Christmas Special Offer!</span>
            <div className="badge-dot christmas-dot"></div>
          </div>
          <h1 className="hero-title">
            Create <span className="highlight">Festive</span> & 
            <span className="highlight christmas-highlight"> Magical</span> Designs
          </h1>
          <p className="hero-subtitle">
            This holiday season, let us help you create stunning designs that capture the Christmas spirit.
            Special holiday rates available!
          </p>
          
          <div className="hero-buttons">
            <Link to="/contact?project=christmas" className="btn btn-primary christmas-btn">
              <i className="fas fa-gift"></i> Get Holiday Design Package
            </Link>
            <Link to="/portfolio" className="btn btn-secondary">
              <i className="fas fa-tree"></i> View Christmas Portfolio
            </Link>
          </div>
          
          <div className="hero-stats christmas-stats">
            <div className="stat-item">
              <h3 className="stat-number">🎄</h3>
              <p className="stat-label">Christmas Projects</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">25%</h3>
              <p className="stat-label">Holiday Discount</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">🎁</h3>
              <p className="stat-label">Free Gift Included</p>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="floating-shapes">
            <div className="shape shape-1 christmas-shape"></div>
            <div className="shape shape-2 christmas-shape"></div>
            <div className="shape shape-3 christmas-shape"></div>
          </div>
          
          <div className="hero-image-container christmas-frame">
            <div className="hero-image-carousel">
              {heroImages.map((image, index) => (
                <div 
                  key={index}
                  className={`hero-image-slide ${index === currentImageIndex ? 'active' : ''}`}
                >
                  <img 
                    src={image} 
                    alt={`Christmas Design ${index + 1}`}
                  />
                  <div className="christmas-overlay">
                    <div className="santa-hat">🎅</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="carousel-dots">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => goToImage(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Christmas Countdown Timer */}
      <div className="christmas-countdown animate-on-scroll">
        <div className="countdown-title">🎄 Countdown to Christmas Day 🎄</div>
        <div className="countdown-timer">
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.days.toString().padStart(2, '0')}</span>
            <span className="countdown-label">Days</span>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>
        <div className="countdown-message">Book before Christmas for special holiday rates!</div>
      </div>

      {/* Services Section */}
      <section id="services" className="services-section section">
        <div className="christmas-header">
          <div className="christmas-tree-icon">🎄</div>
          <h2 className="christmas-section-title">Holiday Design Services</h2>
          <div className="christmas-tree-icon">🎄</div>
        </div>
        
        <div className="section-header animate-on-scroll">
          <p className="section-subtitle">
            Special Christmas design packages to make your brand shine this holiday season
          </p>
        </div>
        
        <div className="services-grid">
          <div className="service-card animate-on-scroll christmas-card">
            <div className="service-header">
              <div className="service-icon christmas-icon">
                <i className="fas fa-tree"></i>
              </div>
              <div className="service-profile">
                <div className="profile-icons">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-candy-cane"></i>
                  <i className="fas fa-snowflake"></i>
                  <i className="fas fa-gift"></i>
                </div>
              </div>
            </div>
            <h3 className="service-title">Christmas Branding</h3>
            <p className="service-description">
              Festive brand identities and holiday marketing materials that spread Christmas cheer.
            </p>
            <ul className="service-features">
              <li>Christmas Logo Design</li>
              <li>Holiday Color Palettes</li>
              <li>Seasonal Typography</li>
              <li>Christmas Brand Guides</li>
            </ul>
            <div className="christmas-tag">🎅 Holiday Special</div>
          </div>
          
          <div className="service-card animate-on-scroll christmas-card">
            <div className="service-header">
              <div className="service-icon christmas-icon">
                <i className="fas fa-sleigh"></i>
              </div>
              <div className="service-profile">
                <div className="profile-icons">
                  <i className="fas fa-mitten"></i>
                  <i className="fas fa-bell"></i>
                  <i className="fas fa-holly-berry"></i>
                  <i className="fas fa-fireplace"></i>
                </div>
              </div>
            </div>
            <h3 className="service-title">Holiday Campaigns</h3>
            <p className="service-description">
              Christmas marketing campaigns and social media designs that engage your audience.
            </p>
            <ul className="service-features">
              <li>Christmas Social Media</li>
              <li>Holiday Email Campaigns</li>
              <li>Festive Web Banners</li>
              <li>Seasonal Ad Designs</li>
            </ul>
            <div className="christmas-tag">🌟 Limited Time</div>
          </div>
          
          <div className="service-card animate-on-scroll christmas-card">
            <div className="service-header">
              <div className="service-icon christmas-icon">
                <i className="fas fa-gifts"></i>
              </div>
              <div className="service-profile">
                <div className="profile-icons">
                  <i className="fas fa-reindeer"></i>
                  <i className="fas fa-wreath"></i>
                  <i className="fas fa-ornament"></i>
                  <i className="fas fa-cookie"></i>
                </div>
              </div>
            </div>
            <h3 className="service-title">Festive Packaging</h3>
            <p className="service-description">
              Christmas product packaging and gift wrapping designs that delight customers.
            </p>
            <ul className="service-features">
              <li>Gift Box Design</li>
              <li>Holiday Labels</li>
              <li>Seasonal Wrapping</li>
              <li>Christmas Cards</li>
            </ul>
            <div className="christmas-tag">🎁 25% Off</div>
          </div>
        </div>
        
        <div className="section-cta">
          <Link to="/contact?type=quote" className="btn btn-outline christmas-cta-btn">
            <i className="fas fa-snowman"></i> Get Christmas Quote
          </Link>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="portfolio-preview section">
        <div className="christmas-header">
          <div className="christmas-star-icon">⭐</div>
          <h2 className="christmas-section-title">Festive Portfolio</h2>
          <div className="christmas-star-icon">⭐</div>
        </div>
        
        <div className="section-header animate-on-scroll">
          <p className="section-subtitle">
            See our magical Christmas designs that bring holiday cheer to brands.
            Click any project to view full details and case study.
          </p>
        </div>
        
        <div className="portfolio-grid">
          {/* Project 1 */}
          <div className="portfolio-item animate-on-scroll">
            <div className="portfolio-image">
              <img 
                src="https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Santa's Workshop Branding Project"
              />
              <div className="portfolio-overlay christmas-overlay-portfolio">
                <div className="overlay-content">
                  <h4>Santa's Workshop Branding</h4>
                  <p>Complete Christmas branding for holiday retail store</p>
                  <div className="portfolio-actions">
                    <button className="btn btn-small christmas-portfolio-btn quick-view-btn" 
                      onClick={() => openQuickView('project1')}>
                      <i className="fas fa-eye"></i> Quick View
                    </button>
                    <Link to="/portfolio/santas-workshop" className="btn btn-small btn-outline-light">
                      <i className="fas fa-external-link-alt"></i> Full Case Study
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="portfolio-info">
              <h3 className="portfolio-title">Santa's Workshop Branding</h3>
              <p className="portfolio-category">Christmas Branding & Identity</p>
              <div className="portfolio-tags">
                <span className="portfolio-tag">Logo Design</span>
                <span className="portfolio-tag">Brand Guide</span>
                <span className="portfolio-tag">Packaging</span>
              </div>
            </div>
          </div>
          
          {/* Project 2 */}
          <div className="portfolio-item animate-on-scroll">
            <div className="portfolio-image">
              <img 
                src="https://images.unsplash.com/photo-1512386233331-f023884a92e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="North Pole Packaging Design"
              />
              <div className="portfolio-overlay christmas-overlay-portfolio">
                <div className="overlay-content">
                  <h4>North Pole Packaging</h4>
                  <p>Festive packaging designs for Christmas product line</p>
                  <div className="portfolio-actions">
                    <button className="btn btn-small christmas-portfolio-btn quick-view-btn"
                      onClick={() => openQuickView('project2')}>
                      <i className="fas fa-eye"></i> Quick View
                    </button>
                    <Link to="/portfolio/north-pole-packaging" className="btn btn-small btn-outline-light">
                      <i className="fas fa-external-link-alt"></i> Full Case Study
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="portfolio-info">
              <h3 className="portfolio-title">North Pole Packaging</h3>
              <p className="portfolio-category">Holiday Packaging Design</p>
              <div className="portfolio-tags">
                <span className="portfolio-tag">Gift Boxes</span>
                <span className="portfolio-tag">Labels</span>
                <span className="portfolio-tag">Wrapping</span>
              </div>
            </div>
          </div>
          
          {/* Project 3 */}
          <div className="portfolio-item animate-on-scroll">
            <div className="portfolio-image">
              <img 
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Reindeer Games Marketing Campaign"
              />
              <div className="portfolio-overlay christmas-overlay-portfolio">
                <div className="overlay-content">
                  <h4>Reindeer Games Campaign</h4>
                  <p>Christmas marketing campaign for gaming company</p>
                  <div className="portfolio-actions">
                    <button className="btn btn-small christmas-portfolio-btn quick-view-btn"
                      onClick={() => openQuickView('project3')}>
                      <i className="fas fa-eye"></i> Quick View
                    </button>
                    <Link to="/portfolio/reindeer-games" className="btn btn-small btn-outline-light">
                      <i className="fas fa-external-link-alt"></i> Full Case Study
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="portfolio-info">
              <h3 className="portfolio-title">Reindeer Games Campaign</h3>
              <p className="portfolio-category">Christmas Marketing</p>
              <div className="portfolio-tags">
                <span className="portfolio-tag">Social Media</span>
                <span className="portfolio-tag">Email Campaign</span>
                <span className="portfolio-tag">Digital Ads</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="section-cta animate-on-scroll">
          <Link to="/portfolio" className="btn btn-primary christmas-btn">
            <i className="fas fa-images"></i> View All Christmas Projects
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section christmas-cta">
        <div className="cta-container animate-on-scroll">
          <div className="christmas-cta-decoration">🎄🎁🌟</div>
          <div className="cta-content">
            <h2 className="cta-title">Spread Christmas Joy with Your Brand!</h2>
            <p className="cta-text">
              Limited time holiday offer! Book a Christmas design project and get a 
              free festive social media pack. Let's create something magical together!
            </p>
            <div className="cta-buttons">
              <Link to="/contact?project=christmas" className="btn btn-light christmas-cta-btn">
                <i className="fas fa-santa"></i> Book Christmas Call
              </Link>
              <Link to="/download-guide" className="btn btn-outline-light">
                <i className="fas fa-download"></i> Get Holiday Guide
              </Link>
            </div>
          </div>
          <div className="cta-visual">
            <div className="cta-image christmas-cta-image">
              <img 
                src="https://images.unsplash.com/photo-1575918165410-9ddff7b4e545?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Christmas Design Collaboration"
              />
              <div className="santa-hat-cta">🎅</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="portfolio-quickview-modal">
          <div className="quickview-overlay" onClick={closeQuickView}></div>
          <div className="quickview-content">
            <button className="quickview-close" onClick={closeQuickView}>
              <i className="fas fa-times"></i>
            </button>
            
            {quickViewProject === 'project1' && (
              <div className="quickview-project">
                <div className="quickview-image">
                  <img src="https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                       alt="Santa's Workshop Branding" />
                </div>
                <div className="quickview-info">
                  <h3>Santa's Workshop Branding</h3>
                  <div className="quickview-meta">
                    <span className="quickview-category">Christmas Branding</span>
                    <span className="quickview-date">December 2023</span>
                  </div>
                  <p className="quickview-description">
                    Complete Christmas branding package for a holiday retail store. 
                    Created a festive logo, color palette, typography system, and 
                    comprehensive brand guidelines for seasonal marketing.
                  </p>
                  <div className="quickview-features">
                    <h4>Project Highlights:</h4>
                    <ul>
                      <li>Festive logo with Santa hat integration</li>
                      <li>Christmas-themed color palette</li>
                      <li>Holiday typography system</li>
                      <li>Seasonal brand guidelines</li>
                      <li>Social media templates</li>
                    </ul>
                  </div>
                  <div className="quickview-actions">
                    <Link to="/portfolio/santas-workshop" className="btn btn-primary" onClick={closeQuickView}>
                      <i className="fas fa-file-alt"></i> View Full Case Study
                    </Link>
                    <Link to="/contact" className="btn btn-outline" onClick={closeQuickView}>
                      <i className="fas fa-gift"></i> Get Similar Project
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {quickViewProject === 'project2' && (
              <div className="quickview-project">
                <div className="quickview-image">
                  <img src="https://images.unsplash.com/photo-1512386233331-f023884a92e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                       alt="North Pole Packaging" />
                </div>
                <div className="quickview-info">
                  <h3>North Pole Packaging</h3>
                  <div className="quickview-meta">
                    <span className="quickview-category">Holiday Packaging</span>
                    <span className="quickview-date">November 2023</span>
                  </div>
                  <p className="quickview-description">
                    Festive packaging designs for a Christmas product line. 
                    Created custom gift boxes, labels, and wrapping paper that 
                    capture the magic of the North Pole and delight customers.
                  </p>
                  <div className="quickview-features">
                    <h4>Project Highlights:</h4>
                    <ul>
                      <li>Custom gift box designs</li>
                      <li>Festive product labels</li>
                      <li>Christmas wrapping paper</li>
                      <li>Gift tag designs</li>
                      <li>Seasonal packaging system</li>
                    </ul>
                  </div>
                  <div className="quickview-actions">
                    <Link to="/portfolio/north-pole-packaging" className="btn btn-primary" onClick={closeQuickView}>
                      <i className="fas fa-file-alt"></i> View Full Case Study
                    </Link>
                    <Link to="/contact" className="btn btn-outline" onClick={closeQuickView}>
                      <i className="fas fa-gift"></i> Get Similar Project
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {quickViewProject === 'project3' && (
              <div className="quickview-project">
                <div className="quickview-image">
                  <img src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                       alt="Reindeer Games Campaign" />
                </div>
                <div className="quickview-info">
                  <h3>Reindeer Games Campaign</h3>
                  <div className="quickview-meta">
                    <span className="quickview-category">Christmas Marketing</span>
                    <span className="quickview-date">October 2023</span>
                  </div>
                  <p className="quickview-description">
                    Christmas marketing campaign for a gaming company. 
                    Developed a complete holiday campaign including social media 
                    graphics, email templates, and digital ads with a fun reindeer theme.
                  </p>
                  <div className="quickview-features">
                    <h4>Project Highlights:</h4>
                    <ul>
                      <li>Social media graphics series</li>
                      <li>Christmas email campaign</li>
                      <li>Digital banner ads</li>
                      <li>Animated reindeer characters</li>
                      <li>Holiday campaign strategy</li>
                    </ul>
                  </div>
                  <div className="quickview-actions">
                    <Link to="/portfolio/reindeer-games" className="btn btn-primary" onClick={closeQuickView}>
                      <i className="fas fa-file-alt"></i> View Full Case Study
                    </Link>
                    <Link to="/contact" className="btn btn-outline" onClick={closeQuickView}>
                      <i className="fas fa-gift"></i> Get Similar Project
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;