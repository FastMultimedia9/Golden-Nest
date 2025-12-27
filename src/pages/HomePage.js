import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProject, setQuickViewProject] = useState(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const navigate = useNavigate();
  
  // Professional hero images
  const heroImages = [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  ];

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
    const selectedPackageDetails = designPackages.find(pkg => pkg.id === selectedPackage);
    
    // Navigate to contact page with package details in query params
    navigate(`/contact?package=${selectedPackage}&project=Design%20Package&type=${encodeURIComponent(selectedPackageDetails.name)}`);
    
    closePackageModal();
  };

  // Design Packages
  const designPackages = [
    {
      id: 'basic',
      name: 'Starter Package',
      price: '$499',
      features: [
        'Logo Design',
        'Brand Color Palette',
        '3 Social Media Templates',
        'Email Newsletter Design',
        '1 Round of Revisions'
      ],
      description: 'Perfect for new businesses starting their brand journey'
    },
    {
      id: 'pro',
      name: 'Professional Package',
      price: '$899',
      features: [
        'Everything in Starter Package',
        'Complete Social Media Kit (15 templates)',
        'Website Banner Design',
        'Email Campaign Design',
        'Product Mockups',
        '3 Rounds of Revisions',
        'Priority Support'
      ],
      description: 'Ideal for established businesses building their brand presence'
    },
    {
      id: 'premium',
      name: 'Premium Package',
      price: '$1499',
      features: [
        'Everything in Professional Package',
        'Complete Brand Guidelines',
        'Print Materials Design',
        'Animated Social Media Posts',
        'Marketing Collateral',
        'Unlimited Revisions',
        'Dedicated Designer',
        'Stock Photos Library Access'
      ],
      description: 'Complete branding solution for comprehensive campaigns'
    }
  ];

  // Portfolio Projects for Modal
  const portfolioProjects = [
    {
      id: 'project1',
      title: "Modern Tech Branding",
      category: "Brand Identity",
      description: "Complete branding for tech startup including modern logo, color palette, and comprehensive brand guidelines.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      tags: ["Logo Design", "Brand Guide", "Typography"],
      details: [
        "Modern logo with clean typography",
        "Professional color palette",
        "Typography system",
        "Brand guidelines",
        "Social media templates"
      ]
    },
    {
      id: 'project2',
      title: "E-commerce Packaging",
      category: "Product Packaging",
      description: "Modern packaging designs for e-commerce product line including custom boxes and labels.",
      image: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      tags: ["Product Box", "Labels", "Unboxing"],
      details: [
        "Custom box designs",
        "Product labels",
        "Unboxing experience",
        "Brand consistency",
        "Packaging system"
      ]
    },
    {
      id: 'project3',
      title: "Digital Marketing Campaign",
      category: "Marketing Design",
      description: "Complete digital marketing campaign with social media graphics and advertising designs.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      tags: ["Social Media", "Email", "Digital Ads"],
      details: [
        "Social media graphics",
        "Email campaign design",
        "Digital banner ads",
        "Marketing strategy",
        "Campaign assets"
      ]
    },
    {
      id: 'project4',
      title: "Corporate Website Redesign",
      category: "Web Design",
      description: "Complete website redesign with modern UI/UX and responsive design implementation.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      tags: ["Web Design", "UI/UX", "Responsive"],
      details: [
        "Modern UI design",
        "User experience optimization",
        "Mobile-responsive design",
        "Performance optimization",
        "Content management"
      ]
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content animate-on-scroll">
          <div className="hero-badge">
           
            <div className="badge-dot"></div>
          </div>
          <h1 className="hero-title">
            Create <span className="highlight">Modern</span> & 
            <span className="highlight"> Impactful</span> Designs
          </h1>
          <p className="hero-subtitle">
            Professional design services that help your brand stand out. From logos to complete brand systems, 
            we create designs that communicate your vision effectively.
          </p>
          
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={openPackageModal}>
              <i className="fas fa-palette"></i> View Design Packages
            </button>
            <button className="btn btn-secondary" onClick={openPortfolioModal}>
              <i className="fas fa-eye"></i> View Portfolio
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <h3 className="stat-number">150+</h3>
              <p className="stat-label">Projects Completed</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">98%</h3>
              <p className="stat-label">Client Satisfaction</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">48hr</h3>
              <p className="stat-label">Average Delivery</p>
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
            <div className="hero-image-carousel">
              {heroImages.map((image, index) => (
                <div 
                  key={index}
                  className={`hero-image-slide ${index === currentImageIndex ? 'active' : ''}`}
                >
                  <img 
                    src={image} 
                    alt={`Professional Design ${index + 1}`}
                  />
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

      {/* Design Package Modal */}
      {showPackageModal && (
        <div className="design-package-modal">
          <div className="modal-overlay" onClick={closePackageModal}></div>
          <div className="modal-content package-modal">
            <button className="modal-close" onClick={closePackageModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Design Packages</h2>
              <p className="modal-subtitle">Choose the perfect package for your project</p>
            </div>
            
            <div className="packages-grid">
              {designPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className={`package-card ${selectedPackage === pkg.id ? 'selected' : ''}`}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  <div className="package-header">
                    <h3 className="package-name">{pkg.name}</h3>
                    <div className="package-price">
                      <span className="current-price">{pkg.price}</span>
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
              <button className="btn btn-primary" onClick={handlePackageOrder}>
                <i className="fas fa-shopping-cart"></i> Get Started
              </button>
              <p className="modal-note">All packages include free consultation</p>
            </div>
          </div>
        </div>
      )}

      {/* Services Section */}
      <section id="services" className="services-section section">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">Design Services</h2>
          <p className="section-subtitle">
            Comprehensive design solutions tailored to your business needs
          </p>
        </div>
        
        <div className="services-grid">
          <div className="service-card animate-on-scroll">
            <div className="service-header">
              <div className="service-icon">
                <i className="fas fa-paint-brush"></i>
              </div>
              <div className="service-profile">
                <div className="profile-icons">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-brush"></i>
                  <i className="fas fa-font"></i>
                  <i className="fas fa-palette"></i>
                </div>
              </div>
            </div>
            <h3 className="service-title">Brand Identity</h3>
            <p className="service-description">
              Create a memorable brand identity that communicates your values and resonates with your audience.
            </p>
            <ul className="service-features">
              <li>Logo Design</li>
              <li>Color Palette</li>
              <li>Typography System</li>
              <li>Brand Guidelines</li>
            </ul>
          </div>
          
          <div className="service-card animate-on-scroll">
            <div className="service-header">
              <div className="service-icon">
                <i className="fas fa-bullhorn"></i>
              </div>
              <div className="service-profile">
                <div className="profile-icons">
                  <i className="fas fa-share-alt"></i>
                  <i className="fas fa-envelope"></i>
                  <i className="fas fa-ad"></i>
                  <i className="fas fa-chart-line"></i>
                </div>
              </div>
            </div>
            <h3 className="service-title">Digital Marketing</h3>
            <p className="service-description">
              Engaging digital marketing materials that drive results and connect with your target audience.
            </p>
            <ul className="service-features">
              <li>Social Media Graphics</li>
              <li>Email Campaigns</li>
              <li>Web Banners</li>
              <li>Ad Designs</li>
            </ul>
          </div>
          
          <div className="service-card animate-on-scroll">
            <div className="service-header">
              <div className="service-icon">
                <i className="fas fa-box"></i>
              </div>
              <div className="service-profile">
                <div className="profile-icons">
                  <i className="fas fa-tag"></i>
                  <i className="fas fa-shipping-fast"></i>
                  <i className="fas fa-gift"></i>
                  <i className="fas fa-qrcode"></i>
                </div>
              </div>
            </div>
            <h3 className="service-title">Product Packaging</h3>
            <p className="service-description">
              Eye-catching product packaging designs that enhance unboxing experience and brand recognition.
            </p>
            <ul className="service-features">
              <li>Box Design</li>
              <li>Product Labels</li>
              <li>Packaging System</li>
              <li>Retail Ready</li>
            </ul>
          </div>
        </div>
        
        <div className="section-cta">
          <button className="btn btn-outline" onClick={openPackageModal}>
            <i className="fas fa-comment"></i> Get Custom Quote
          </button>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="portfolio-preview section">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">Featured Work</h2>
          <p className="section-subtitle">
            Explore our portfolio of successful design projects across various industries
          </p>
        </div>
        
        <div className="portfolio-grid">
          {portfolioProjects.slice(0, 3).map((project) => (
            <div key={project.id} className="portfolio-item animate-on-scroll">
              <div className="portfolio-image">
                <img src={project.image} alt={project.title} />
                <div className="portfolio-overlay">
                  <div className="overlay-content">
                    <h4>{project.title}</h4>
                    <p>{project.description.substring(0, 80)}...</p>
                    <div className="portfolio-actions">
                      <button className="btn btn-small quick-view-btn" 
                        onClick={() => openQuickView(project.id)}>
                        <i className="fas fa-eye"></i> Quick View
                      </button>
                      <button className="btn btn-small btn-outline-light" onClick={openPortfolioModal}>
                        <i className="fas fa-external-link-alt"></i> Case Study
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
          <button className="btn btn-primary" onClick={openPortfolioModal}>
            <i className="fas fa-images"></i> View Full Portfolio
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container animate-on-scroll">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Brand?</h2>
            <p className="cta-text">
              Let's work together to create designs that not only look great but also drive results for your business.
              Schedule a free consultation to discuss your project.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-light" onClick={openPackageModal}>
                <i className="fas fa-calendar"></i> Book Consultation
              </button>
              <button className="btn btn-outline-light" onClick={openPortfolioModal}>
                <i className="fas fa-images"></i> View Work
              </button>
            </div>
          </div>
          <div className="cta-visual">
            <div className="cta-image">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Design Collaboration"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Modal */}
      {showPortfolioModal && (
        <div className="portfolio-modal-overlay">
          <div className="modal-overlay" onClick={closePortfolioModal}></div>
          <div className="modal-content portfolio-modal">
            <button className="modal-close" onClick={closePortfolioModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Portfolio Gallery</h2>
              <p className="modal-subtitle">Explore our completed design projects</p>
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
                      className="btn btn-small"
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
              <button className="btn btn-primary" onClick={openPackageModal}>
                <i className="fas fa-pencil-alt"></i> Start Your Project
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
                      <span className="quickview-date">Recent Project</span>
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
                        <i className="fas fa-pencil-alt"></i> Start Similar Project
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