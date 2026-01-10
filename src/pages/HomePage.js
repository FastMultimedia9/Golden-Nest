import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProject, setQuickViewProject] = useState(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [activeServiceCategory, setActiveServiceCategory] = useState('design'); // 'design' or 'tech'
  const navigate = useNavigate();
  
  // Professional hero images for Graphic Design
  const heroImages = [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ];

  // Tech Support hero images
  const techHeroImages = [
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ];

  // Get active hero images based on category
  const getActiveHeroImages = () => {
    return activeServiceCategory === 'design' ? heroImages : techHeroImages;
  };

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
      const activeImages = getActiveHeroImages();
      setCurrentImageIndex((prevIndex) => 
        prevIndex === activeImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [activeServiceCategory]);

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

  const handlePackageSelect = (packageType) => {
    setSelectedPackage(packageType);
  };

  const handlePackageOrder = () => {
    const selectedPackageDetails = designPackages.find(pkg => pkg.id === selectedPackage);
    navigate(`/contact?package=${selectedPackage}&project=Design%20Package&type=${encodeURIComponent(selectedPackageDetails.name)}`);
    closePackageModal();
  };

  // Design Services from your services page
  const designServices = [
    {
      id: 'brand-identity',
      name: 'Brand Identity Design',
      price: '₵699',
      description: 'Complete brand identity packages including logo design, color palette, typography, and brand guidelines.',
      features: ['Logo Design', 'Brand Guidelines', 'Business Cards', 'Stationery Design'],
      icon: 'fas fa-palette'
    },
    {
      id: 'ui-ux',
      name: 'UI/UX Design',
      price: '₵899',
      description: 'User-centered design for websites and applications focusing on usability and engagement.',
      features: ['Wireframing', 'Prototyping', 'User Testing', 'Responsive Design'],
      icon: 'fas fa-mobile-alt'
    },
    {
      id: 'print-packaging',
      name: 'Print & Packaging',
      price: '₵549',
      description: 'Professional print materials and packaging designs that stand out on shelves.',
      features: ['Brochures & Flyers', 'Product Packaging', 'Business Cards', 'Posters & Banners'],
      icon: 'fas fa-print'
    },
    {
      id: 'social-media',
      name: 'Social Media Graphics',
      price: '₵399',
      description: 'Eye-catching social media content that drives engagement and conversions.',
      features: ['Social Media Posts', 'Ad Creatives', 'Profile Branding', 'Content Templates'],
      icon: 'fas fa-share-alt'
    },
    {
      id: 'website-design',
      name: 'Website Design & Development',
      price: '₵1,299',
      description: 'Modern, responsive websites that convert visitors into customers.',
      features: ['Website Design', 'E-commerce Solutions', 'CMS Integration', 'SEO Optimization'],
      icon: 'fas fa-code'
    },
    {
      id: 'motion-graphics',
      name: 'Motion Graphics',
      price: '₵799',
      description: 'Animated videos and graphics for social media, presentations, and marketing.',
      features: ['Animated Logos', 'Explainer Videos', 'Social Media Ads', 'Presentation Graphics'],
      icon: 'fas fa-film'
    }
  ];

  // Tech Support Services from your services page
  const techServices = [
    {
      id: 'computer-repair',
      name: 'Computer Repair & Maintenance',
      price: '₵50/hour',
      description: 'Professional repair services for all computer makes and models.',
      features: ['Hardware Diagnosis', 'Component Replacement', 'System Cleaning', 'Performance Tuning'],
      icon: 'fas fa-tools'
    },
    {
      id: 'windows-setup',
      name: 'Windows Installation & Setup',
      price: '₵150',
      description: 'Complete Windows OS installation, configuration, and optimization.',
      features: ['Windows 10/11 Installation', 'Driver Updates', 'System Optimization', 'Data Migration'],
      icon: 'fab fa-windows'
    },
    {
      id: 'software-support',
      name: 'Software Installation & Support',
      price: '₵100',
      description: 'Installation and configuration of all types of software applications.',
      features: ['Office Suite Setup', 'Creative Software', 'Antivirus Installation', 'Troubleshooting'],
      icon: 'fas fa-download'
    },
    {
      id: 'new-computer-setup',
      name: 'New Computer Setup',
      price: '₵200',
      description: 'Complete setup and configuration of new computer systems.',
      features: ['Initial Setup', 'Software Installation', 'Data Transfer', 'System Optimization'],
      icon: 'fas fa-laptop'
    },
    {
      id: 'networking',
      name: 'Networking Solutions',
      price: '₵250',
      description: 'Setup and management of wired and wireless networks for businesses and homes.',
      features: ['Wi-Fi Setup', 'Network Security', 'Router Configuration', 'Troubleshooting'],
      icon: 'fas fa-wifi'
    },
    {
      id: 'system-management',
      name: 'Computer System Management',
      price: '₵300/month',
      description: 'Ongoing maintenance and management of computer systems for optimal performance.',
      features: ['System Monitoring', 'Regular Updates', 'Backup Solutions', 'Security Management'],
      icon: 'fas fa-server'
    }
  ];

  // Design Packages from your services page
  const designPackages = [
    {
      id: 'basic',
      name: 'Starter Package',
      price: '₵699',
      originalPrice: '₵848',
      discount: 'Save ₵149',
      features: [
        'Logo Design',
        'Business Cards',
        'Social Media Profile Kit',
        'Basic Brand Guidelines'
      ],
      description: 'Perfect for new businesses needing basic brand identity'
    },
    {
      id: 'pro',
      name: 'Professional Package',
      price: '₵1,499',
      originalPrice: '₵1,898',
      discount: 'Save ₵399',
      features: [
        'Logo Design + Variations',
        'Complete Brand Guidelines',
        'Business Stationery Set',
        'Social Media Content Kit',
        'Email Signature Design'
      ],
      description: 'Complete branding solution for growing businesses'
    },
    {
      id: 'website',
      name: 'Website Package',
      price: '₵1,299',
      originalPrice: '₵1,548',
      discount: 'Save ₵249',
      features: [
        '5-Page Responsive Website',
        'Mobile-First Design',
        'SEO Optimization',
        'Contact Form Setup',
        'Social Media Integration'
      ],
      description: 'Professional website design and development'
    }
  ];

  // Portfolio Projects
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
    }
  ];

  const [selectedPackage, setSelectedPackage] = useState('basic');

  return (
    <div className="homepage">
      {/* Service Category Selector */}
      <div className="service-category-selector">
        <button 
          className={`category-btn ${activeServiceCategory === 'design' ? 'active' : ''}`}
          onClick={() => setActiveServiceCategory('design')}
        >
          <i className="fas fa-paint-brush"></i> Graphic Design Services
        </button>
        <button 
          className={`category-btn ${activeServiceCategory === 'tech' ? 'active' : ''}`}
          onClick={() => setActiveServiceCategory('tech')}
        >
          <i className="fas fa-tools"></i> Technical Support Services
        </button>
      </div>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content animate-on-scroll">
          <div className="hero-badge">
            <div className="badge-dot"></div>
            <span className="badge-text">
              {activeServiceCategory === 'design' ? 'Creative Design' : 'Professional Tech Support'}
            </span>
          </div>
          <h1 className="hero-title">
            {activeServiceCategory === 'design' ? (
              <>
                Create <span className="highlight">Modern</span> & 
                <span className="highlight"> Impactful</span> Designs
              </>
            ) : (
              <>
                Reliable <span className="highlight">Tech Support</span> & 
                <span className="highlight"> IT Solutions</span>
              </>
            )}
          </h1>
          <p className="hero-subtitle">
            {activeServiceCategory === 'design' 
              ? "Professional design services that help your brand stand out. From logos to complete brand systems, we create designs that communicate your vision effectively."
              : "Professional technical support services to keep your systems running smoothly. From computer repair to network solutions, we provide reliable IT support for businesses and individuals."
            }
          </p>
          
          <div className="hero-buttons">
            {activeServiceCategory === 'design' ? (
              <>
                <button className="btn btn-primary" onClick={openPackageModal}>
                  <i className="fas fa-palette"></i> View Design Packages
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/portfolio')}>
                  <i className="fas fa-eye"></i> View Portfolio
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/services')}>
                  <i className="fas fa-tools"></i> View All Tech Services
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/contact')}>
                  <i className="fas fa-headset"></i> Request Support
                </button>
              </>
            )}
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <h3 className="stat-number">
                {activeServiceCategory === 'design' ? '150+' : '500+'}
              </h3>
              <p className="stat-label">
                Projects Completed
              </p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">98%</h3>
              <p className="stat-label">Client Satisfaction</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">
                {activeServiceCategory === 'design' ? '48hr' : '24/7'}
              </h3>
              <p className="stat-label">
                {activeServiceCategory === 'design' ? 'Average Delivery' : 'Tech Support'}
              </p>
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
            <div className="hero-image-carousel">
              {getActiveHeroImages().map((image, index) => (
                <div 
                  key={index}
                  className={`hero-image-slide ${index === currentImageIndex ? 'active' : ''}`}
                >
                  <img 
                    src={image} 
                    alt={activeServiceCategory === 'design' 
                      ? `Professional Design ${index + 1}`
                      : `Tech Support ${index + 1}`
                    }
                  />
                </div>
              ))}
            </div>
            <div className="carousel-dots">
              {getActiveHeroImages().map((_, index) => (
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

      {/* Services Section */}
      <section id="services" className="services-section section">
        <div className="section-header animate-on-scroll">
          <h2 className="section-title">
            {activeServiceCategory === 'design' ? 'Design Services' : 'Technical Support Services'}
          </h2>
          <p className="section-subtitle">
            {activeServiceCategory === 'design' 
              ? 'Creative design solutions that make your brand stand out'
              : 'Reliable tech solutions to keep your systems running efficiently'
            }
          </p>
          <div className="selection-hint">
            <i className="fas fa-mouse-pointer"></i>
            <span>Click any service to automatically add it to your contact request</span>
          </div>
        </div>
        
        {activeServiceCategory === 'design' ? (
          <div className="services-grid">
            {designServices.map((service, index) => (
              <div 
                key={service.id} 
                className="service-card animate-on-scroll"
                onClick={() => navigate(`/contact?service=${service.id}&type=${encodeURIComponent(service.name)}`)}
              >
                <div className="service-header">
                  <div className="service-icon">
                    <i className={service.icon}></i>
                  </div>
                  <div className="service-price-badge">{service.price}</div>
                </div>
                <h3 className="service-title">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}><i className="fas fa-check"></i> {feature}</li>
                  ))}
                </ul>
                <div className="service-action">
                  <button className="btn-service-select">
                    <i className="fas fa-plus-circle"></i>
                    <span>Select Service</span>
                  </button>
                  <div className="service-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="services-grid">
            {techServices.map((service, index) => (
              <div 
                key={service.id} 
                className="service-card animate-on-scroll"
                onClick={() => navigate(`/contact?service=${service.id}&type=${encodeURIComponent(service.name)}`)}
              >
                <div className="service-header">
                  <div className="service-icon">
                    <i className={service.icon}></i>
                  </div>
                  <div className="service-price-badge">{service.price}</div>
                </div>
                <h3 className="service-title">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}><i className="fas fa-check"></i> {feature}</li>
                  ))}
                </ul>
                <div className="service-action">
                  <button className="btn-service-select">
                    <i className="fas fa-plus-circle"></i>
                    <span>Select Service</span>
                  </button>
                  <div className="service-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="section-cta animate-on-scroll">
          <button className="btn btn-primary" onClick={() => navigate('/services')}>
            <i className="fas fa-list-alt"></i> View All Services
          </button>
        </div>
      </section>

      {/* Only show portfolio for design category */}
      {activeServiceCategory === 'design' && (
        <>
          {/* Portfolio Preview */}
          <section className="portfolio-preview section">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Featured Work</h2>
              <p className="section-subtitle">
                Explore our portfolio of successful design projects across various industries
              </p>
            </div>
            
            <div className="portfolio-grid">
              {portfolioProjects.map((project) => (
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
                          <button className="btn btn-small btn-outline-light" onClick={() => navigate('/portfolio')}>
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
              <button className="btn btn-primary" onClick={() => navigate('/portfolio')}>
                <i className="fas fa-images"></i> View Full Portfolio
              </button>
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
                  <p className="modal-subtitle">Get more value with our bundled packages</p>
                  <div className="selection-hint">
                    <i className="fas fa-mouse-pointer"></i>
                    <span>Click any package to automatically add it to your contact request</span>
                  </div>
                </div>
                
                <div className="packages-grid">
                  {designPackages.map((pkg) => (
                    <div 
                      key={pkg.id} 
                      className={`package-card ${selectedPackage === pkg.id ? 'selected' : ''}`}
                      onClick={() => handlePackageSelect(pkg.id)}
                    >
                      {pkg.discount && (
                        <div className="package-discount">
                          <span className="discount-badge">{pkg.discount}</span>
                        </div>
                      )}
                      <div className="package-header">
                        <h3 className="package-name">{pkg.name}</h3>
                        <div className="package-price">
                          {pkg.originalPrice && (
                            <span className="original-price">{pkg.originalPrice}</span>
                          )}
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
                  <p className="modal-note">Selected package will be added to your contact request</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* For Tech category, show tech packages/bundles */}
      {activeServiceCategory === 'tech' && (
        <section className="tech-packages section">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Tech Support Plans</h2>
            <p className="section-subtitle">
              Choose the right support plan for your needs
            </p>
          </div>
          
          <div className="packages-grid">
            <div className="tech-package-card animate-on-scroll">
              <div className="package-header">
                <h3 className="package-name">Basic Support</h3>
                <div className="package-price">
                  <span className="current-price">₵50/hour</span>
                </div>
              </div>
              <p className="package-description">Pay-as-you-go tech support for immediate issues</p>
              <ul className="package-features">
                <li><i className="fas fa-check"></i> Computer Diagnosis</li>
                <li><i className="fas fa-check"></i> Software Installation</li>
                <li><i className="fas fa-check"></i> Virus Removal</li>
                <li><i className="fas fa-check"></i> Basic Troubleshooting</li>
              </ul>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/contact?service=computer-repair&type=Basic%20Support')}
              >
                <i className="fas fa-wrench"></i> Request Service
              </button>
            </div>
            
            <div className="tech-package-card animate-on-scroll popular">
              <div className="popular-badge">Most Popular</div>
              <div className="package-header">
                <h3 className="package-name">System Setup Package</h3>
                <div className="package-price">
                  <span className="current-price">₵450</span>
                </div>
              </div>
              <p className="package-description">Complete computer setup and optimization</p>
              <ul className="package-features">
                <li><i className="fas fa-check"></i> New Computer Setup (₵200)</li>
                <li><i className="fas fa-check"></i> Windows Installation (₵150)</li>
                <li><i className="fas fa-check"></i> Software Installation (₵100)</li>
                <li><i className="fas fa-check"></i> Data Migration Service</li>
              </ul>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/contact?service=system-setup-package&type=System%20Setup%20Package')}
              >
                <i className="fas fa-laptop"></i> Get Package
              </button>
            </div>
            
            <div className="tech-package-card animate-on-scroll">
              <div className="package-header">
                <h3 className="package-name">Monthly Management</h3>
                <div className="package-price">
                  <span className="current-price">₵300/month</span>
                </div>
              </div>
              <p className="package-description">Ongoing system maintenance and support</p>
              <ul className="package-features">
                <li><i className="fas fa-check"></i> System Monitoring</li>
                <li><i className="fas fa-check"></i> Regular Updates</li>
                <li><i className="fas fa-check"></i> Backup Solutions</li>
                <li><i className="fas fa-check"></i> Security Management</li>
              </ul>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/contact?service=system-management&type=Monthly%20Management')}
              >
                <i className="fas fa-server"></i> Subscribe Now
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="why-choose-section section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Why Choose Fast Multimedia</h2>
            <p className="section-subtitle">
              We combine creative design expertise with technical excellence
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <h3 className="feature-title">Fast Turnaround</h3>
              <p className="feature-description">
                We deliver projects on time without compromising on quality.
              </p>
            </div>
            
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-description">
                Round-the-clock technical support for all your needs.
              </p>
            </div>
            
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 className="feature-title">Quality Guarantee</h3>
              <p className="feature-description">
                We stand behind our work with a satisfaction guarantee.
              </p>
            </div>
            
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="feature-title">Expert Team</h3>
              <p className="feature-description">
                Skilled professionals in both design and technology.
              </p>
            </div>
            
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h3 className="feature-title">Modern Tools</h3>
              <p className="feature-description">
                Using the latest software and technology for best results.
              </p>
            </div>
            
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3 className="feature-title">Personalized Service</h3>
              <p className="feature-description">
                Tailored solutions to meet your specific business needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container animate-on-scroll">
          <div className="cta-content">
            <h2 className="cta-title">
              {activeServiceCategory === 'design' 
                ? 'Ready to Transform Your Brand?'
                : 'Need Professional Tech Support?'
              }
            </h2>
            <p className="cta-text">
              {activeServiceCategory === 'design'
                ? "Let's work together to create designs that not only look great but also drive results for your business. Schedule a free consultation to discuss your project."
                : "Get reliable technical support to keep your systems running smoothly. Schedule a service call or get a quote for your IT needs."
              }
            </p>
            <div className="cta-buttons">
              <button 
                className="btn btn-light" 
                onClick={() => navigate('/contact')}
              >
                <i className="fas fa-calendar"></i> {activeServiceCategory === 'design' ? 'Book Consultation' : 'Schedule Service'}
              </button>
              {activeServiceCategory === 'design' && (
                <button className="btn btn-outline-light" onClick={() => navigate('/portfolio')}>
                  <i className="fas fa-images"></i> View Work
                </button>
              )}
              {activeServiceCategory === 'tech' && (
                <button className="btn btn-outline-light" onClick={() => navigate('/services')}>
                  <i className="fas fa-tools"></i> View All Services
                </button>
              )}
            </div>
          </div>
          <div className="cta-visual">
            <div className="cta-image">
              <img 
                src={activeServiceCategory === 'design' 
                  ? "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  : "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                } 
                alt={activeServiceCategory === 'design' ? "Design Collaboration" : "Tech Support"}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal (only for design) */}
      {showQuickView && activeServiceCategory === 'design' && (
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