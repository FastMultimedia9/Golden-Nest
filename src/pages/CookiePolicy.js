import React, { useEffect } from 'react';
import './PolicyPages.css';

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <div className="policy-hero">
        <div className="container">
          <div className="policy-hero-content">
            <h1 className="policy-title">Cookie Policy</h1>
            <p className="policy-subtitle">
              Last Updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="policy-content section">
        <div className="container">
          <div className="policy-section">
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device 
              when you visit our website. They are widely used to make websites work more 
              efficiently and provide information to the website owners.
            </p>
          </div>

          <div className="policy-section">
            <h2>2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            
            <h3>2.1 Essential Cookies</h3>
            <p>These cookies are necessary for the website to function properly:</p>
            <ul>
              <li>Session management</li>
              <li>Security features</li>
              <li>Load balancing</li>
              <li>Remembering your cookie preferences</li>
            </ul>

            <h3>2.2 Analytical/Performance Cookies</h3>
            <p>These cookies help us understand how visitors interact with our website:</p>
            <ul>
              <li>Counting visitors and traffic sources</li>
              <li>Measuring page performance</li>
              <li>Understanding which pages are popular</li>
              <li>Identifying technical issues</li>
            </ul>

            <h3>2.3 Functionality Cookies</h3>
            <p>These cookies enable enhanced functionality and personalization:</p>
            <ul>
              <li>Remembering your preferences</li>
              <li>Remembering your location for local services</li>
              <li>Providing enhanced features</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>3. Third-Party Cookies</h2>
            <p>We may use third-party services that set their own cookies:</p>
            
            <h3>3.1 Analytics Services</h3>
            <ul>
              <li><strong>Google Analytics:</strong> For website traffic analysis</li>
              <li><strong>Hotjar:</strong> For user behavior analysis</li>
            </ul>

            <h3>3.2 Social Media</h3>
            <ul>
              <li><strong>Facebook Pixel:</strong> For social media analytics</li>
              <li><strong>LinkedIn Insight Tag:</strong> For professional network analytics</li>
            </ul>

            <h3>3.3 Advertising</h3>
            <p>
              We may use advertising cookies to show relevant ads to visitors who have 
              previously visited our website.
            </p>
          </div>

          <div className="policy-section">
            <h2>4. Your Cookie Choices</h2>
            
            <h3>4.1 Browser Settings</h3>
            <p>
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul>
              <li>Delete existing cookies</li>
              <li>Block all or specific cookies</li>
              <li>Set preferences for different websites</li>
              <li>Get notified when cookies are set</li>
            </ul>
            <p>
              Please note that blocking essential cookies may affect website functionality.
            </p>

            <h3>4.2 Our Cookie Consent Tool</h3>
            <p>
              When you first visit our website, you will see a cookie consent banner that 
              allows you to:
            </p>
            <ul>
              <li>Accept all cookies</li>
              <li>Reject non-essential cookies</li>
              <li>Customize your cookie preferences</li>
              <li>Learn more about our cookie usage</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>5. Types of Cookies We Use</h2>
            <div className="cookie-table">
              <table>
                <thead>
                  <tr>
                    <th>Cookie Name</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>session_id</td>
                    <td>Maintain user session</td>
                    <td>Session</td>
                    <td>Essential</td>
                  </tr>
                  <tr>
                    <td>cookie_consent</td>
                    <td>Remember cookie preferences</td>
                    <td>1 year</td>
                    <td>Essential</td>
                  </tr>
                  <tr>
                    <td>_ga</td>
                    <td>Google Analytics</td>
                    <td>2 years</td>
                    <td>Analytical</td>
                  </tr>
                  <tr>
                    <td>_gid</td>
                    <td>Google Analytics</td>
                    <td>24 hours</td>
                    <td>Analytical</td>
                  </tr>
                  <tr>
                    <td>_fbp</td>
                    <td>Facebook Pixel</td>
                    <td>3 months</td>
                    <td>Marketing</td>
                  </tr>
                  <tr>
                    <td>lang</td>
                    <td>Language preference</td>
                    <td>Session</td>
                    <td>Functional</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="policy-section">
            <h2>6. Data Protection</h2>
            <p>
              We take data protection seriously. Cookies that collect personal information 
              are handled in accordance with our Privacy Policy. We implement appropriate 
              security measures to protect your data.
            </p>
          </div>

          <div className="policy-section">
            <h2>7. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of any 
              significant changes by updating the "Last Updated" date and, where appropriate, 
              through a notice on our website.
            </p>
          </div>

          <div className="policy-section">
            <h2>8. Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Fast Multimedia</strong></p>
              <p>Kpong, Tema Akosombo Road</p>
              <p>Email: fasttech227@gmail.com</p>
              <p>Phone: +233 505-159-131 / +233 548-890-306</p>
            </div>
          </div>

          <div className="policy-section">
            <h2>9. Additional Resources</h2>
            <p>For more information about cookies, you can visit:</p>
            <ul>
              <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">All About Cookies</a></li>
              <li><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
              <li><a href="https://www.networkadvertising.org" target="_blank" rel="noopener noreferrer">Network Advertising Initiative</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;