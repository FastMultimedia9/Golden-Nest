import React, { useEffect } from 'react';
import './PolicyPages.css';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <div className="policy-hero">
        <div className="container">
          <div className="policy-hero-content">
            <h1 className="policy-title">Terms of Service</h1>
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
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using fastmultimedia.com (the "Site") and the services provided 
              by Fast Multimedia ("we," "us," or "our"), you agree to be bound by these Terms 
              of Service. If you disagree with any part of these terms, you may not access 
              our Site or use our services.
            </p>
          </div>

          <div className="policy-section">
            <h2>2. Services Description</h2>
            <p>
              Fast Multimedia provides graphic design and technical support services including 
              but not limited to:
            </p>
            <ul>
              <li>Brand identity design (logos, branding, etc.)</li>
              <li>UI/UX design for websites and applications</li>
              <li>Print and packaging design</li>
              <li>Social media graphics and marketing materials</li>
              <li>Computer repair and maintenance</li>
              <li>Software installation and support</li>
              <li>Networking solutions</li>
              <li>Computer system management</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>3. Client Responsibilities</h2>
            <p>As a client, you agree to:</p>
            <ul>
              <li>Provide accurate and complete project information</li>
              <li>Respond to requests for feedback in a timely manner</li>
              <li>Provide all necessary materials and information for project completion</li>
              <li>Make timely payments as agreed in project proposals</li>
              <li>Respect intellectual property rights</li>
              <li>Use our services for lawful purposes only</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>4. Pricing and Payments</h2>
            <h3>4.1 Quotes and Estimates</h3>
            <p>
              All quotes and estimates are valid for 30 days from the date of issue. Prices 
              are subject to change based on project scope modifications.
            </p>

            <h3>4.2 Payment Terms</h3>
            <ul>
              <li>A 50% deposit is required to begin work on most projects</li>
              <li>Final payment is due upon project completion</li>
              <li>Payment methods: Mobile money, bank transfer, or other agreed methods</li>
              <li>Late payments may incur additional fees</li>
            </ul>

            <h3>4.3 Refunds</h3>
            <p>
              Deposits are non-refundable once work has commenced. Refund requests for completed 
              work will be considered on a case-by-case basis.
            </p>
          </div>

          <div className="policy-section">
            <h2>5. Project Timeline and Deliverables</h2>
            <h3>5.1 Timeline</h3>
            <p>
              Project timelines will be provided in writing. While we strive to meet all 
              deadlines, we cannot guarantee completion dates due to factors beyond our control.
            </p>

            <h3>5.2 Revisions</h3>
            <p>
              Each project includes a specified number of revision rounds. Additional revisions 
              may incur extra charges.
            </p>

            <h3>5.3 Final Deliverables</h3>
            <p>
              Upon final payment, we will deliver all project files in agreed formats. You are 
              responsible for backing up and securing all delivered files.
            </p>
          </div>

          <div className="policy-section">
            <h2>6. Intellectual Property</h2>
            <h3>6.1 Client Materials</h3>
            <p>
              You retain ownership of all materials you provide to us. You grant us a license 
              to use these materials solely for the purpose of completing your project.
            </p>

            <h3>6.2 Our Work</h3>
            <p>
              Upon full payment, you receive ownership rights to the final delivered work, 
              excluding any stock images, fonts, or third-party materials that require separate 
              licensing.
            </p>

            <h3>6.3 Portfolio Rights</h3>
            <p>
              We reserve the right to display completed work in our portfolio and marketing 
              materials, unless otherwise agreed in writing.
            </p>
          </div>

          <div className="policy-section">
            <h2>7. Confidentiality</h2>
            <p>
              We will keep all client information confidential unless required by law to 
              disclose it. We may sign non-disclosure agreements for sensitive projects.
            </p>
          </div>

          <div className="policy-section">
            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Fast Multimedia shall not be liable for 
              any indirect, incidental, special, consequential, or punitive damages resulting 
              from your use of our services.
            </p>
          </div>

          <div className="policy-section">
            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Fast Multimedia and its employees from 
              any claims, damages, or expenses arising from your use of our services or 
              violation of these terms.
            </p>
          </div>

          <div className="policy-section">
            <h2>10. Termination</h2>
            <p>
              Either party may terminate a project with written notice. Upon termination, 
              you will pay for work completed up to the termination date.
            </p>
          </div>

          <div className="policy-section">
            <h2>11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of 
              Ghana, without regard to its conflict of law provisions.
            </p>
          </div>

          <div className="policy-section">
            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of our 
              services after changes constitutes acceptance of the new terms.
            </p>
          </div>

          <div className="policy-section">
            <h2>13. Contact Information</h2>
            <div className="contact-info">
              <p><strong>Fast Multimedia</strong></p>
              <p>Kpong, Tema Akosombo Road</p>
              <p>Email: fasttech227@gmail.com</p>
              <p>Phone: +233 505-159-131 / +233 548-890-306</p>
              <p>Business Hours: Monday - Friday, 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;