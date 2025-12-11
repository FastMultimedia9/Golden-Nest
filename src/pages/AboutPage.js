import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
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

  const teamMembers = [
    {
      id: 1,
      name: 'Teye James',
      role: 'Founder & Creative Director',
      bio: 'With over 8 years in graphic design and tech solutions, James leads our vision to provide exceptional design and technical services.',
      image: '/images/Teye-James.JPG'
    },
    {
      id: 2,
      name: 'Sarah Mensah',
      role: 'Senior Graphic Designer',
      bio: 'Specializing in brand identity and print design, Sarah creates stunning visuals that capture brand essence.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      name: 'Tawiah Nicholas Tetteh',
      role: 'Tech Support Lead',
      bio: 'With extensive experience in computer systems and networking, Nicholas ensures all tech solutions are reliable and efficient.',
      image: '/images/Nichola Tetteh.jpg'
    },
    {
      id: 4,
      name: 'Ama Ofori',
      role: 'UI/UX Designer',
      bio: 'Ama creates intuitive digital experiences that blend beautiful design with exceptional functionality.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const values = [
    {
      id: 1,
      title: 'Quality & Excellence',
      description: 'We deliver exceptional work that exceeds expectations and stands the test of time.',
      icon: 'fas fa-medal'
    },
    {
      id: 2,
      title: 'Customer Focus',
      description: 'Your success is our priority. We listen, understand, and deliver exactly what you need.',
      icon: 'fas fa-handshake'
    },
    {
      id: 3,
      title: 'Innovation',
      description: 'We embrace new technologies and creative approaches to solve business challenges.',
      icon: 'fas fa-lightbulb'
    },
    {
      id: 4,
      title: 'Reliability',
      description: 'We deliver on time, every time. Your project is in safe hands with our team.',
      icon: 'fas fa-shield-alt'
    }
  ];

  const processSteps = [
    {
      id: 1,
      title: 'Consultation & Discovery',
      description: 'We begin with a detailed consultation to understand your needs, goals, and vision.',
      icon: 'fas fa-comments'
    },
    {
      id: 2,
      title: 'Planning & Strategy',
      description: 'We develop a custom strategy and plan tailored to your specific requirements.',
      icon: 'fas fa-clipboard-list'
    },
    {
      id: 3,
      title: 'Design & Development',
      description: 'Our team creates and develops your project with precision and attention to detail.',
      icon: 'fas fa-paint-brush'
    },
    {
      id: 4,
      title: 'Review & Refinement',
      description: 'We present the work, gather feedback, and make refinements until it\'s perfect.',
      icon: 'fas fa-search'
    },
    {
      id: 5,
      title: 'Final Delivery',
      description: 'We deliver the final product along with any necessary files, guidelines, or support.',
      icon: 'fas fa-paper-plane'
    },
    {
      id: 6,
      title: 'Ongoing Support',
      description: 'We provide continued support and maintenance to ensure your long-term success.',
      icon: 'fas fa-headset'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content animate-on-scroll">
            <h1 className="hero-title">About Fast Multimedia</h1>
            <p className="hero-subtitle">
              Pioneering graphic design and tech solutions in Ghana since 2018. 
              We combine creative excellence with technical expertise to transform businesses.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <h3 className="stat-number">6+</h3>
                <p className="stat-label">Years of Excellence</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number">500+</h3>
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
        </div>
      </section>

      {/* Our Story */}
      <section className="story-section section">
        <div className="container">
          <div className="story-content">
            <div className="story-text animate-on-scroll">
              <h2 className="section-title">Our Journey</h2>
              <p className="story-description">
                Founded in 2018, Fast Multimedia began as a small graphic design studio in Kpong, 
                Ghana. What started as a passion for creating beautiful designs has evolved into 
                a comprehensive creative agency offering both graphic design and technical support services.
              </p>
              <p className="story-description">
                Over the past 6 years, we've grown from a one-person operation to a dedicated team 
                of professionals, expanding our services to include computer repairs, networking solutions, 
                and comprehensive tech support while maintaining our core expertise in design.
              </p>
              <p className="story-description">
                Our location on the Akosombo Highway in Kpong has allowed us to serve clients 
                throughout Ghana while maintaining strong community roots. We're proud to be 
                part of Ghana's growing creative and tech industry.
              </p>
              <div className="story-highlights">
                <div className="highlight-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h4>Our Location</h4>
                    <p>Kpong, Akosombo Highway<br />Eastern Region, Ghana</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-calendar-alt"></i>
                  <div>
                    <h4>Established</h4>
                    <p>2018<br />6+ Years of Service</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="story-image animate-on-scroll">
              <img 
                src="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Fast Multimedia Studio"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision section">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card animate-on-scroll">
              <div className="card-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3 className="card-title">Our Mission</h3>
              <p className="card-description">
                To empower Ghanaian businesses with exceptional design and reliable tech solutions 
                that enhance their brand presence and operational efficiency. We strive to make 
                professional design and technical support accessible to businesses of all sizes.
              </p>
            </div>
            
            <div className="vision-card animate-on-scroll">
              <div className="card-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h3 className="card-title">Our Vision</h3>
              <p className="card-description">
                To be Ghana's leading creative and technical solutions provider, recognized for 
                innovation, quality, and exceptional customer service. We aim to contribute to 
                the growth of Ghana's digital economy through our work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="values-section section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do at Fast Multimedia
            </p>
          </div>
          
          <div className="values-grid">
            {values.map((value) => (
              <div key={value.id} className="value-card animate-on-scroll">
                <div className="value-icon">
                  <i className={value.icon}></i>
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="team-section section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">
              Talented professionals dedicated to delivering exceptional results
            </p>
          </div>
          
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-member animate-on-scroll">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-bio">{member.bio}</p>
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
              A structured approach that ensures quality, efficiency, and satisfaction
            </p>
          </div>
          
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <div key={step.id} className="process-step animate-on-scroll">
                <div className="step-number">{index + 1}</div>
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

      {/* Why Choose Us */}
      <section className="why-choose-section section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Why Choose Fast Multimedia</h2>
            <p className="section-subtitle">
              What sets us apart in the competitive world of design and tech
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-award"></i>
              </div>
              <h3 className="feature-title">6 Years of Experience</h3>
              <p className="feature-description">
                With over 6 years in business, we bring proven expertise to every project.
              </p>
            </div>
            
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="feature-title">Dedicated Team</h3>
              <p className="feature-description">
                Our skilled professionals are committed to your success from start to finish.
              </p>
            </div>
            
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <h3 className="feature-title">Fast Turnaround</h3>
              <p className="feature-description">
                We deliver quality work efficiently without compromising on excellence.
              </p>
            </div>
            
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-description">
                Round-the-clock technical support for all your business needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta section">
        <div className="container">
          <div className="cta-content animate-on-scroll">
            <h2 className="cta-title">Ready to Work With Us?</h2>
            <p className="cta-description">
              Whether you need stunning designs, reliable tech support, or both, 
              we're here to help your business succeed.
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary">
                <i className="fas fa-paper-plane"></i> Start a Project
              </Link>
              <Link to="/services" className="btn btn-outline">
                <i className="fas fa-list"></i> View Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;