import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProject, setQuickViewProject] = useState(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [activeServiceCategory, setActiveServiceCategory] = useState('design');
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  // Professional hero images
  const heroImages = [
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    "https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
  ];

  const techHeroImages = [
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
  ];

  // Featured Portfolio Projects
  const featuredPortfolioProjects = [
    {
      id: 'featured-1',
      title: 'St. Martin Hospital',
      subtitle: '80th Anniversary',
      category: 'Brand Identity',
      description: 'Award-winning logo design celebrating heritage and future vision.',
      image: '80th.jpg',
      tags: ['Logo Design', 'Healthcare'],
      details: [
        'Winning competition design',
        'Heritage meets future concept',
        'Clean sans-serif typography',
      ],
      client: 'St. Martin De Porres Hospital',
      year: '2025'
    },
    {
      id: 'featured-2',
      title: 'Mr. Wise',
      subtitle: 'Clothing Brand',
      category: 'Brand Identity',
      description: 'Sophisticated fashion brand with "Exclusively Different" positioning.',
      image: 'mr-wise.jpg',
      tags: ['Fashion', 'Luxury'],
      details: [
        'Complete brand identity',
        'Premium positioning',
        'Brand guidelines',
      ],
      client: 'Mr. Wise Clothing',
      year: '2025'
    },
    {
      id: 'featured-3',
      title: 'Abidan Royal',
      subtitle: 'Mango Ice-Cream',
      category: 'Packaging',
      description: 'Product label design with clear ingredient listing.',
      image: 'mango-label.jpg',
      tags: ['Packaging', 'Food'],
      details: [
        'Regulatory compliance',
        'Professional retail appearance',
        'Clear ingredient display',
      ],
      client: 'Abidan Royal Enterprise',
      year: '2024'
    },
  ];

  // Valentine's Day Packages - New Section
  const valentinesPackages = [
    {
      id: 'valentine-express',
      name: 'Valentine Express',
      price: '₵199',
      description: 'Quick social media graphics for last-minute romance',
      icon: '💝',
      features: ['Instagram Story Set (5 designs)', 'Heart-themed Templates', 'Custom Text', '24-hr Delivery'],
      tags: ['Social Media', 'Quick Turnaround'],
      color: '#FF6B8B'
    },
    {
      id: 'valentine-premium',
      name: 'Valentine Premium',
      price: '₵299',
      description: 'Complete love-themed branding package',
      icon: '❤️',
      features: ['Custom Logo with Heart Motif', 'Matching Social Media Kit', 'Digital Invitation Design', 'Color Palette'],
      tags: ['Branding', 'Complete Package'],
      color: '#E63946',
      highlighted: true
    },
    {
      id: 'valentine-luxe',
      name: 'Valentine Luxe',
      price: '₵599',
      description: 'Ultimate romantic experience design',
      icon: '💖',
      features: ['Animated Greeting Card', 'Website Banner Set', 'Print-ready Materials', '3D Heart Illustrations'],
      tags: ['Animation', 'Print+Digital'],
      color: '#9D174D'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Auto-rotate hero images
    const interval = setInterval(() => {
      const activeImages = getActiveHeroImages();
      setCurrentImageIndex((prev) => (prev + 1) % activeImages.length);
    }, 4000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const getActiveHeroImages = () => {
    return activeServiceCategory === 'design' ? heroImages : techHeroImages;
  };

  const services = {
    design: [
      {
        id: 'branding',
        name: 'Brand Identity',
        price: '₵699+',
        description: 'Complete brand systems including logo, color, typography.',
        icon: '🎨',
        features: ['Logo Design', 'Brand Guidelines', 'Color Palette', 'Typography']
      },
      {
        id: 'uiux',
        name: 'UI/UX Design',
        price: '₵899+',
        description: 'User-centered interfaces for web and mobile.',
        icon: '📱',
        features: ['Wireframing', 'Prototyping', 'User Testing', 'Responsive']
      },
      {
        id: 'print',
        name: 'Print Design',
        price: '₵549+',
        description: 'Professional print materials and packaging.',
        icon: '🖨️',
        features: ['Business Cards', 'Packaging', 'Brochures', 'Posters']
      },
      {
        id: 'web',
        name: 'Web Design',
        price: '₵1,299+',
        description: 'Modern, responsive websites.',
        icon: '💻',
        features: ['Website Design', 'E-commerce', 'CMS', 'SEO']
      }
    ],
    tech: [
      {
        id: 'repair',
        name: 'Computer Repair',
        price: '₵50+/hr',
        description: 'Professional repair for all computer makes.',
        icon: '🔧',
        features: ['Hardware Diagnosis', 'Component Repair', 'System Tuning']
      },
      {
        id: 'setup',
        name: 'System Setup',
        price: '₵150+',
        description: 'Complete OS installation and configuration.',
        icon: '⚙️',
        features: ['Windows Setup', 'Driver Updates', 'Optimization']
      },
      {
        id: 'software',
        name: 'Software Support',
        price: '₵100+',
        description: 'Installation and configuration.',
        icon: '📦',
        features: ['Office Setup', 'Creative Software', 'Antivirus']
      },
      {
        id: 'network',
        name: 'Networking',
        price: '₵250+',
        description: 'Network setup and management.',
        icon: '📡',
        features: ['Wi-Fi Setup', 'Security', 'Troubleshooting']
      }
    ]
  };

  const packages = [
    {
      id: 'starter',
      name: 'Starter',
      price: '₵699',
      description: 'Perfect for new businesses',
      features: ['Logo Design', 'Business Cards', 'Social Media Kit', 'Brand Guide'],
      highlighted: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '₵1,499',
      description: 'Complete branding solution',
      features: ['Logo + Variations', 'Full Guidelines', 'Stationery Set', 'Social Content'],
      highlighted: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₵2,299',
      description: 'End-to-end solution',
      features: ['All Pro Features', 'Website Design', 'Marketing Materials', '3 Months Support'],
      highlighted: false
    }
  ];

  const handleServiceClick = (service) => {
    const serviceData = {
      name: service.name,
      category: service.id === 'branding' ? 'Brand Identity Design' : 
                service.id === 'uiux' ? 'UI/UX Design' :
                service.id === 'print' ? 'Print Design' :
                service.id === 'web' ? 'Web Design' :
                service.id === 'repair' ? 'Computer Repair & Maintenance' :
                service.id === 'setup' ? 'Windows Installation & Setup' :
                service.id === 'software' ? 'Software Installation & Support' :
                service.id === 'network' ? 'Networking Solutions' : 'General Service',
      price: service.price,
      timestamp: Date.now(),
      type: 'regular'
    };
    
    localStorage.removeItem('selectedService');
    localStorage.removeItem('selectedValentinePackage');
    localStorage.setItem('selectedService', JSON.stringify(serviceData));
    navigate('/contact');
  };

  // Add missing handleValentinePackageClick function
  const handleValentinePackageClick = (pkg) => {
    const serviceData = {
      name: pkg.name,
      category: 'Valentine\'s Day Design',
      price: pkg.price,
      features: pkg.features,
      icon: pkg.icon,
      color: pkg.color,
      timestamp: Date.now(),
      type: 'valentine'
    };
    
    localStorage.removeItem('selectedService');
    localStorage.removeItem('selectedValentinePackage');
    localStorage.setItem('selectedValentinePackage', JSON.stringify(serviceData));
    navigate('/contact');
  };

  // Valentine's Package Card Component
  const ValentinePackageCard = ({ pkg }) => (
    <div 
      className={`valentine-package-card ${pkg.highlighted ? 'highlighted' : ''}`}
      onClick={() => handleValentinePackageClick(pkg)}
      style={{ 
        '--valentine-color': pkg.color,
        animationDelay: `${valentinesPackages.indexOf(pkg) * 100}ms`
      }}
    >
      <div className="valentine-package-card-inner">
        <div className="valentine-package-header">
          <div className="valentine-package-icon-heart">
            <span className="heart-icon">{pkg.icon}</span>
            <div className="heart-pulse"></div>
          </div>
          <div className="valentine-package-price">{pkg.price}</div>
        </div>
        
        <h3 className="valentine-package-name">{pkg.name}</h3>
        <p className="valentine-package-description">{pkg.description}</p>
        
        <div className="valentine-package-tags">
          {pkg.tags.map((tag, idx) => (
            <span key={idx} className="valentine-package-tag">{tag}</span>
          ))}
        </div>
        
        <ul className="valentine-package-features">
          {pkg.features.map((feature, idx) => (
            <li key={idx}>
              <span className="valentine-feature-check">❤️</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <button className="valentine-package-cta">
          <span>Choose This Package</span>
          <span className="valentine-cta-arrow">💘</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="homepage">
      {/* Service Toggle */}
      <div className={`service-toggle ${isScrolled ? 'scrolled' : ''}`}>
        <div className="toggle-container">
          <button
            className={`toggle-btn ${activeServiceCategory === 'design' ? 'active' : ''}`}
            onClick={() => setActiveServiceCategory('design')}
          >
            <span className="toggle-icon">🎨</span>
            <span className="toggle-text">Design Services</span>
          </button>
          <button
            className={`toggle-btn ${activeServiceCategory === 'tech' ? 'active' : ''}`}
            onClick={() => setActiveServiceCategory('tech')}
          >
            <span className="toggle-icon">🔧</span>
            <span className="toggle-text">Tech Services</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          {getActiveHeroImages().map((img, index) => (
            <div
              key={index}
              className={`hero-bg-slide ${index === currentImageIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">Professional Services</span>
          </div>
          
          <h1 className="hero-title">
            {activeServiceCategory === 'design' ? (
              <>
                Exceptional <span className="gradient-text">Design</span>
                <br />
                That Drives Results
              </>
            ) : (
              <>
                Reliable <span className="gradient-text">Tech</span>
                <br />
                Support & Solutions
              </>
            )}
          </h1>
          
          <p className="hero-subtitle">
            {activeServiceCategory === 'design'
              ? 'We create stunning visual identities that elevate brands and captivate audiences.'
              : 'Professional IT solutions to keep your systems running smoothly and efficiently.'}
          </p>
          
          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (activeServiceCategory === 'design') {
                  setShowPackageModal(true);
                } else {
                  navigate('/services');
                }
              }}
            >
              <span className="btn-icon">
                {activeServiceCategory === 'design' ? '🎨' : '🔧'}
              </span>
              <span>
                {activeServiceCategory === 'design' ? 'View Packages' : 'Explore Services'}
              </span>
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/contact')}>
              <span>Get Started</span>
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">150+</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="divider"></div>
            <div className="stat">
              <div className="stat-value">98%</div>
              <div className="stat-label">Satisfaction</div>
            </div>
            <div className="divider"></div>
            <div className="stat">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <div className="scroll-line"></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Valentine's Day Section - Added Here */}
      <section className="valentines-section">
        <div className="container">
          <div className="section-header">
            <div className="valentines-header-decoration">
              <span className="floating-heart">💖</span>
              <h2 className="section-title">Valentine's Day Design Packages</h2>
              <span className="floating-heart">💝</span>
            </div>
            <p className="section-subtitle">
              Perfect designs to express your love — Limited time offer!
            </p>
          </div>

          <div className="valentines-grid">
            {valentinesPackages.map((pkg) => (
              <ValentinePackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          {/* Apple-style Unit Links for Additional Valentine's Services */}
          <div className="unit-links-section">
            <h3 className="unit-links-title">More Valentine's Services</h3>
            <div className="unit-links-grid">
              <div 
                className="unit-link"
                onClick={() => handleValentinePackageClick(valentinesPackages[0])}
              >
                <div className="unit-link-content">
                  <h4 className="unit-link-title">Custom Love Letters</h4>
                  <p className="unit-link-description">Beautifully designed digital love letters</p>
                </div>
                <span className="unit-link-arrow">→</span>
              </div>
              
              <div 
                className="unit-link"
                onClick={() => handleValentinePackageClick(valentinesPackages[1])}
              >
                <div className="unit-link-content">
                  <h4 className="unit-link-title">Date Night Invitations</h4>
                  <p className="unit-link-description">Create memorable invitation designs</p>
                </div>
                <span className="unit-link-arrow">→</span>
              </div>
              
              <div 
                className="unit-link"
                onClick={() => handleValentinePackageClick(valentinesPackages[2])}
              >
                <div className="unit-link-content">
                  <h4 className="unit-link-title">Couple Photo Editing</h4>
                  <p className="unit-link-description">Romantic touch-ups for your photos</p>
                </div>
                <span className="unit-link-arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {activeServiceCategory === 'design' ? 'Design Services' : 'Tech Services'}
            </h2>
            <p className="section-subtitle">
              Professional solutions tailored to your needs
            </p>
          </div>

          <div className="services-grid">
            {services[activeServiceCategory].map((service, index) => (
              <div
                key={service.id}
                className="service-card"
                onClick={() => handleServiceClick(service)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="service-card-inner">
                  <div className="service-header">
                    <div className="service-icon">{service.icon}</div>
                    <div className="service-price">{service.price}</div>
                  </div>
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  <ul className="service-features">
                    {service.features.map((feature, idx) => (
                      <li key={idx}>
                        <span className="feature-check">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="service-cta">
                    <span>Select Service</span>
                    <span className="cta-arrow">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work (Design only) */}
      {activeServiceCategory === 'design' && (
        <section className="portfolio-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Work</h2>
              <p className="section-subtitle">
                Explore our portfolio of successful design projects
              </p>
            </div>

            <div className="portfolio-grid">
              {featuredPortfolioProjects.map((project) => (
                <div
                  key={project.id}
                  className="portfolio-card"
                  onClick={() => {
                    setQuickViewProject(project);
                    setShowQuickView(true);
                  }}
                >
                  <div className="portfolio-image">
                    <img src={project.image} alt={project.title} />
                    <div className="portfolio-overlay">
                      <button className="view-project-btn">
                        <span>View Project</span>
                        <span className="btn-arrow">→</span>
                      </button>
                    </div>
                  </div>
                  <div className="portfolio-info">
                    <div className="portfolio-meta">
                      <span className="portfolio-category">{project.category}</span>
                      <span className="portfolio-year">{project.year}</span>
                    </div>
                    <h3 className="portfolio-title">{project.title}</h3>
                    <p className="portfolio-subtitle">{project.subtitle}</p>
                    <div className="portfolio-tags">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="portfolio-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Packages Modal */}
      {showPackageModal && (
        <div className="modal-overlay" onClick={() => setShowPackageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPackageModal(false)}>
              ×
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Design Packages</h2>
              <p className="modal-subtitle">Choose the perfect package for your needs</p>
            </div>

            <div className="packages-grid">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`package-card ${pkg.highlighted ? 'highlighted' : ''} ${selectedPackage === pkg.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.highlighted && (
                    <div className="package-badge">Most Popular</div>
                  )}
                  <div className="package-header">
                    <h3 className="package-name">{pkg.name}</h3>
                    <div className="package-price">
                      <span className="price-value">{pkg.price}</span>
                    </div>
                  </div>
                  <p className="package-description">{pkg.description}</p>
                  <ul className="package-features">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx}>
                        <span className="feature-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`package-select-btn ${selectedPackage === pkg.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {selectedPackage === pkg.id ? 'Selected ✓' : 'Select Package'}
                  </button>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary btn-large"
                onClick={() => {
                  const selected = packages.find(p => p.id === selectedPackage);
                  handleServiceClick(selected);
                  setShowPackageModal(false);
                }}
              >
                <span>Get Started with {selectedPackage}</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {showQuickView && quickViewProject && (
        <div className="modal-overlay" onClick={() => setShowQuickView(false)}>
          <div className="modal-content quickview" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowQuickView(false)}>
              ×
            </button>
            
            <div className="quickview-grid">
              <div className="quickview-image">
                <img src={quickViewProject.image} alt={quickViewProject.title} />
              </div>
              <div className="quickview-info">
                <div className="quickview-header">
                  <div className="quickview-meta">
                    <span className="meta-category">{quickViewProject.category}</span>
                    <span className="meta-year">{quickViewProject.year}</span>
                  </div>
                  <h2 className="quickview-title">{quickViewProject.title}</h2>
                  <p className="quickview-subtitle">{quickViewProject.subtitle}</p>
                  <div className="quickview-client">
                    <span className="client-label">Client:</span>
                    <span className="client-name">{quickViewProject.client}</span>
                  </div>
                </div>
                
                <div className="quickview-content">
                  <h3>Project Overview</h3>
                  <p>{quickViewProject.description}</p>
                  
                  <h3>Key Features</h3>
                  <ul className="quickview-features">
                    {quickViewProject.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="quickview-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setShowQuickView(false);
                      setShowPackageModal(true);
                    }}
                  >
                    <span>Start Similar Project</span>
                    <span className="btn-arrow">→</span>
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/portfolio')}
                  >
                    View Full Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Transform Your{' '}
              {activeServiceCategory === 'design' ? 'Brand' : 'Business'}?
            </h2>
            <p className="cta-subtitle">
              Let's create something amazing together. Get in touch to discuss your project.
            </p>
            <div className="cta-actions">
              <button
                className="btn btn-primary btn-large"
                onClick={() => navigate('/contact')}
              >
                <span>Start Your Project</span>
                <span className="btn-arrow">→</span>
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/portfolio')}
              >
                View Our Work
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;