import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
    preferredContact: 'whatsapp',
    includeSocialPack: true,
    agreeToTerms: false
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isChristmasMode, setIsChristmasMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionMethod, setSubmissionMethod] = useState('');
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('');

  const location = useLocation();
  
  // Your contact information
  const whatsappNumber = '233505159131';
  const displayWhatsappNumber = '+233505159131';
  const emailAddress = 'fasttech227@gmail.com';
  
  // Christmas packages mapping
  const christmasPackages = {
    'basic': {
      name: 'Festive Starter',
      price: '$499',
      features: ['Christmas Logo Design', 'Holiday Color Palette', '3 Social Media Templates', 'Email Newsletter Design', '1 Revision']
    },
    'pro': {
      name: 'Merry Marketing',
      price: '$899',
      features: ['Complete Social Media Kit', 'Website Holiday Banner', 'Email Campaign Design', 'Product Packaging Mockup', '3 Revisions']
    },
    'premium': {
      name: 'Santa\'s Workshop',
      price: '$1499',
      features: ['Complete Brand Guidelines', 'Print Materials', 'Animated Social Posts', 'Gift Card Design', 'Unlimited Revisions']
    }
  };
  
  // Auto-fill form based on URL parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const packageType = queryParams.get('package');
    const projectType = queryParams.get('project') || '';
    const packageName = queryParams.get('type') || '';
    
    // Enable Christmas mode for any Christmas-related project
    const christmasKeywords = ['christmas', 'holiday', 'festive', 'xmas'];
    const shouldEnableChristmasMode = christmasKeywords.some(keyword => 
      projectType.toLowerCase().includes(keyword) || packageName.toLowerCase().includes(keyword)
    );
    
    if (shouldEnableChristmasMode) {
      setIsChristmasMode(true);
      
      // Set selected package if provided
      if (packageType && christmasPackages[packageType]) {
        setSelectedPackage(packageType);
        const pkg = christmasPackages[packageType];
        
        // Auto-fill message with package details
        const packageMessage = `I'm interested in the ${pkg.name} Christmas Package (${pkg.price}).\n\nPackage includes:\n${pkg.features.map(f => `• ${f}`).join('\n')}\n\n`;
        
        setFormData(prev => ({
          ...prev,
          projectType: 'Christmas/Holiday Design',
          message: packageMessage + (prev.message || 'Please provide more details about my project requirements...')
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          projectType: 'Christmas/Holiday Design',
          message: prev.message || 'I\'m interested in Christmas design services. Please contact me to discuss my holiday project requirements...'
        }));
      }
    }
    
    // Fill project type from URL
    if (projectType && projectType !== 'undefined') {
      setFormData(prev => ({
        ...prev,
        projectType: decodeURIComponent(projectType)
      }));
    }
  }, [location.search]);

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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Format message for WhatsApp/Email with package info
  const formatMessage = () => {
    const packageInfo = selectedPackage ? 
      `\n🎁 *SELECTED CHRISTMAS PACKAGE:* ${christmasPackages[selectedPackage]?.name} (${christmasPackages[selectedPackage]?.price})` : '';
    
    const packageFeatures = selectedPackage ? 
      `\n✨ *Package Includes:*\n${christmasPackages[selectedPackage]?.features.map(f => `• ${f}`).join('\n')}` : '';
    
    const christmasBonus = isChristmasMode ? 
      '\n🎅 *CHRISTMAS SPECIAL:* 25% holiday discount + free social media pack included!' : '';
    
    return `📋 *NEW CHRISTMAS PROJECT REQUEST* 📋

👤 *Client Information:*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Company: ${formData.company || 'Not provided'}
${packageInfo}${packageFeatures}

🎯 *Project Details:*
• Project Type: ${formData.projectType}
• Budget Range: ${formData.budget || 'Not specified'}
• Timeline: ${formData.timeline || 'Not specified'}
• Preferred Contact: ${formData.preferredContact === 'whatsapp' ? 'WhatsApp' : 'Email'}
${christmasBonus}

📝 *Project Description:*
${formData.message}

📧 *This message was sent via Fast Multimedia Christmas Design Page*
🎄 *Christmas Special Offer Activated* 🎁`;
  };

  // Send via WhatsApp
  const sendViaWhatsApp = () => {
    const message = formatMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Send via Email
  const sendViaEmail = () => {
    const subject = '🎄 Christmas Design Package Request - Fast Multimedia';
    const body = formatMessage();
    const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    if (!formData.name || !formData.email || !formData.phone || !formData.projectType || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    if (formData.preferredContact === 'whatsapp') {
      setSubmissionMethod('whatsapp');
      setTimeout(() => {
        setIsLoading(false);
        sendViaWhatsApp();
        setIsSubmitted(true);
      }, 1000);
    } else {
      setSubmissionMethod('email');
      setTimeout(() => {
        setIsLoading(false);
        sendViaEmail();
        setIsSubmitted(true);
      }, 1000);
    }
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const projectTypes = [
    'Brand Identity Design',
    'Logo Design',
    'UI/UX Design',
    'Website Design',
    'Mobile App Design',
    'Packaging Design',
    'Print Design',
    'Social Media Graphics',
    'Marketing Materials',
    'Christmas/Holiday Design',
    'Event Branding',
    'Business Cards & Stationery',
    'Product Label Design',
    'Digital Advertising',
    'Other'
  ];

  const budgetRanges = [
    'Less than ₵5,000',
    '₵5,000 - ₵10,000',
    '₵10,000 - ₵25,000',
    '₵25,000 - ₵50,000',
    '₵50,000 - ₵100,000',
    '₵100,000+',
    'Not sure yet'
  ];

  const timelines = [
    'Urgent (1-2 weeks)',
    'Standard (3-4 weeks)',
    'Flexible (1-2 months)',
    'Long-term project',
    'Not sure yet'
  ];

  const christmasFeatures = [
    '25% holiday discount on all services',
    'Free festive social media pack',
    'Priority holiday scheduling',
    'Extended support through New Year',
    'Free Christmas branding consultation'
  ];

  const faqs = [
    {
      question: 'How soon will you contact me after I submit my project request?',
      answer: 'We respond to all project requests within 24 hours. For Christmas projects, we provide priority response within 2-4 hours during business hours (9 AM - 6 PM GMT).'
    },
    {
      question: 'What information should I include in my Christmas project description?',
      answer: 'For Christmas projects, include: Your holiday campaign goals, target audience, specific Christmas themes or colors, examples of festive designs you like, timeline expectations (important for holiday deadlines), and any special requirements for Christmas promotions.'
    },
    {
      question: 'How does the 25% Christmas discount work?',
      answer: 'The 25% discount is automatically applied to all Christmas projects. When you select a Christmas package, the discounted price is shown. After you submit your request, we\'ll send you a detailed quote with the discount already applied. Valid for projects starting before December 20th.'
    },
    {
      question: 'Can I customize my Christmas package?',
      answer: 'Absolutely! All our Christmas packages are customizable. After you select a package, we can adjust it to fit your specific needs. Just mention your requirements in the project description, and we\'ll create a custom quote for you.'
    }
  ];

  return (
    <div className={`contact-page ${isChristmasMode ? 'christmas-mode' : ''}`}>
      {/* Christmas Snowfall for Christmas Mode */}
      {isChristmasMode && (
        <div className="snowfall">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.3,
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`
              }}
            />
          ))}
        </div>
      )}

      {/* Hero Section */}
      <section className={`contact-hero section ${isChristmasMode ? 'christmas-hero' : ''}`}>
        <div className="container">
          <div className="hero-content animate-on-scroll">
            {isChristmasMode && (
              <div className="christmas-badge">
                <span>🎄 Christmas Design Package Request 🎁</span>
                {selectedPackage && (
                  <div className="selected-package-badge">
                    <i className="fas fa-gift"></i>
                    <span>{christmasPackages[selectedPackage]?.name} Package Selected</span>
                  </div>
                )}
              </div>
            )}
            <h1 className="contact-title">
              {isChristmasMode ? 'Start Your Christmas Project' : 'Start Your Project'}
            </h1>
            <p className="contact-subtitle">
              {isChristmasMode 
                ? 'Get 25% off Christmas projects! Fill the form and send your project request via WhatsApp or Email.'
                : 'Ready to start your project? Fill the form and send your request via WhatsApp or Email.'}
            </p>
            
            {isChristmasMode && selectedPackage && (
              <div className="selected-package-card">
                <div className="package-header">
                  <h3><i className="fas fa-gift"></i> Selected Package: {christmasPackages[selectedPackage]?.name}</h3>
                  <div className="package-price">{christmasPackages[selectedPackage]?.price}</div>
                </div>
                <div className="package-features">
                  <h4>Package Includes:</h4>
                  <ul>
                    {christmasPackages[selectedPackage]?.features.slice(0, 3).map((feature, index) => (
                      <li key={index}><i className="fas fa-check"></i> {feature}</li>
                    ))}
                    {christmasPackages[selectedPackage]?.features.length > 3 && (
                      <li><i className="fas fa-ellipsis-h"></i> ...and more!</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
            
            {isChristmasMode && (
              <div className="christmas-offer-card">
                <div className="offer-icon">
                  <i className="fas fa-gift"></i>
                </div>
                <div className="offer-content">
                  <h3>🎅 Christmas Special Offer</h3>
                  <p>Limited time: 25% discount + free social media pack on all Christmas projects!</p>
                  <div className="offer-features">
                    {christmasFeatures.slice(0, 3).map((feature, index) => (
                      <span key={index} className="feature-tag">
                        <i className="fas fa-check"></i> {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section section">
        <div className="container">
          <div className="contact-form-wrapper">
            <div className={`form-container ${isChristmasMode ? 'christmas-form' : ''}`}>
              <div className="form-header animate-on-scroll">
                <h2 className="section-title">
                  {isChristmasMode ? '🎄 Christmas Project Request Form' : 'Project Request Form'}
                </h2>
                <p className="section-subtitle">
                  {isChristmasMode 
                    ? 'Your Christmas package details are pre-filled. Complete the form and send it to us!'
                    : 'Fill out your project details and choose how to send it to us'}
                </p>
                
                {isChristmasMode && (
                  <div className="christmas-timeline">
                    <div className="timeline-item">
                      <i className="fas fa-bell"></i>
                      <span>Priority Response</span>
                    </div>
                    <div className="timeline-item">
                      <i className="fas fa-percentage"></i>
                      <span>25% Discount Applied</span>
                    </div>
                    <div className="timeline-item">
                      <i className="fas fa-gift"></i>
                      <span>Free Christmas Bonus</span>
                    </div>
                  </div>
                )}
              </div>

              {isSubmitted ? (
                <div className="success-message animate-on-scroll">
                  <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3 className="success-title">
                    {submissionMethod === 'whatsapp' ? '📱 Opening WhatsApp...' : '📧 Opening Email...'}
                  </h3>
                  <p className="success-text">
                    {submissionMethod === 'whatsapp' 
                      ? 'Your Christmas project request has been prepared! WhatsApp should open with your message ready to send. Please review and send it to us.'
                      : 'Your Christmas project request has been prepared! Your email client should open with your message ready to send. Please review and send it to us.'}
                  </p>
                  
                  {isChristmasMode && (
                    <div className="christmas-bonus">
                      <h4>Your Christmas Package Includes:</h4>
                      <ul>
                        <li><i className="fas fa-check"></i> 25% holiday discount automatically applied</li>
                        <li><i className="fas fa-check"></i> Free social media pack worth $500</li>
                        <li><i className="fas fa-check"></i> Priority holiday scheduling</li>
                        {selectedPackage && (
                          <li><i className="fas fa-check"></i> {christmasPackages[selectedPackage]?.name} package features</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <div className="backup-instructions">
                    <p>
                      <strong>If {submissionMethod === 'whatsapp' ? 'WhatsApp' : 'Email'} didn't open:</strong>
                    </p>
                    <div className="instructions-text">
                      {submissionMethod === 'whatsapp' 
                        ? `1. Open WhatsApp\n2. Start chat with ${displayWhatsappNumber}\n3. Copy and send the prepared message`
                        : `1. Open your email\n2. Send to ${emailAddress}\n3. Use subject: "🎄 Christmas Design Package Request"`}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="btn btn-secondary"
                  >
                    <i className="fas fa-edit"></i> Edit Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form animate-on-scroll">
                  <div className="form-section-header">
                    <h3><i className="fas fa-user"></i> Your Information</h3>
                  </div>
                  
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
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                        required
                        placeholder="Enter your phone number"
                      />
                      <small className="form-hint">For WhatsApp communication</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="company" className="form-label">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Your company name (if applicable)"
                      />
                    </div>
                  </div>

                  <div className="form-section-header">
                    <h3><i className="fas fa-project-diagram"></i> Project Details</h3>
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
                        Budget Range
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

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="timeline" className="form-label">
                        Project Timeline
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select timeline</option>
                        {timelines.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="preferredContact" className="form-label">
                        Send Via *
                      </label>
                      <div className="contact-method-selector">
                        <label className={`method-option ${formData.preferredContact === 'whatsapp' ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="preferredContact"
                            value="whatsapp"
                            checked={formData.preferredContact === 'whatsapp'}
                            onChange={handleChange}
                            required
                          />
                          <div className="option-content">
                            <i className="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                            <small>Instant messaging</small>
                          </div>
                        </label>
                        
                        <label className={`method-option ${formData.preferredContact === 'email' ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="preferredContact"
                            value="email"
                            checked={formData.preferredContact === 'email'}
                            onChange={handleChange}
                            required
                          />
                          <div className="option-content">
                            <i className="fas fa-envelope"></i>
                            <span>Email</span>
                            <small>Formal communication</small>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      Project Description *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="form-textarea"
                      required
                      rows="6"
                      placeholder={isChristmasMode 
                        ? "Describe your Christmas project in detail: goals, requirements, target audience, colors, examples, etc..."
                        : "Describe your project in detail: goals, requirements, target audience, colors, examples, etc..."}
                    ></textarea>
                    <small className="form-hint">
                      Be as detailed as possible. Include any references, examples, or specific requirements.
                      {isChristmasMode && " Your selected package details are already included above."}
                    </small>
                  </div>

                  {isChristmasMode && (
                    <div className="christmas-newsletter">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          name="includeSocialPack"
                          checked={formData.includeSocialPack}
                          onChange={handleChange}
                        />
                        <span>
                          <i className="fas fa-gift"></i> Yes, include the free Christmas social media pack with my project (Value: $500)
                        </span>
                      </label>
                    </div>
                  )}

                  <div className="form-agreement">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        required
                      />
                      <span>
                        I agree that Fast Multimedia can contact me regarding this project request *
                      </span>
                    </label>
                  </div>

                  <div className="form-footer">
                    <button 
                      type="submit" 
                      className={`submit-btn ${isChristmasMode ? 'btn-christmas' : 'btn-primary'}`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Preparing...
                        </>
                      ) : (
                        <>
                          {formData.preferredContact === 'whatsapp' ? (
                            <>
                              <i className="fab fa-whatsapp"></i> Send via WhatsApp
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane"></i> Send via Email
                            </>
                          )}
                        </>
                      )}
                    </button>
                    
                    <div className="form-instructions">
                      <p className="instructions-title">
                        <strong>How it works:</strong>
                      </p>
                      <ol className="instructions-list">
                        <li>Fill out all required fields above</li>
                        <li>Click "{formData.preferredContact === 'whatsapp' ? 'Send via WhatsApp' : 'Send via Email'}"</li>
                        <li>{formData.preferredContact === 'whatsapp' ? 'WhatsApp will open with your project details' : 'Your email client will open with your project details'}</li>
                        <li>Review and send the message to us</li>
                        <li>We'll contact you within 24 hours (Christmas projects: within 4 hours)</li>
                      </ol>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Quick Contact Sidebar */}
            <div className="quick-contact-sidebar">
              <div className="contact-card">
                <h3><i className="fas fa-bolt"></i> Quick Contact</h3>
                <p>Prefer to contact us directly?</p>
                
                <div className="quick-actions">
                  <a 
                    href={`https://wa.me/${whatsappNumber}?text=Hi%20Fast%20Multimedia!%20I%20want%20to%20discuss%20a%20Christmas%20project.`}
                    className="btn btn-whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-whatsapp"></i> Chat on WhatsApp
                  </a>
                  
                  <a 
                    href={`mailto:${emailAddress}?subject=Christmas%20Project%20Inquiry`}
                    className="btn btn-email"
                  >
                    <i className="fas fa-envelope"></i> Send Email
                  </a>
                </div>
                
                <div className="contact-info">
                  <div className="info-item">
                    <i className="fas fa-phone"></i>
                    <div>
                      <strong>Call Us</strong>
                      <span>{displayWhatsappNumber}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <i className="fas fa-clock"></i>
                    <div>
                      <strong>Christmas Response</strong>
                      <span>Within 4 hours</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isChristmasMode && (
                <div className="christmas-features-card">
                  <h3><i className="fas fa-star"></i> Christmas Special</h3>
                  <ul className="features-list">
                    {christmasFeatures.map((feature, index) => (
                      <li key={index}>
                        <i className="fas fa-check-circle"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {selectedPackage && (
                    <div className="selected-package-info">
                      <h4>Selected Package:</h4>
                      <p><strong>{christmasPackages[selectedPackage]?.name}</strong> - {christmasPackages[selectedPackage]?.price}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`faq-section section ${isChristmasMode ? 'christmas-faq' : ''}`}>
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">
              {isChristmasMode ? '🎅 Christmas Project FAQ' : 'Project FAQ'}
            </h2>
            <p className="section-subtitle">
              Common questions about starting a Christmas project with us
            </p>
          </div>

          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item animate-on-scroll ${activeFAQ === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <h3 className="question-title">
                    {faq.question}
                  </h3>
                  <i className={`fas fa-chevron-${activeFAQ === index ? 'up' : 'down'}`}></i>
                </div>
                <div className={`faq-answer ${activeFAQ === index ? 'show' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <div className={`map-placeholder ${isChristmasMode ? 'christmas-map' : ''}`}>
            <i className="fas fa-map-marked-alt"></i>
            <h3>Fast Multimedia Studio</h3>
            <p>Kpong, Tema Akosombo Road</p>
            <div className="contact-buttons">
              <a 
                href={`https://wa.me/${whatsappNumber}?text=Hi%20Fast%20Multimedia!%20I%20saw%20your%20Christmas%20design%20packages.`}
                className="btn btn-small btn-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp"></i> WhatsApp Us
              </a>
              <a 
                href={`mailto:${emailAddress}?subject=Christmas%20Design%20Inquiry`}
                className="btn btn-small btn-email"
              >
                <i className="fas fa-envelope"></i> Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;