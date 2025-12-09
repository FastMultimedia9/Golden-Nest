import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const ServicesPage = () => {
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

  const graphicDesignServices = [
    {
      id: 1,
      title: 'Brand Identity Design',
      description: 'Complete brand identity packages including logo design, color palette, typography, and brand guidelines.',
      features: ['Logo Design', 'Brand Guidelines', 'Business Cards', 'Stationery Design'],
      icon: 'fas fa-palette',
      color: '#6c63ff'
    },
    {
      id: 2,
      title: 'UI/UX Design',
      description: 'User-centered design for websites and applications focusing on usability and engagement.',
      features: ['Wireframing', 'Prototyping', 'User Testing', 'Responsive Design'],
      icon: 'fas fa-mobile-alt',
      color: '#4ecdc4'
    },
    {
      id: 3,
      title: 'Print & Packaging',
      description: 'Professional print materials and packaging designs that stand out on shelves.',
      features: ['Brochures & Flyers', 'Product Packaging', 'Business Cards', 'Posters & Banners'],
      icon: 'fas fa-print',
      color: '#ff6b6b'
    },
    {
      id: 4,
      title: 'Social Media Graphics',
      description: 'Eye-catching social media content that drives engagement and conversions.',
      features: ['Social Media Posts', 'Ad Creatives', 'Profile Branding', 'Content Templates'],
      icon: 'fas fa-share-alt',
      color: '#ffd166'
    },
    {
      id: 5,
      title: 'Web Design & Development',
      description: 'Modern, responsive websites that convert visitors into customers.',
      features: ['Website Design', 'E-commerce Solutions', 'CMS Integration', 'SEO Optimization'],
      icon: 'fas fa-code',
      color: '#06d6a0'
    },
    {
      id: 6,
      title: 'Motion Graphics',
      description: 'Animated videos and graphics for social media, presentations, and marketing.',
      features: ['Animated Logos', 'Explainer Videos', 'Social Media Ads', 'Presentation Graphics'],
      icon: 'fas fa-film',
      color: '#118ab2'
    }
  ];

  const techServices = [
    {
      id: 1,
      title: 'Computer Repair & Maintenance',
      description: 'Professional repair services for all computer makes and models.',
      features: ['Hardware Diagnosis', 'Component Replacement', 'System Cleaning', 'Performance Tuning'],
      icon: 'fas fa-tools',
      color: '#7209b7'
    },
    {
      id: 2,
      title: 'Windows Installation & Setup',
      description: 'Complete Windows OS installation, configuration, and optimization.',
      features: ['Windows 10/11 Installation', 'Driver Updates', 'System Optimization', 'Data Migration'],
      icon: 'fab fa-windows',
      color: '#0078d7'
    },
    {
      id: 3,
      title: 'Software Installation & Support',
      description: 'Installation and configuration of all types of software applications.',
      features: ['Office Suite Setup', 'Creative Software', 'Antivirus Installation', 'Troubleshooting'],
      icon: 'fas fa-download',
      color: '#4361ee'
    },
    {
      id: 4,
      title: 'New Computer Setup',
      description: 'Complete setup and configuration of new computer systems.',
      features: ['Initial Setup', 'Software Installation', 'Data Transfer', 'System Optimization'],
      icon: 'fas fa-laptop',
      color: '#3a0ca3'
    },
    {
      id: 5,
      title: 'Networking Solutions',
      description: 'Setup and management of wired and wireless networks for businesses and homes.',
      features: ['Wi-Fi Setup', 'Network Security', 'Router Configuration', 'Troubleshooting'],
      icon: 'fas fa-network-wired',
      color: '#4895ef'
    },
    {
      id: 6,
      title: 'Computer System Management',
      description: 'Ongoing maintenance and management of computer systems for optimal performance.',
      features: ['System Monitoring', 'Regular Updates', 'Backup Solutions', 'Security Management'],
      icon: 'fas fa-server',
      color: '#560bad'
    }
  ];

  // UPDATED: Clear Package Bundles with transparent pricing
  const pricingPlans = [
    {
      id: 1,
      name: 'Starter Package',
      price: '₵699',
      originalPrice: '₵848',
      savings: 'Save ₵149',
      period: 'one-time payment',
      description: 'Perfect for new businesses needing basic brand identity',
      features: [
        'Logo Design (Value: ₵299)',
        'Business Cards (Value: ₵150)',
        'Social Media Profile Kit (Value: ₵250)',
        'Basic Brand Guidelines (Value: ₵149)',
        '2 Revision Rounds',
        '1 Week Delivery'
      ],
      whatsIncluded: 'Complete brand starter package - everything listed',
      note: 'Perfect for startups and small businesses',
      popular: false,
      totalValue: '₵848'
    },
    {
      id: 2,
      name: 'Professional Package',
      price: '₵1,499',
      originalPrice: '₵1,898',
      savings: 'Save ₵399',
      period: 'one-time payment',
      description: 'Complete branding solution for growing businesses',
      features: [
        'Logo Design + Variations (Value: ₵499)',
        'Complete Brand Guidelines (Value: ₵299)',
        'Business Stationery Set (Value: ₵350)',
        'Social Media Content Kit (Value: ₵450)',
        'Email Signature Design (Value: ₵150)',
        'Brand Presentation (Value: ₵150)',
        '5 Revision Rounds',
        'Priority Support',
        '2 Weeks Delivery'
      ],
      whatsIncluded: 'Full brand identity package - everything listed',
      note: 'Most popular choice for established businesses',
      popular: true,
      totalValue: '₵1,898'
    },
    {
      id: 3,
      name: 'Website Package',
      price: '₵1,299',
      originalPrice: '₵1,548',
      savings: 'Save ₵249',
      period: 'one-time payment',
      description: 'Professional website design and development',
      features: [
        '5-Page Responsive Website (Value: ₵899)',
        'Mobile-First Design (Value: ₵299)',
        'SEO Optimization (Value: ₵150)',
        'Contact Form Setup (Value: ₵100)',
        'Social Media Integration (Value: ₵100)',
        '3 Revision Rounds',
        'Basic Training',
        '3-4 Weeks Delivery',
        '3 Months Support'
      ],
      whatsIncluded: 'Complete website design and development package',
      note: 'Hosting and domain are additional costs',
      popular: false,
      totalValue: '₵1,548'
    }
  ];

  // UPDATED: Service-based pricing for transparency
  const servicePrices = [
    {
      id: 1,
      service: 'Logo Design',
      price: '₵299',
      description: 'Professional logo design with 2 concepts and 3 revisions',
      features: ['2 Initial Concepts', '3 Revisions', 'Final Files in Multiple Formats']
    },
    {
      id: 2,
      service: 'Business Cards',
      price: '₵150',
      description: 'Professional business card design (front & back)',
      features: ['2 Design Concepts', '2 Revisions', 'Print-Ready Files']
    },
    {
      id: 3,
      service: 'Social Media Kit',
      price: '₵250-₵450',
      description: 'Social media branding package',
      features: ['Profile & Cover Designs', 'Post Templates', 'Brand Consistency']
    },
    {
      id: 4,
      service: 'Website Design',
      price: '₵899+',
      description: 'Responsive website design',
      features: ['Mobile-Friendly Design', 'Contact Form', 'Basic SEO', 'Revisions']
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
          </div>
          
          <div className="services-grid">
            {graphicDesignServices.map((service, index) => (
              <div 
                key={service.id} 
                className="service-card animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="service-icon" 
                  style={{ backgroundColor: service.color }}
                >
                  <i className={service.icon}></i>
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <i className="fas fa-check-circle"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn btn-outline">
                  Get This Service
                </Link>
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
          </div>
          
          <div className="services-grid">
            {techServices.map((service, index) => (
              <div 
                key={service.id} 
                className="service-card animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="service-icon" 
                  style={{ backgroundColor: service.color }}
                >
                  <i className={service.icon}></i>
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <i className="fas fa-check-circle"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn btn-outline">
                  Get This Service
                </Link>
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

      {/* UPDATED: Pricing Plans with clear bundles */}
      <section className="pricing-section section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Transparent Pricing Plans</h2>
            <p className="section-subtitle">
              Clear package bundles with visible savings - no hidden costs
            </p>
          </div>
          
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div 
                key={plan.id} 
                className={`pricing-card animate-on-scroll ${plan.popular ? 'popular' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="popular-badge">Most Popular</div>
                )}
                
                {/* Savings Badge */}
                <div className="savings-badge">
                  <span>{plan.savings}</span>
                </div>
                
                <div className="pricing-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  
                  {/* Price with original comparison */}
                  <div className="price-comparison">
                    <div className="original-price">₵{plan.originalPrice.replace('₵', '')}</div>
                    <div className="plan-price">
                      <span className="price">{plan.price}</span>
                      <span className="period">{plan.period}</span>
                    </div>
                    <div className="total-value">Total Value: <strong>{plan.totalValue}</strong></div>
                  </div>
                  
                  <p className="plan-description">{plan.description}</p>
                  
                  {/* What's included section */}
                  <div className="included-note">
                    <i className="fas fa-check-circle"></i>
                    <span>{plan.whatsIncluded}</span>
                  </div>
                </div>
                
                <ul className="plan-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <i className="fas fa-check"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {plan.note && (
                  <div className="plan-note">
                    <p><i className="fas fa-exclamation-circle"></i> {plan.note}</p>
                  </div>
                )}
                
                <Link to="/contact" className="btn btn-primary">
                  Get This Package
                </Link>
              </div>
            ))}
          </div>
          
          {/* UPDATED: Individual service pricing for transparency */}
          <div className="individual-services animate-on-scroll">
            <h3 className="services-title">Individual Service Pricing</h3>
            <p className="services-subtitle">Need just one service? Here are our individual rates:</p>
            
            <div className="services-pricing-grid">
              {servicePrices.map((service) => (
                <div key={service.id} className="service-pricing-card">
                  <h4 className="service-name">{service.service}</h4>
                  <div className="service-price">{service.price}</div>
                  <p className="service-desc">{service.description}</p>
                  <ul className="service-features-list">
                    {service.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                  <Link to="/contact" className="btn btn-outline-small">
                    Book This Service
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pricing-note animate-on-scroll">
            <p>
              <i className="fas fa-info-circle"></i>
              <strong>Note:</strong> Tech support services are billed hourly at ₵50/hour. 
              All design packages include 3 rounds of revisions. Custom quotes available for complex projects.
              <br />
              <span className="highlight-text">No hidden fees - what you see is what you pay!</span>
            </p>
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
              <Link to="/contact" className="btn btn-primary">
                <i className="fas fa-paper-plane"></i> Get Free Quote
              </Link>
              <Link to="/contact" className="btn btn-outline">
                <i className="fas fa-phone-alt"></i> Call Now: +233 505-159-131
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;