import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './PortfolioCaseStudy.css';

const PortfolioCaseStudy = () => {
  const { projectId } = useParams();
  
  // Sample project data - in real app, fetch based on projectId
  const projects = {
    'santas-workshop': {
      title: "Santa's Workshop Branding",
      category: "Christmas Branding",
      description: "Complete Christmas branding for holiday retail store",
      year: "2023",
      duration: "4 weeks",
      client: "Santa's Workshop Retail",
      image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      stats: [
        { value: "200%", label: "Sales Increase" },
        { value: "85%", label: "Customer Satisfaction" },
        { value: "30%", label: "Social Media Growth" }
      ],
      sections: [
        {
          title: "The Challenge",
          content: "Create a brand identity that captures the magic of Christmas while maintaining professionalism for a retail business that operates year-round. The design needed to work across physical and digital platforms.",
          image: "https://images.unsplash.com/photo-1543470371-128f2246eb72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "The Solution",
          content: "Developed a comprehensive brand system with festive color palette, custom typography, and magical illustrations. Created a versatile logo that works in both full-color and monochrome applications.",
          image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
      ]
    },
    'north-pole-packaging': {
      title: "North Pole Packaging",
      category: "Holiday Packaging",
      description: "Festive packaging designs for Christmas product line",
      year: "2023",
      duration: "3 weeks",
      client: "North Pole Products",
      image: "https://images.unsplash.com/photo-1512386233331-f023884a92e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      stats: [
        { value: "150%", label: "Product Sales" },
        { value: "95%", label: "Customer Feedback" },
        { value: "40%", label: "Repeat Purchases" }
      ]
    },
    'reindeer-games': {
      title: "Reindeer Games Campaign",
      category: "Christmas Marketing",
      description: "Christmas marketing campaign for gaming company",
      year: "2023",
      duration: "5 weeks",
      client: "Reindeer Games Inc.",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      stats: [
        { value: "300%", label: "Engagement Rate" },
        { value: "50K", label: "New Followers" },
        { value: "25%", label: "Conversion Rate" }
      ]
    }
  };

  const project = projects[projectId] || projects['santas-workshop'];

  return (
    <div className="case-study-page">
      {/* Christmas Snowfall */}
      <div className="snowfall">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="snowflake"></div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="case-study-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / 
            <Link to="/portfolio">Portfolio</Link> / 
            <span>{project.title}</span>
          </div>
          
          <div className="hero-content">
            <div className="case-study-badge">
              <span>🎅 Christmas Special Project</span>
            </div>
            <h1 className="case-study-title">{project.title}</h1>
            <p className="case-study-subtitle">{project.description}</p>
            
            <div className="project-meta">
              <div className="meta-item">
                <i className="fas fa-calendar"></i>
                <span>{project.year}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-tags"></i>
                <span>{project.category}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-clock"></i>
                <span>{project.duration}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-user"></i>
                <span>{project.client}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Image */}
      <section className="project-hero-image">
        <div className="container">
          <div className="project-image">
            <img src={project.image} alt={project.title} />
          </div>
        </div>
      </section>

      {/* Project Stats */}
      <section className="project-stats">
        <div className="container">
          <div className="stats-grid">
            {project.stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Sections */}
      {project.sections && project.sections.map((section, index) => (
        <section key={index} className={`project-section ${index % 2 === 1 ? 'reverse' : ''}`}>
          <div className="container">
            <div className="section-content">
              <div className="section-text">
                <h2>{section.title}</h2>
                <p>{section.content}</p>
              </div>
              {section.image && (
                <div className="section-image">
                  <img src={section.image} alt={section.title} />
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="case-study-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Want a Similar Christmas Project?</h2>
            <p>
              Let's create something amazing for your holiday season. 
              Get your free Christmas design consultation today!
            </p>
            <div className="cta-buttons">
              <Link to="/contact?project=christmas" className="btn btn-christmas">
                <i className="fas fa-gift"></i> Get Christmas Quote
              </Link>
              <Link to="/portfolio" className="btn btn-secondary">
                <i className="fas fa-images"></i> View More Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioCaseStudy;