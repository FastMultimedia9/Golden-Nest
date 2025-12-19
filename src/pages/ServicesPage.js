import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';

const ServicesPage = () => {
  const navigate = useNavigate();

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

  const handleServiceClick = (serviceName, category, price = null) => {
    // Store service data in localStorage to persist between pages
    const serviceData = {
      name: serviceName,
      category: category,
      price: price,
      timestamp: Date.now()
    };
    
    localStorage.setItem('selectedService', JSON.stringify(serviceData));
    
    // Navigate to contact page with service data as URL parameters
    const params = new URLSearchParams({
      service: encodeURIComponent(serviceName),
      category: category,
      ...(price && { price: price })
    });
    
    navigate(`/contact?${params.toString()}`);
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'service-notification';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${serviceName} added to request form!</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const graphicDesignServices = [
    {
      id: 1,
      title: 'Brand Identity Design',
      description: 'Complete brand identity packages including logo design, color palette, typography, and brand guidelines.',
      features: ['Logo Design', 'Brand Guidelines', 'Business Cards', 'Stationery Design'],
      icon: 'fas fa-palette',
      color: '#6c63ff',
      basePrice: '₵699'
    },
    {
      id: 2,
      title: 'UI/UX Design',
      description: 'User-centered design for websites and applications focusing on usability and engagement.',
      features: ['Wireframing', 'Prototyping', 'User Testing', 'Responsive Design'],
      icon: 'fas fa-mobile-alt',
      color: '#4ecdc4',
      basePrice: '₵899'
    },
    {
      id: 3,
      title: 'Print & Packaging',
      description: 'Professional print materials and packaging designs that stand out on shelves.',
      features: ['Brochures & Flyers', 'Product Packaging', 'Business Cards', 'Posters & Banners'],
      icon: 'fas fa-print',
      color: '#ff6b6b',
      basePrice: '₵549'
    },
    {
      id: 4,
      title: 'Social Media Graphics',
      description: 'Eye-catching social media content that drives engagement and conversions.',
      features: ['Social Media Posts', 'Ad Creatives', 'Profile Branding', 'Content Templates'],
      icon: 'fas fa-share-alt',
      color: '#ffd166',
      basePrice: '₵399'
    },
    {
      id: 5,
      title: 'Website Design & Development',
      description: 'Modern, responsive websites that convert visitors into customers.',
      features: ['Website Design', 'E-commerce Solutions', 'CMS Integration', 'SEO Optimization'],
      icon: 'fas fa-code',
      color: '#06d6a0',
      basePrice: '₵1,299'
    },
    {
      id: 6,
      title: 'Motion Graphics',
      description: 'Animated videos and graphics for social media, presentations, and marketing.',
      features: ['Animated Logos', 'Explainer Videos', 'Social Media Ads', 'Presentation Graphics'],
      icon: 'fas fa-film',
      color: '#118ab2',
      basePrice: '₵799'
    }
  ];

  const techServices = [
    {
      id: 1,
      title: 'Computer Repair & Maintenance',
      description: 'Professional repair services for all computer makes and models.',
      features: ['Hardware Diagnosis', 'Component Replacement', 'System Cleaning', 'Performance Tuning'],
      icon: 'fas fa-tools',
      color: '#7209b7',
      basePrice: '₵50/hour'
    },
    {
      id: 2,
      title: 'Windows Installation & Setup',
      description: 'Complete Windows OS installation, configuration, and optimization.',
      features: ['Windows 10/11 Installation', 'Driver Updates', 'System Optimization', 'Data Migration'],
      icon: 'fab fa-windows',
      color: '#0078d7',
      basePrice: '₵150'
    },
    {
      id: 3,
      title: 'Software Installation & Support',
      description: 'Installation and configuration of all types of software applications.',
      features: ['Office Suite Setup', 'Creative Software', 'Antivirus Installation', 'Troubleshooting'],
      icon: 'fas fa-download',
      color: '#4361ee',
      basePrice: '₵100'
    },
    {
      id: 4,
      title: 'New Computer Setup',
      description: 'Complete setup and configuration of new computer systems.',
      features: ['Initial Setup', 'Software Installation', 'Data Transfer', 'System Optimization'],
      icon: 'fas fa-laptop',
      color: '#3a0ca3',
      basePrice: '₵200'
    },
    {
      id: 5,
      title: 'Networking Solutions',
      description: 'Setup and management of wired and wireless networks for businesses and homes.',
      features: ['Wi-Fi Setup', 'Network Security', 'Router Configuration', 'Troubleshooting'],
      icon: 'fas fa-network-wired',
      color: '#4895ef',
      basePrice: '₵250'
    },
    {
      id: 6,
      title: 'Computer System Management',
      description: 'Ongoing maintenance and management of computer systems for optimal performance.',
      features: ['System Monitoring', 'Regular Updates', 'Backup Solutions', 'Security Management'],
      icon: 'fas fa-server',
      color: '#560bad',
      basePrice: '₵300/month'
    }
  ];

  const pricingPlans = [
    {
      id: 1,
      name: 'Starter Package',
      price: '₵699',
      originalPrice: '₵848',
      savings: 'Save ₵149',
      description: 'Perfect for new businesses needing basic brand identity',
      features: [
        'Logo Design (Value: ₵299)',
        'Business Cards (Value: ₵150)',
        'Social Media Profile Kit (Value: ₵250)',
        'Basic Brand Guidelines (Value: ₵149)'
      ],
      popular: false
    },
    {
      id: 2,
      name: 'Professional Package',
      price: '₵1,499',
      originalPrice: '₵1,898',
      savings: 'Save ₵399',
      description: 'Complete branding solution for growing businesses',
      features: [
        'Logo Design + Variations',
        'Complete Brand Guidelines',
        'Business Stationery Set',
        'Social Media Content Kit',
        'Email Signature Design'
      ],
      popular: true
    },
    {
      id: 3,
      name: 'Website Package',
      price: '₵1,299',
      originalPrice: '₵1,548',
      savings: 'Save ₵249',
      description: 'Professional website design and development',
      features: [
        '5-Page Responsive Website',
        'Mobile-First Design',
        'SEO Optimization',
        'Contact Form Setup',
        'Social Media Integration'
      ],
      popular: false
    }
  ];

  const processSteps = [
    {
      id: 1,
      title: 'Consultation',
      description: 'We discuss your project requirements, goals, and timeline.',
      icon: 'fas fa-comments'
    },
    {
      id: 2,
      title: 'Planning & Strategy',
      description: 'We develop a detailed plan and strategy for your project.',
      icon: 'fas fa-clipboard-list'
    },
    {
      id: 3,
      title: 'Design & Development',
      description: 'Our team creates and develops your project with precision.',
      icon: 'fas fa-paint-brush'
    },
    {
      id: 4,
      title: 'Review & Feedback',
      description: 'You review the work and provide feedback for improvements.',
      icon: 'fas fa-search'
    },
    {
      id: 5,
      title: 'Final Delivery',
      description: 'We deliver the final product and provide support.',
      icon: 'fas fa-paper-plane'
    },
    {
      id: 6,
      title: 'Support & Maintenance',
      description: 'Ongoing support and maintenance for your project.',
      icon: 'fas fa-headset'
    }
  ];

  return (
    <div className="services-page">
      {/* Service Selection Notification */}
      <style>
        {`
          .service-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            transform: translateX(150%);
            transition: transform 0.3s ease-in-out;
            max-width: 300px;
          }
          
          .service-notification.show {
            transform: translateX(0);
          }
          
          .service-notification i {
            font-size: 20px;
            color: #4ade80;
          }
          
          .service-notification span {
            font-weight: 500;
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <div className="services-hero-content animate-on-scroll">
            <div className="hero-badge">
              <span className="badge-text">Comprehensive Services</span>
              <div className="badge-dot"></div>
            </div>
            <h1 className="hero-title">
              Professional <span className="highlight">Graphic Design</span> & 
              <span className="highlight"> Tech Support</span> Services
            </h1>
            <p className="hero-subtitle">
              From stunning visual designs to reliable technical solutions, we provide 
              comprehensive services to elevate your business and keep your systems running smoothly.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <h3 className="stat-number">500+</h3>
                <p className="stat-label">Projects Completed</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number">98%</h3>
                <p className="stat-label">Client Satisfaction</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number">24/7</h3>
                <p className="stat-label">Tech Support</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number">50+</h3>
                <p className="stat-label">Happy Clients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Graphic Design Services */}
      <section className="design-services section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Graphic Design Services</h2>
            <p className="section-subtitle">
              Creative design solutions that make your brand stand out
            </p>
            <div className="selection-hint">
              <i className="fas fa-mouse-pointer"></i>
              <span>Click any service to automatically add it to your contact request</span>
            </div>
          </div>
          
          <div className="services-grid">
            {graphicDesignServices.map((service, index) => (
              <div 
                key={service.id} 
                className="service-card animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleServiceClick(service.title, 'Graphic Design', service.basePrice)}
              >
                <div 
                  className="service-icon" 
                  style={{ backgroundColor: service.color }}
                >
                  <i className={service.icon}></i>
                </div>
                <div className="service-header">
                  <h3 className="service-title">{service.title}</h3>
                  <div className="service-price-badge">{service.basePrice}</div>
                </div>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <i className="fas fa-check-circle"></i>
                      {feature}
                    </li>
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
        </div>
      </section>

      {/* Tech Support Services */}
      <section className="tech-services section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Technical Support Services</h2>
            <p className="section-subtitle">
              Reliable tech solutions to keep your systems running efficiently
            </p>
            <div className="selection-hint">
              <i className="fas fa-mouse-pointer"></i>
              <span>Click any service to automatically add it to your contact request</span>
            </div>
          </div>
          
          <div className="services-grid">
            {techServices.map((service, index) => (
              <div 
                key={service.id} 
                className="service-card animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleServiceClick(service.title, 'Tech Support', service.basePrice)}
              >
                <div 
                  className="service-icon" 
                  style={{ backgroundColor: service.color }}
                >
                  <i className={service.icon}></i>
                </div>
                <div className="service-header">
                  <h3 className="service-title">{service.title}</h3>
                  <div className="service-price-badge">{service.basePrice}</div>
                </div>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <i className="fas fa-check-circle"></i>
                      {feature}
                    </li>
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
        </div>
      </section>

      {/* Our Process */}
      <section className="process-section section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Our Work Process</h2>
            <p className="section-subtitle">
              A systematic approach to ensure quality and efficiency in every project
            </p>
          </div>
          
          <div className="process-timeline">
            {processSteps.map((step, index) => (
              <div 
                key={step.id} 
                className={`process-step animate-on-scroll ${index % 2 === 0 ? 'left' : 'right'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="step-number">{step.id}</div>
                <div className="step-content">
                  <div className="step-icon">
                    <i className={step.icon}></i>
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Bundles */}
      <section className="pricing-section section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Package Bundles</h2>
            <p className="section-subtitle">
              Get more value with our bundled packages
            </p>
            <div className="selection-hint">
              <i className="fas fa-mouse-pointer"></i>
              <span>Click any package to automatically add it to your contact request</span>
            </div>
          </div>
          
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div 
                key={plan.id} 
                className={`pricing-card animate-on-scroll ${plan.popular ? 'popular' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleServiceClick(plan.name, 'Package', plan.price)}
              >
                {plan.popular && (
                  <div className="popular-badge">Most Popular</div>
                )}
                
                <div className="savings-badge">
                  <span>{plan.savings}</span>
                </div>
                
                <div className="pricing-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  
                  <div className="price-comparison">
                    <div className="original-price">{plan.originalPrice}</div>
                    <div className="plan-price">
                      <span className="price">{plan.price}</span>
                    </div>
                  </div>
                  
                  <p className="plan-description">{plan.description}</p>
                </div>
                
                <ul className="plan-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <i className="fas fa-check"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="plan-action">
                  <button className="btn-package-select">
                    <i className="fas fa-shopping-cart"></i>
                    <span>Select Package</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
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
      <section className="services-cta section">
        <div className="container">
          <div className="cta-content animate-on-scroll">
            <div className="cta-text">
              <h2 className="cta-title">Ready to Transform Your Business?</h2>
              <p className="cta-description">
                Whether you need stunning designs or reliable tech support, 
                we've got you covered. Get in touch for a free consultation.
              </p>
            </div>
            <div className="cta-buttons">
              <button 
                onClick={() => handleServiceClick('General Consultation', 'Consultation')}
                className="btn-cta-primary"
              >
                <i className="fas fa-calendar-check"></i>
                <span>Book Free Consultation</span>
              </button>
              <button 
                onClick={() => handleServiceClick('Custom Quote Request', 'Quote')}
                className="btn-cta-secondary"
              >
                <i className="fas fa-file-invoice-dollar"></i>
                <span>Request Custom Quote</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;