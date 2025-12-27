import React from 'react';
import './BlogSkeleton.css';

const BlogSkeleton = () => {
  return (
    <div className="blog-skeleton">
      {/* Hero Skeleton */}
      <div className="skeleton-hero">
        <div className="skeleton-title skeleton-animate"></div>
        <div className="skeleton-subtitle skeleton-animate"></div>
        <div className="skeleton-stats">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-stat skeleton-animate"></div>
          ))}
        </div>
        <div className="skeleton-search skeleton-animate"></div>
      </div>
      
      {/* Categories Skeleton */}
      <div className="skeleton-categories">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-category skeleton-animate"></div>
        ))}
      </div>
      
      {/* Posts Grid Skeleton */}
      <div className="skeleton-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-image skeleton-animate"></div>
            <div className="skeleton-content">
              <div className="skeleton-meta skeleton-animate"></div>
              <div className="skeleton-title-sm skeleton-animate"></div>
              <div className="skeleton-text skeleton-animate"></div>
              <div className="skeleton-text-sm skeleton-animate"></div>
              <div className="skeleton-button skeleton-animate"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSkeleton;