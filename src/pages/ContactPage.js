import React, { useState, useEffect } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        message: ''
      });
    }, 3000);
  };

  const projectTypes = [
    'Brand Identity',
    'UI/UX Design',
    'Web Design',
    'Packaging Design',
    'Print Design',
    'Marketing Materials',
    'Other'
  ];

  const budgetRanges = [
    'Less than $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000+',
    'Not sure yet'
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero section">
        <div className="container animate-on-scroll">
          <h1 className="contact-title">Let's Create Together</h1>
          <p className="contact-subtitle">
            Ready to bring your vision to life? Contact us to discuss your project 
            and get a free consultation.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="contact-info section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card animate-on-scroll">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3 className="info-title">Our Studio</h3>
              <p className="info-text">
                Kpong, Tema Akosombo Road<br />
                Lower Manya Krobo District<br />
                Kpong
              </p>
            </div>

            <div className="info-card animate-on-scroll">
              <div className="info-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <h3 className="info-title">Call Us</h3>
              <p className="info-text">
                (+233) 054-889-0306<br />
                Monday - Sunday, 9am - 6pm PST
              </p>
              <a href="tel:+233 505159131" className="info-link">
                Call Now <i className="fas fa-arrow-right"></i>
              </a>
            </div>

            <div className="info-card animate-on-scroll">
              <div className="info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3 className="info-title">Email Us</h3>
              <p className="info-text">
                fasttech227@gmail.com<br />
                We respond within 24 hours
              </p>
              <a href="mailto:hello@creativestudio.com" className="info-link">
                Send Email <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section section">
        <div className="container">
          <div className="form-container">
            <div className="form-header animate-on-scroll">
              <h2 className="section-title">Start Your Project</h2>
              <p className="section-subtitle">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            {isSubmitted ? (
              <div className="success-message animate-on-scroll">
                <div className="success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3 className="success-title">Thank You!</h3>
                <p className="success-text">
                  Your message has been sent successfully. We'll contact you 
                  within 24 hours to discuss your project.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form animate-on-scroll">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="company" className="form-label">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="projectType" className="form-label">
                      Project Type *
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="budget" className="form-label">
                      Project Budget
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                    required
                    rows="6"
                    placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                  ></textarea>
                </div>

                <div className="form-footer">
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-paper-plane"></i> Send Message
                  </button>
                  <p className="form-note">
                    By submitting this form, you agree to our Privacy Policy.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Get answers to common questions about working with us
            </p>
          </div>

          <div className="faq-grid">
            <div className="faq-item animate-on-scroll">
              <div className="faq-question">
                <h3 className="question-title">What is your design process?</h3>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="faq-answer">
                <p>
                  Our process begins with discovery and research, followed by 
                  strategy development, design execution, and final delivery. 
                  We involve clients at every stage to ensure alignment with 
                  their vision and goals.
                </p>
              </div>
            </div>

            <div className="faq-item animate-on-scroll">
              <div className="faq-question">
                <h3 className="question-title">How long does a project typically take?</h3>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="faq-answer">
                <p>
                  Project timelines vary based on scope and complexity. 
                  A brand identity project typically takes 4-6 weeks, while 
                  website design can take 6-12 weeks. We provide detailed 
                  timelines during our initial consultation.
                </p>
              </div>
            </div>

            <div className="faq-item animate-on-scroll">
              <div className="faq-question">
                <h3 className="question-title">What are your rates?</h3>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="faq-answer">
                <p>
                  We offer both project-based and retainer pricing. Project 
                  costs depend on scope, complexity, and timeline. We provide 
                  detailed proposals after understanding your specific needs 
                  during our initial consultation.
                </p>
              </div>
            </div>

            <div className="faq-item animate-on-scroll">
              <div className="faq-question">
                <h3 className="question-title">Do you work with international clients?</h3>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="faq-answer">
                <p>
                  Yes! We work with clients worldwide. We're experienced in 
                  collaborating across time zones and can accommodate various 
                  communication preferences including video calls and project 
                  management tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <div className="map-placeholder">
            <i className="fas fa-map-marked-alt"></i>
            <h3>Find Our Studio</h3>
            <p>Kpong, Tema Akosombo Road</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;