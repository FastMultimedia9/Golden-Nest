import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="aboutpage">
      <div className="about-hero">
        <h1>About Golden Nest</h1>
        <p>Where Luxury Meets Comfort</p>
      </div>

      <div className="container">
        <section className="about-content">
          <div className="about-text">
            <h2>Our Story</h2>
            <p>
              Established in 2025, Golden Nest has been redefining luxury hospitality 
              with its exceptional service and world-class amenities. Located in the 
              heart of the Hohoe - Ghana, we offer a sanctuary of peace and elegance.
            </p>
            
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Hotel Lobby" />
          </div>
        </section>

        <section className="values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Excellence</h3>
              <p>We strive for perfection in every detail</p>
            </div>
            <div className="value-card">
              <h3>Hospitality</h3>
              <p>Warm, personalized service for every guest</p>
            </div>
            <div className="value-card">
              <h3>Sustainability</h3>
              <p>Eco-friendly practices for a better future</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>Constantly evolving to exceed expectations</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;