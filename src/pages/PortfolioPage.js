import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PortfolioPage.css';

const PortfolioPage = () => {
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [activeView, setActiveView] = useState('grid'); // 'grid' or 'masonry'
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

  useEffect(() => {
    // Enhanced projects data with case study details
    const allProjects = [
      {
        id: 1,
        title: 'Golden Nest Hotel Website',
        category: 'web',
        description: 'Complete website design and development for luxury hotel brand with booking system integration',
        detailedDescription: 'A comprehensive website redesign for Golden Nest Hotel featuring a modern, luxurious design with integrated booking system, room gallery, and customer reviews. The project focused on creating a seamless user experience that reflects the hotel\'s premium brand identity.',
        tags: ['Web Design', 'Development', 'Booking System', 'Responsive', 'Luxury Brand'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        client: 'Golden Nest Hotel',
        year: '2025',
        duration: '8 weeks',
        role: 'Lead Designer & Developer',
        deliverables: ['Complete Website', 'Booking System', 'Admin Panel', 'Mobile App Design'],
        results: ['40% increase in online bookings', '25% higher user engagement', '5-star client satisfaction'],
        color: '#D4AF37', // Gold color from the hotel theme
        link: 'https://www.goldennesthotelgh.com',
        mockups: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      },
     {
    id: 2,
    title: 'St. Martin De Porres Catholic Hospital, Agomanya',
    category: 'branding',
    description: 'Award-winning logo for the 80th Anniversary, blending timeless elegance with a forward-looking vision. The "80TH" takes center stage, framed by the proud pillars of "HERITAGE" and "FUTURE".',
    detailedDescription: 'In celebration of a landmark 80th anniversary, this logo was selected last year as the winning design from an open challenge, chosen for its ability to capture both legacy and forward momentum. The composition is elegantly structured in three distinct tiers, creating a visual statement that is both monumental and meaningful.\n\nAt its heart, the bold and centered "80TH" serves as the focal point—a clear, proud declaration of the milestone itself. This central element is not merely a number, but a symbolic anchor, representing the enduring presence and achievement across eight decades.\n\nDirectly supporting this anniversary statement are the two foundational words: "HERITAGE" above and "FUTURE" below. This intentional framing is the core concept of the design. "HERITAGE" rests atop the number, visually bearing the weight of history, tradition, and accumulated experience. Beneath, "FUTURE" provides a solid base, symbolizing the ongoing path, growth, and aspirations that the legacy enables. Together, they act as conceptual pillars, literally and figuratively upholding the anniversary moment.\n\nThe choice of a clean, sans-serif typeface in a balanced, stacked layout conveys stability, clarity, and a contemporary feel. It avoids nostalgia-heavy styling, instead presenting the anniversary as a dynamic event—one that respects the past while standing firmly in the present and looking ahead. The absence of extra ornamentation focuses attention purely on the power of these three words, making the message immediate and unforgettable.\n\nUltimately, this logo is more than a commemorative mark; it is a visual thesis. It eloquently communicates that the celebrated 80-year journey is not a conclusion, but a vital connection point—where a distinguished past confidently supports a promising future. Its selection as the winning entry affirmed its success in translating this profound narrative into a single, powerful, and enduring image.',
    tags: ['Logo Design', 'Brand Identity', 'Anniversary', 'Healthcare', 'Institutional Branding'],
    image: '80th.jpg', // Changed to placeholder - update with actual image
    client: 'St. Martin De Porres Catholic Hospital',
    year: '2025',
    duration: '2 weeks',
    role: 'Lead Brand Identity Designer',
    deliverables: ['Anniversary Logo', 'Brand Guidelines', 'Stationery System', 'Merchandise Application'],
    results: ['Selected as winning design from open competition', 'Successfully launched for 80th anniversary celebrations', 'Adopted across all hospital communications'],
    color: '#2E5A9C', // Suggested blue tone for healthcare/trust
    mockups: []
},
      {
        id: 3,
        title: 'FinTech Mobile Banking App',
        category: 'uiux',
        description: 'UI/UX design for innovative mobile banking application with financial tracking features',
        detailedDescription: 'Designed a user-friendly mobile banking application that simplifies financial management. The project involved user research, wireframing, prototyping, and creating a design system for consistent user experience.',
        tags: ['UI Design', 'UX Research', 'Mobile App', 'FinTech', 'Prototyping'],
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        client: 'FinTech Innovations Inc.',
        year: '2023',
        duration: '12 weeks',
        role: 'UI/UX Designer',
        deliverables: ['Wireframes', 'High-fidelity Prototypes', 'Design System', 'User Testing Reports'],
        results: ['User retention increased by 45%', 'App Store rating: 4.8 stars', '1M+ downloads in first month'],
        color: '#2196F3',
        mockups: []
      },
      {
        id: 4,
        title: 'Organic Food Packaging Series',
        category: 'packaging',
        description: 'Sustainable packaging design for organic food product line across multiple categories',
        detailedDescription: 'Created a cohesive packaging system for Organic Foods\' product line that emphasizes natural ingredients and sustainability. The design uses eco-friendly materials and communicates product benefits clearly.',
        tags: ['Packaging Design', 'Print Production', 'Sustainability', 'Brand Consistency'],
        image: 'https://images.unsplash.com/photo-1580995170656-f0aa5c5c31dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        client: 'Organic Foods Ltd.',
        year: '2023',
        duration: '4 weeks',
        role: 'Packaging Designer',
        deliverables: ['Packaging Designs', 'Production Files', 'Material Specifications', 'Print Samples'],
        results: ['Sales increased by 35%', 'Packaging award winner', 'Featured on retail design blog'],
        color: '#8BC34A',
        mockups: []
      },
      {
        id: 5,
        title: 'Tech Startup Corporate Website',
        category: 'web',
        description: 'Modern corporate website design with investor relations and recruitment sections',
        detailedDescription: 'Designed and developed a corporate website for TechStart Inc. that showcases their products, company culture, and investment opportunities. The site includes dynamic content management and multilingual support.',
        tags: ['Corporate Website', 'CMS Integration', 'Multilingual', 'Investor Relations'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        client: 'TechStart Inc.',
        year: '2023',
        duration: '6 weeks',
        role: 'Web Designer & Developer',
        deliverables: ['Responsive Website', 'CMS Setup', 'Content Strategy', 'SEO Optimization'],
        results: ['Traffic increased by 200%', 'Improved SEO ranking', 'Positive investor feedback'],
        color: '#673AB7',
        mockups: []
      },
      {
        id: 6,
        title: 'Fitness App UI/UX Design',
        category: 'uiux',
        description: 'Mobile fitness app design with workout tracking and community features',
        detailedDescription: 'Created an engaging fitness app interface that motivates users through gamification and social features. The design focuses on intuitive workout tracking and progress visualization.',
        tags: ['Mobile Design', 'Fitness App', 'Gamification', 'User Engagement'],
        image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        client: 'FitTrack Solutions',
        year: '2023',
        duration: '10 weeks',
        role: 'UI/UX Designer',
        deliverables: ['App Design', 'User Flows', 'Interactive Prototype', 'Design System'],
        results: ['User engagement up 55%', '4.9 App Store rating', '100k active users'],
        color: '#FF5722',
        mockups: []
      },
      {
        id: 7,
        title: 'Book Publishing Series',
        category: 'print',
        description: 'Complete book cover design series for bestselling author trilogy',
        detailedDescription: 'Designed a cohesive series of book covers that work individually and as a set. The designs capture the essence of each book while maintaining series consistency.',
        tags: ['Book Design', 'Typography', 'Series Design', 'Print Production'],
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        client: 'BookHouse Publishing',
        year: '2023',
        duration: '3 weeks',
        role: 'Book Designer',
        deliverables: ['Cover Designs', 'Interior Layout', 'Print Files', 'Marketing Materials'],
        results: ['Book series sold 50k copies', 'Cover featured in design annual', 'Author satisfaction: 100%'],
        color: '#795548',
        mockups: []
      },
      {
        id: 8,
        title: 'Corporate Rebranding',
        category: 'branding',
        description: 'Complete rebranding for established corporation entering new markets',
        detailedDescription: 'Led a comprehensive rebranding initiative for GlobalCorp to modernize their identity and appeal to younger demographics while maintaining corporate credibility.',
        tags: ['Rebranding', 'Corporate Identity', 'Brand Strategy', 'Market Research'],
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        client: 'GlobalCorp International',
        year: '2023',
        duration: '16 weeks',
        role: 'Lead Brand Strategist',
        deliverables: ['Brand Strategy', 'Identity System', 'Guidelines', 'Implementation Plan'],
        results: ['Brand perception improved by 40%', 'Stock price increased 15%', 'Industry award winner'],
        color: '#607D8B',
        mockups: []
      }
    ];

    if (filter === 'all') {
      setProjects(allProjects);
    } else {
      setProjects(allProjects.filter(project => project.category === filter));
    }
  }, [filter]);

  const categories = [
    { id: 'all', name: 'All Projects', icon: 'fas fa-th', count: 8 },
    { id: 'web', name: 'Web Design', icon: 'fas fa-desktop', count: 2 },
    { id: 'uiux', name: 'UI/UX Design', icon: 'fas fa-mobile-alt', count: 2 },
    { id: 'branding', name: 'Brand Identity', icon: 'fas fa-palette', count: 2 },
    { id: 'packaging', name: 'Packaging', icon: 'fas fa-box-open', count: 1 },
    { id: 'print', name: 'Print Design', icon: 'fas fa-print', count: 1 }
  ];

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    setShowProjectModal(false);
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  const handleStartProject = () => {
    navigate('/contact');
  };

  return (
    <div className="portfolio-page">
      {/* Hero Section */}
      <section className="portfolio-hero section">
        <div className="container">
          <div className="hero-content animate-on-scroll">
            <div className="hero-badge">
              <span className="badge-text">Featured Work</span>
            </div>
            <h1 className="hero-title">
              Design Portfolio That <span className="highlight">Inspires</span> & 
              <span className="highlight"> Delivers</span> Results
            </h1>
            <p className="hero-subtitle">
              Discover our award-winning design projects that blend creativity with strategy 
              to deliver measurable business results for clients across industries.
            </p>
            
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={handleStartProject}>
                <i className="fas fa-paper-plane"></i> Start Your Project
              </button>
              <a href="#featured" className="btn btn-outline">
                <i className="fas fa-arrow-down"></i> View Featured Work
              </a>
            </div>
            
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-number">8+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">150+</div>
                <div className="stat-label">Projects Delivered</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">98%</div>
                <div className="stat-label">Client Satisfaction</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">25+</div>
                <div className="stat-label">Industry Awards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Project */}
      <section id="featured" className="featured-project section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">
              <i className="fas fa-crown"></i> Featured Case Study
            </h2>
            <p className="section-subtitle">
              An in-depth look at one of our most successful projects
            </p>
          </div>
          
          <div className="featured-content animate-on-scroll">
            <div className="featured-preview">
              <div className="preview-image">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                  alt="Golden Nest Hotel Website" 
                />
                <div className="preview-badge">
                  <i className="fas fa-award"></i>
                  <span>Featured Project</span>
                </div>
              </div>
            </div>
            
            <div className="featured-info">
              <div className="project-category-badge">
                <i className="fas fa-desktop"></i>
                <span>Web Design & Development</span>
              </div>
              
              <h3 className="featured-title">Golden Nest Hotel Website</h3>
              
              <p className="featured-description">
                Complete website redesign and development for a luxury hotel brand, 
                featuring integrated booking system, room gallery, and customer reviews.
              </p>
              
              <div className="project-highlights">
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="highlight-content">
                    <div className="highlight-title">40% Increase</div>
                    <div className="highlight-subtitle">Online Bookings</div>
                  </div>
                </div>
                
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="highlight-content">
                    <div className="highlight-title">25% Higher</div>
                    <div className="highlight-subtitle">User Engagement</div>
                  </div>
                </div>
                
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="highlight-content">
                    <div className="highlight-title">5-Star</div>
                    <div className="highlight-subtitle">Client Rating</div>
                  </div>
                </div>
              </div>
              
              <div className="featured-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => openProjectModal(projects.find(p => p.id === 1))}
                >
                  <i className="fas fa-expand"></i> View Full Case Study
                </button>
                <a 
                  href="https://www.goldennesthotelgh.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <i className="fas fa-external-link-alt"></i> Visit Live Site
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Filter & Controls */}
      <section className="portfolio-controls section">
        <div className="container">
          <div className="controls-wrapper">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Our Portfolio</h2>
              <p className="section-subtitle">
                Browse our diverse collection of design projects across various categories
              </p>
            </div>
            
            <div className="controls-row animate-on-scroll">
              <div className="view-controls">
                <button 
                  className={`view-btn ${activeView === 'grid' ? 'active' : ''}`}
                  onClick={() => setActiveView('grid')}
                >
                  <i className="fas fa-th"></i> Grid View
                </button>
                <button 
                  className={`view-btn ${activeView === 'masonry' ? 'active' : ''}`}
                  onClick={() => setActiveView('masonry')}
                >
                  <i className="fas fa-th-large"></i> Masonry View
                </button>
              </div>
              
              <div className="filter-controls">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-filter ${filter === category.id ? 'active' : ''}`}
                    onClick={() => setFilter(category.id)}
                  >
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="portfolio-grid-section section">
        <div className="container">
          <div className={`projects-container ${activeView === 'masonry' ? 'masonry-layout' : 'grid-layout'}`}>
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className={`project-item animate-on-scroll ${project.category}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => openProjectModal(project)}
              >
                <div className="project-card">
                  <div className="project-media">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      loading="lazy"
                    />
                    <div className="project-overlay">
                      <div className="overlay-content">
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-description">{project.description}</p>
                        <div className="project-meta">
                          <div className="meta-item">
                            <i className="fas fa-user"></i>
                            <span>{project.client}</span>
                          </div>
                          <div className="meta-item">
                            <i className="fas fa-calendar"></i>
                            <span>{project.year}</span>
                          </div>
                        </div>
                      </div>
                      <div className="project-action">
                        <button className="btn-view-project">
                          <i className="fas fa-expand"></i> View Case Study
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="project-info">
                    <div className="project-header">
                      <div className="category-badge">
                        <i className={categories.find(c => c.id === project.category)?.icon}></i>
                        <span>{categories.find(c => c.id === project.category)?.name}</span>
                      </div>
                      <div className="project-year">{project.year}</div>
                    </div>
                    
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-excerpt">{project.description}</p>
                    
                    <div className="project-tags">
                      {project.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="project-tag">{tag}</span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="project-tag-more">+{project.tags.length - 3}</span>
                      )}
                    </div>
                    
                    <div className="project-results">
                      <div className="result-item">
                        <i className="fas fa-rocket"></i>
                        <span>Results Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {projects.length === 0 && (
            <div className="no-projects animate-on-scroll">
              <div className="no-projects-content">
                <i className="fas fa-search"></i>
                <h3>No projects found</h3>
                <p>Try selecting a different category to view related projects</p>
                <button 
                  className="btn btn-outline" 
                  onClick={() => setFilter('all')}
                >
                  <i className="fas fa-redo"></i> Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="portfolio-testimonials section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Client Success Stories</h2>
            <p className="section-subtitle">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>
          
          <div className="testimonials-slider animate-on-scroll">
            <div className="testimonial-track">
              <div className="testimonial-slide">
                <div className="testimonial-card">
                  <div className="client-info">
                    <div className="client-avatar">
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                        alt="Alex Johnson"
                      />
                    </div>
                    <div className="client-details">
                      <h4 className="client-name">Alex Johnson</h4>
                      <p className="client-role">CEO, Golden Nest Hotel</p>
                      <div className="client-rating">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-text">
                    <i className="fas fa-quote-left"></i>
                    <p>
                      "Working with Fast Multimedia was transformative for our business. 
                      Their redesign of our hotel website not only looks stunning but has 
                      increased our online bookings by 40%. Their attention to detail and 
                      understanding of our luxury brand was exceptional."
                    </p>
                    <div className="project-link">
                      <i className="fas fa-link"></i>
                      <a href="https://www.goldennesthotelgh.com" target="_blank" rel="noopener noreferrer">
                        View Golden Nest Hotel Project
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-slide">
                <div className="testimonial-card">
                  <div className="client-info">
                    <div className="client-avatar">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                        alt="Maria Garcia"
                      />
                    </div>
                    <div className="client-details">
                      <h4 className="client-name">Maria Garcia</h4>
                      <p className="client-role">Product Manager, FinTech Co</p>
                      <div className="client-rating">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-text">
                    <i className="fas fa-quote-left"></i>
                    <p>
                      "The mobile banking app design delivered by Fast Multimedia exceeded 
                      all our expectations. User retention increased by 45% and we received 
                      overwhelmingly positive feedback from our customers. Their UX research 
                      was thorough and their designs were both beautiful and functional."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="portfolio-cta section">
        <div className="container">
          <div className="cta-content animate-on-scroll">
            <div className="cta-text">
              <div className="cta-badge">
                <i className="fas fa-rocket"></i>
                <span>Ready to Start?</span>
              </div>
              <h2 className="cta-title">
                Let's Create Something <span className="highlight">Amazing</span> Together
              </h2>
              <p className="cta-description">
                Share your project vision with us and let's transform it into a stunning 
                reality that delivers real business results.
              </p>
            </div>
            <div className="cta-actions">
              <button className="btn btn-primary" onClick={handleStartProject}>
                <i className="fas fa-paper-plane"></i> Start Your Project
              </button>
              <a href="mailto:fasttech227@gmail.com" className="btn btn-outline">
                <i className="fas fa-envelope"></i> Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {showProjectModal && selectedProject && (
        <div className="project-modal">
          <div className="modal-overlay" onClick={closeProjectModal}></div>
          <div className="modal-content">
            <button className="modal-close" onClick={closeProjectModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-header">
              <div className="modal-category">
                <i className={categories.find(c => c.id === selectedProject.category)?.icon}></i>
                <span>{categories.find(c => c.id === selectedProject.category)?.name}</span>
              </div>
              <h2 className="modal-title">{selectedProject.title}</h2>
              <div className="modal-subtitle">{selectedProject.client} • {selectedProject.year}</div>
            </div>
            
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedProject.image} alt={selectedProject.title} />
              </div>
              
              <div className="modal-info">
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">
                      <i className="fas fa-user-tie"></i>
                      <span>Client</span>
                    </div>
                    <div className="info-value">{selectedProject.client}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Year</span>
                    </div>
                    <div className="info-value">{selectedProject.year}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <i className="fas fa-clock"></i>
                      <span>Duration</span>
                    </div>
                    <div className="info-value">{selectedProject.duration}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <i className="fas fa-briefcase"></i>
                      <span>Role</span>
                    </div>
                    <div className="info-value">{selectedProject.role}</div>
                  </div>
                </div>
                
                <div className="project-description-full">
                  <h4>Project Overview</h4>
                  <p>{selectedProject.detailedDescription}</p>
                </div>
                
                <div className="project-deliverables">
                  <h4>Deliverables</h4>
                  <div className="deliverables-list">
                    {selectedProject.deliverables.map((item, index) => (
                      <div key={index} className="deliverable-item">
                        <i className="fas fa-check-circle"></i>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="project-results">
                  <h4>Results Achieved</h4>
                  <div className="results-list">
                    {selectedProject.results.map((result, index) => (
                      <div key={index} className="result-item">
                        <i className="fas fa-chart-line"></i>
                        <span>{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="project-tags-full">
                  {selectedProject.tags.map(tag => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleStartProject}>
                <i className="fas fa-paper-plane"></i> Start Similar Project
              </button>
              {selectedProject.link && (
                <a 
                  href={selectedProject.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <i className="fas fa-external-link-alt"></i> View Live Project
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;