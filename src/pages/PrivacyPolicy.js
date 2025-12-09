import React, { useEffect } from 'react';
import './PolicyPages.css';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <div className="policy-hero">
        <div className="container">
          <div className="policy-hero-content">
            <h1 className="policy-title">Privacy Policy</h1>
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
            <h2>1. Introduction</h2>
            <p>
              Fast Multimedia ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you visit our website fastmultimedia.com (the "Site") or use 
              our services. Please read this privacy policy carefully.
            </p>
            <p>
              By accessing or using our Site, you signify that you have read, understood, 
              and agree to our collection, storage, use, and disclosure of your personal 
              information as described in this Privacy Policy.
            </p>
          </div>

          <div className="policy-section">
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us, including:</p>
            <ul>
              <li>Name and contact information (email address, phone number)</li>
              <li>Company name and job title</li>
              <li>Project requirements and specifications</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Communication preferences</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you visit our Site, we may automatically collect certain information, including:</p>
            <ul>
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages you visit and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including:</p>
            <ul>
              <li>To provide and maintain our services</li>
              <li>To process your inquiries and projects</li>
              <li>To communicate with you about your projects</li>
              <li>To send you marketing communications (with your consent)</li>
              <li>To improve our website and services</li>
              <li>To prevent fraudulent activities</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>4. Data Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Service Providers:</strong> Third-party vendors who help us operate our business</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
              <li><strong>With Your Consent:</strong> For any other purpose disclosed with your consent</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </div>

          <div className="policy-section">
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect 
              your personal information. However, no method of transmission over the Internet or 
              electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div className="policy-section">
            <h2>6. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>To exercise these rights, please contact us at fasttech227@gmail.com</p>
          </div>

          <div className="policy-section">
            <h2>7. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the 
              purposes outlined in this Privacy Policy, unless a longer retention period is 
              required or permitted by law.
            </p>
          </div>

          <div className="policy-section">
            <h2>8. Third-Party Links</h2>
            <p>
              Our Site may contain links to third-party websites. We have no control over and 
              assume no responsibility for the content, privacy policies, or practices of any 
              third-party sites or services.
            </p>
          </div>

          <div className="policy-section">
            <h2>9. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 16. We do not 
              knowingly collect personal information from children under 16. If you become aware 
              that a child has provided us with personal information, please contact us.
            </p>
          </div>

          <div className="policy-section">
            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the 
              "Last Updated" date.
            </p>
          </div>

          <div className="policy-section">
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Fast Multimedia</strong></p>
              <p>Kpong, Tema Akosombo Road</p>
              <p>Email: fasttech227@gmail.com</p>
              <p>Phone: +233 505-159-131 / +233 548-890-306</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;