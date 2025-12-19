import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [snowflakes, setSnowflakes] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProject, setQuickViewProject] = useState(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const navigate = useNavigate();
  
  // Christmas-themed hero images
  const heroImages = [
    "https://images.unsplash.com/photo-1547887537-6158d64c35b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/phone-1512389142860-9c449e58a543?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
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

  const openPackageModal = () => {
    setShowPackageModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closePackageModal = () => {
    setShowPackageModal(false);
    document.body.style.overflow = 'auto';
  };

  const openPortfolioModal = () => {
    setShowPortfolioModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closePortfolioModal = () => {
    setShowPortfolioModal(false);
    document.body.style.overflow = 'auto';
  };

  const handlePackageSelect = (packageType) => {
    setSelectedPackage(packageType);
  };

  const handlePackageOrder = () => {
    // Get selected package details
    const selectedPackageDetails = holidayPackages.find(pkg => pkg.id === selectedPackage);
    
    // Navigate to contact page with package details in query params
    navigate(`/contact?package=${selectedPackage}&project=Christmas%20Design&type=${encodeURIComponent(selectedPackageDetails.name)}`);
    
    closePackageModal();
  };

  // Holiday Design Packages
  const holidayPackages = [
    {
      id: 'basic',
      name: 'Festive Starter',
      price: '$499',
      discount: '25% OFF',
      originalPrice: '$665',
      features: [
        'Christmas Logo Design',
        'Holiday Color Palette',
        '3 Social Media Templates',
        'Email Newsletter Design',
        '1 Revisions'
      ],
      description: 'Perfect for small businesses starting their holiday marketing'
    },
    {
      id: 'pro',
      name: 'Merry Marketing',
      price: '$899',
      discount: '30% OFF',
      originalPrice: '$1285',
      features: [
        'Everything in Festive Starter',
        'Complete Social Media Kit (15 templates)',
        'Website Holiday Banner',
        'Email Campaign Design',
        'Product Packaging Mockup',
        '3 Revisions',
        'Priority Support'
      ],
      description: 'Ideal for established businesses running holiday campaigns'
    },
    {
      id: 'premium',
      name: 'Santa\'s Workshop',
      price: '$1499',
      discount: '35% OFF',
      originalPrice: '$2307',
      features: [
        'Everything in Merry Marketing',
        'Complete Brand Guidelines',
        'Print Materials (Flyers, Posters)',
        'Animated Social Media Posts',
        'Gift Card & Voucher Design',
        'Unlimited Revisions',
        'Dedicated Designer',
        'Free Stock Photos',
        '48-hour Rush Delivery Option'
      ],
      description: 'Complete holiday branding solution for major campaigns'
    }
  ];

  // Portfolio Projects for Modal
  const portfolioProjects = [
    {
      id: 'project1',
      title: "Santa's Workshop Branding",
      category: "Christmas Branding & Identity",
      description: "Complete Christmas branding for holiday retail store including festive logo, color palette, and brand guidelines.",
      image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      tags: ["Logo Design", "Brand Guide", "Packaging"],
      details: [
        "Festive logo with Santa hat integration",
        "Christmas-themed color palette",
        "Holiday typography system",
        "Seasonal brand guidelines",
        "Social media templates"
      ]
    },
    {
      id: 'project2',
      title: "North Pole Packaging",
      category: "Holiday Packaging Design",
      description: "Festive packaging designs for Christmas product line including custom gift boxes and seasonal wrapping paper.",
      image: "https://images.unsplash.com/photo-1512386233331-f023884a92e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      tags: ["Gift Boxes", "Labels", "Wrapping"],
      details: [
        "Custom gift box designs",
        "Festive product labels",
        "Christmas wrapping paper",
        "Gift tag designs",
        "Seasonal packaging system"
      ]
    },
    {
      id: 'project3',
      title: "Reindeer Games Campaign",
      category: "Christmas Marketing",
      description: "Christmas marketing campaign for gaming company with social media graphics and holiday ad designs.",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      tags: ["Social Media", "Email Campaign", "Digital Ads"],
      details: [
        "Social media graphics series",
        "Christmas email campaign",
        "Digital banner ads",
        "Animated reindeer characters",
        "Holiday campaign strategy"
      ]
    },
    {
      id: 'project4',
      title: "Winter Wonderland Website",
      category: "Holiday Web Design",
      description: "Christmas-themed website redesign with interactive snow effects and festive animations.",
      image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      tags: ["Web Design", "Animation", "Interactive"],
      details: [
        "Animated snow effects",
        "Interactive Advent calendar",
        "Festive navigation",
        "Mobile-responsive design",
        "Performance optimization"
      ]
    }
  ];

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
            Special holiday rates available until December 25th!
          </p>
          
          <div className="hero-buttons">
            <button className="btn btn-primary christmas-btn" onClick={openPackageModal}>
              <i className="fas fa-gift"></i> Get Holiday Design Package
            </button>
            <button className="btn btn-secondary" onClick={openPortfolioModal}>
              <i className="fas fa-tree"></i> View Christmas Portfolio
            </button>
          </div>
          
          <div className="hero-stats christmas-stats">
            <div className="stat-item">
              <h3 className="stat-number">🎄</h3>
              <p className="stat-label">Christmas Projects</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">25-35%</h3>
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
        <div className="countdown-message">Book before Christmas for special holiday rates! Offer ends December 25th.</div>
      </div>

      {/* Holiday Design Package Modal - Moved to top when shown */}
      {showPackageModal && (
        <div className="holiday-package-modal-top">
          <div className="modal-overlay" onClick={closePackageModal}></div>
          <div className="modal-content package-modal-top">
            <button className="modal-close" onClick={closePackageModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">🎁 Christmas Design Packages</h2>
              <p className="modal-subtitle">Special holiday rates valid until December 25th</p>
            </div>
            
            <div className="packages-grid">
              {holidayPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className={`package-card ${selectedPackage === pkg.id ? 'selected' : ''}`}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  <div className="package-badge">{pkg.discount}</div>
                  <div className="package-header">
                    <h3 className="package-name">{pkg.name}</h3>
                    <div className="package-price">
                      <span className="current-price">{pkg.price}</span>
                      <span className="original-price">{pkg.originalPrice}</span>
                    </div>
                  </div>
                  <p className="package-description">{pkg.description}</p>
                  <ul className="package-features">
                    {pkg.features.map((feature, index) => (
                      <li key={index}><i className="fas fa-check"></i> {feature}</li>
                    ))}
                  </ul>
                  <button 
                    className={`btn ${selectedPackage === pkg.id ? 'btn-primary' : 'btn-outline'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePackageSelect(pkg.id);
                    }}
                  >
                    {selectedPackage === pkg.id ? '✓ Selected' : 'Select Package'}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-primary christmas-btn" onClick={handlePackageOrder}>
                <i className="fas fa-shopping-cart"></i> Order Selected Package
              </button>
              <p className="modal-note">* All packages include free consultation and 1 free social media post design</p>
            </div>
          </div>
        </div>
      )}

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
          <button className="btn btn-outline christmas-cta-btn" onClick={openPackageModal}>
            <i className="fas fa-snowman"></i> Get Christmas Quote
          </button>
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
          {portfolioProjects.slice(0, 3).map((project) => (
            <div key={project.id} className="portfolio-item animate-on-scroll">
              <div className="portfolio-image">
                <img src={project.image} alt={project.title} />
                <div className="portfolio-overlay christmas-overlay-portfolio">
                  <div className="overlay-content">
                    <h4>{project.title}</h4>
                    <p>{project.description.substring(0, 80)}...</p>
                    <div className="portfolio-actions">
                      <button className="btn btn-small christmas-portfolio-btn quick-view-btn" 
                        onClick={() => openQuickView(project.id)}>
                        <i className="fas fa-eye"></i> Quick View
                      </button>
                      <button className="btn btn-small btn-outline-light" onClick={openPortfolioModal}>
                        <i className="fas fa-external-link-alt"></i> Full Case Study
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="portfolio-info">
                <h3 className="portfolio-title">{project.title}</h3>
                <p className="portfolio-category">{project.category}</p>
                <div className="portfolio-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="portfolio-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="section-cta animate-on-scroll">
          <button className="btn btn-primary christmas-btn" onClick={openPortfolioModal}>
            <i className="fas fa-images"></i> View All Christmas Projects
          </button>
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
              <button className="btn btn-light christmas-cta-btn" onClick={openPackageModal}>
                <i className="fas fa-santa"></i> Book Christmas Call
              </button>
              <button className="btn btn-outline-light" onClick={openPortfolioModal}>
                <i className="fas fa-images"></i> View Portfolio
              </button>
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

      {/* Christmas Portfolio Modal */}
      {showPortfolioModal && (
        <div className="christmas-portfolio-modal">
          <div className="modal-overlay" onClick={closePortfolioModal}></div>
          <div className="modal-content portfolio-modal">
            <button className="modal-close" onClick={closePortfolioModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">🎄 Christmas Portfolio Gallery</h2>
              <p className="modal-subtitle">Our festive design projects from previous holiday seasons</p>
            </div>
            
            <div className="portfolio-gallery">
              {portfolioProjects.map((project) => (
                <div key={project.id} className="gallery-item">
                  <div className="gallery-image">
                    <img src={project.image} alt={project.title} />
                    <div className="gallery-overlay">
                      <div className="overlay-content">
                        <h4>{project.title}</h4>
                        <p>{project.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="gallery-info">
                    <h3>{project.title}</h3>
                    <p className="gallery-category">{project.category}</p>
                    <p className="gallery-description">{project.description}</p>
                    <div className="gallery-tags">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="gallery-tag">{tag}</span>
                      ))}
                    </div>
                    <button 
                      className="btn btn-small christmas-portfolio-btn"
                      onClick={() => {
                        closePortfolioModal();
                        openQuickView(project.id);
                      }}
                    >
                      <i className="fas fa-eye"></i> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-primary christmas-btn" onClick={openPackageModal}>
                <i className="fas fa-gift"></i> Get Your Own Christmas Design
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="portfolio-quickview-modal">
          <div className="quickview-overlay" onClick={closeQuickView}></div>
          <div className="quickview-content">
            <button className="quickview-close" onClick={closeQuickView}>
              <i className="fas fa-times"></i>
            </button>
            
            {portfolioProjects.map((project) => (
              quickViewProject === project.id && (
                <div key={project.id} className="quickview-project">
                  <div className="quickview-image">
                    <img src={project.image} alt={project.title} />
                  </div>
                  <div className="quickview-info">
                    <h3>{project.title}</h3>
                    <div className="quickview-meta">
                      <span className="quickview-category">{project.category}</span>
                      <span className="quickview-date">Christmas 2023</span>
                    </div>
                    <p className="quickview-description">{project.description}</p>
                    <div className="quickview-features">
                      <h4>Project Highlights:</h4>
                      <ul>
                        {project.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="quickview-actions">
                      <button className="btn btn-primary" onClick={openPackageModal}>
                        <i className="fas fa-gift"></i> Get Similar Project
                      </button>
                      <button className="btn btn-outline" onClick={closeQuickView}>
                        <i className="fas fa-times"></i> Close
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;