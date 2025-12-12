import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getViews, getPopularPosts, formatNumber } from '../utils/blogStorage';
import './BlogPage.css';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [popularPosts, setPopularPosts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const navigate = useNavigate();

  const authorInfo = {
    name: "Alex Johnson",
    bio: "Tech & Design Specialist",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop",
    social: {
      twitter: "#",
      linkedin: "#",
      dribbble: "#"
    }
  };

  // Initial blog posts data
  const initialPosts = [
    {
      id: 1,
      title: 'Top Web Design Trends for 2025',
      excerpt: 'As web design and its best practices are ever-evolving, web designers need to constantly adapt to new challenges and opportunities.',
      category: 'design',
      date: 'Mar 15, 2024',
      readTime: '5 min read',
      image: 'https://www.hostinger.com/in/tutorials/wp-content/uploads/sites/52/2023/06/Website-Development-alt-1.jpg',
      featured: true,
      content: 'Full article content here...'
    },
    {
      id: 2,
      title: 'Building Scalable React Applications',
      excerpt: 'Learn best practices for creating maintainable and scalable React applications.',
      category: 'development',
      date: 'Mar 10, 2024',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
      featured: false,
      content: 'Full article content here...'
    },
    {
      id: 3,
      title: 'Color Psychology in Branding',
      excerpt: 'How colors influence consumer behavior and brand perception.',
      category: 'design',
      date: 'Mar 5, 2024',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop',
      featured: false,
      content: 'Full article content here...'
    },
    {
      id: 4,
      title: 'Optimizing Website Performance',
      excerpt: 'Essential techniques to improve your website loading speed and performance.',
      category: 'development',
      date: 'Feb 28, 2024',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
      featured: false,
      content: 'Full article content here...'
    },
    {
      id: 5,
      title: 'UI/UX Principles for Mobile Apps',
      excerpt: 'Key design principles that enhance mobile user experiences.',
      category: 'design',
      date: 'Feb 20, 2024',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop',
      featured: false,
      content: 'Full article content here...'
    },
    {
      id: 6,
      title: 'Introduction to API Integration',
      excerpt: 'A beginner guide to integrating third-party APIs in your applications.',
      category: 'development',
      date: 'Feb 15, 2024',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop',
      featured: false,
      content: 'Full article content here...'
    },
    {
      id: 7,
      title: 'JavaScript Frameworks Comparison 2024',
      excerpt: 'React vs Vue vs Angular: Which framework should you choose?',
      category: 'development',
      date: 'Feb 10, 2024',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop',
      featured: false,
      content: 'Full article content here...'
    },
    {
      id: 8,
      title: 'Typography Principles for Web Design',
      excerpt: 'Master the art of typography to enhance readability and user experience.',
      category: 'design',
      date: 'Feb 5, 2024',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop',
      featured: false,
      content: 'Full article content here...'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Articles', count: initialPosts.length },
    { id: 'design', name: 'Design', count: initialPosts.filter(p => p.category === 'design').length },
    { id: 'development', name: 'Development', count: initialPosts.filter(p => p.category === 'development').length },
    { id: 'business', name: 'Business', count: 0 }
  ];

  useEffect(() => {
    // Load popular posts
    const popular = getPopularPosts(initialPosts);
    setPopularPosts(popular);
    
    // Load view counts for all posts
    const postsWithViews = initialPosts.map(post => ({
      ...post,
      views: getViews(post.id) || 0,
      comments: 0 // This would come from your comments storage
    }));
    
    setBlogPosts(postsWithViews);
  }, []);

  const handleReadMore = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Filter posts based on search query
      const filtered = initialPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Update blog posts with search results
      const postsWithViews = filtered.map(post => ({
        ...post,
        views: getViews(post.id) || 0
      }));
      
      setBlogPosts(postsWithViews);
      setActiveCategory('all');
    } else {
      // Reset to all posts
      const postsWithViews = initialPosts.map(post => ({
        ...post,
        views: getViews(post.id) || 0
      }));
      setBlogPosts(postsWithViews);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    
    if (categoryId === 'all') {
      const postsWithViews = initialPosts.map(post => ({
        ...post,
        views: getViews(post.id) || 0
      }));
      setBlogPosts(postsWithViews);
    } else {
      const filtered = initialPosts.filter(post => post.category === categoryId);
      const postsWithViews = filtered.map(post => ({
        ...post,
        views: getViews(post.id) || 0
      }));
      setBlogPosts(postsWithViews);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    if (email) {
      // Save to localStorage
      const subscriptions = JSON.parse(localStorage.getItem('blog_subscriptions') || '[]');
      if (!subscriptions.includes(email)) {
        subscriptions.push(email);
        localStorage.setItem('blog_subscriptions', JSON.stringify(subscriptions));
        alert(`Thank you for subscribing with: ${email}\n\nYou'll receive our latest updates.`);
        e.target.reset();
      } else {
        alert('You are already subscribed!');
      }
    }
  };

  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="container">
          <h1 className="blog-title">Insights & Resources</h1>
          <p className="blog-subtitle">
            Latest trends, tips, and insights about design, development, and digital strategy.
          </p>
          
          {/* Search Bar */}
          <div className="blog-search">
            <form onSubmit={handleSearch} className="search-wrapper">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search articles, tutorials, and resources..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">Search</button>
            </form>
          </div>
        </div>
      </section>

      <div className="container blog-layout">
        <div className="blog-main">
          {/* Featured Post */}
          {featuredPost && (
            <section className="featured-post">
              <div className="container">
                <div className="featured-post-card">
                  <div className="featured-post-image">
                    <img src={featuredPost.image} alt={featuredPost.title} />
                    <div className="featured-badge">Featured</div>
                  </div>
                  <div className="featured-post-content">
                    <div className="post-meta">
                      <span className={`post-category ${featuredPost.category}`}>
                        {featuredPost.category.charAt(0).toUpperCase() + featuredPost.category.slice(1)}
                      </span>
                      <span className="post-date">{featuredPost.date}</span>
                    </div>
                    <h2>{featuredPost.title}</h2>
                    <p>{featuredPost.excerpt}</p>
                    
                    {/* Post Stats */}
                    <div className="post-stats">
                      <span><i className="fas fa-eye"></i> {formatNumber(featuredPost.views)} views</span>
                      <span><i className="far fa-clock"></i> {featuredPost.readTime}</span>
                    </div>
                    
                    {/* Author Info */}
                    <div className="post-author">
                      <img src={authorInfo.avatar} alt={authorInfo.name} />
                      <div>
                        <h4>{authorInfo.name}</h4>
                        <p>{authorInfo.bio}</p>
                        <div className="author-social">
                          <a href={authorInfo.social.twitter}><i className="fab fa-twitter"></i></a>
                          <a href={authorInfo.social.linkedin}><i className="fab fa-linkedin"></i></a>
                          <a href={authorInfo.social.dribbble}><i className="fab fa-dribbble"></i></a>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="read-more-btn"
                      onClick={() => handleReadMore(featuredPost.id)}
                    >
                      Read Article <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Blog Content */}
          <section className="blog-content">
            <div className="container">
              {/* Categories Header */}
              <div className="blog-header">
                <div className="blog-categories">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.name}
                      <span className="category-count">({category.count})</span>
                    </button>
                  ))}
                </div>
                
                {/* Sort Options */}
                <div className="sort-options">
                  <span>Sort by:</span>
                  <select 
                    className="sort-select" 
                    defaultValue="newest"
                    onChange={(e) => {
                      const sortedPosts = [...blogPosts];
                      if (e.target.value === 'newest') {
                        sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
                      } else if (e.target.value === 'popular') {
                        sortedPosts.sort((a, b) => b.views - a.views);
                      } else if (e.target.value === 'oldest') {
                        sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
                      }
                      setBlogPosts(sortedPosts);
                    }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Blog Grid */}
              {filteredPosts.length > 0 ? (
                <>
                  <div className="blog-grid">
                    {filteredPosts
                      .filter(post => !post.featured)
                      .map(post => (
                      <div key={post.id} className="blog-card">
                        <div className="blog-card-image">
                          <img src={post.image} alt={post.title} />
                          <div className="category-tag">{post.category}</div>
                        </div>
                        <div className="blog-card-content">
                          <div className="post-meta">
                            <span className="post-date">{post.date}</span>
                            <span className="post-read-time">{post.readTime}</span>
                          </div>
                          <h3>{post.title}</h3>
                          <p>{post.excerpt}</p>
                          
                          {/* Post Stats */}
                          <div className="post-stats">
                            <span><i className="fas fa-eye"></i> {formatNumber(post.views)} views</span>
                            <span><i className="far fa-clock"></i> {post.readTime}</span>
                          </div>
                          
                          <button 
                            className="read-more-link"
                            onClick={() => handleReadMore(post.id)}
                          >
                            Read More <i className="fas fa-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="pagination">
                    <button className="pagination-btn disabled">← Previous</button>
                    <div className="page-numbers">
                      <span className="active">1</span>
                      <span>2</span>
                      <span>3</span>
                      <span className="ellipsis">...</span>
                      <span>10</span>
                    </div>
                    <button className="pagination-btn">Next →</button>
                  </div>
                </>
              ) : (
                <div className="no-posts">
                  <i className="far fa-newspaper"></i>
                  <h3>No articles found</h3>
                  <p>Try a different search or category</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      handleCategoryClick('all');
                    }}
                    className="reset-btn"
                  >
                    Show All Articles
                  </button>
                </div>
              )}

              {/* Newsletter */}
              <div className="newsletter-section">
                <div className="newsletter-content">
                  <h3>Stay Updated</h3>
                  <p>Get the latest articles and resources delivered to your inbox.</p>
                  <form className="newsletter-form" onSubmit={handleSubscribe}>
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="newsletter-input"
                      required
                    />
                    <button type="submit" className="newsletter-btn">
                      Subscribe <i className="fas fa-paper-plane"></i>
                    </button>
                  </form>
                  <small>Join {formatNumber(JSON.parse(localStorage.getItem('blog_subscriptions') || '[]').length)} subscribers</small>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="blog-sidebar">
          {/* About Author */}
          <div className="sidebar-widget">
            <h3>About the Author</h3>
            <div className="author-widget">
              <img src={authorInfo.avatar} alt="Author" />
              <h4>{authorInfo.name}</h4>
              <p>Senior Designer & Developer with 8+ years experience creating digital solutions for businesses worldwide.</p>
              <button className="follow-btn">
                <i className="fas fa-user-plus"></i> Follow
              </button>
            </div>
          </div>

          {/* Popular Posts - REAL WORKING */}
          <div className="sidebar-widget">
            <h3>Most Popular</h3>
            <div className="popular-posts">
              {popularPosts.length > 0 ? (
                popularPosts.map((post, index) => (
                  <div key={post.id} className="popular-post">
                    <div className="popular-post-rank">{index + 1}</div>
                    <div className="popular-post-content">
                      <h4 onClick={() => handleReadMore(post.id)}>{post.title}</h4>
                      <div className="post-meta">
                        <span><i className="fas fa-eye"></i> {formatNumber(post.views)}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-popular-posts">
                  <p>No popular posts yet. Be the first to read!</p>
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="sidebar-widget">
            <h3>Categories</h3>
            <div className="category-list">
              {categories.slice(1).map(category => (
                <button 
                  key={category.id} 
                  className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span>{category.name}</span>
                  <span className="count">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Views */}
          <div className="sidebar-widget">
            <h3>Recently Viewed</h3>
            <div className="recent-views">
              {(() => {
                const allViews = JSON.parse(localStorage.getItem('blog_views') || '{}');
                const viewedPosts = Object.keys(allViews)
                  .map(id => {
                    const post = initialPosts.find(p => p.id === parseInt(id));
                    if (post) {
                      return {
                        ...post,
                        lastViewed: allViews[id].lastView
                      };
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .sort((a, b) => b.lastViewed - a.lastViewed)
                  .slice(0, 3);

                return viewedPosts.length > 0 ? (
                  viewedPosts.map(post => (
                    <div key={post.id} className="recent-view" onClick={() => handleReadMore(post.id)}>
                      <img src={post.image} alt={post.title} />
                      <div>
                        <h4>{post.title}</h4>
                        <span className="view-time">Viewed recently</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-recent-views">No recent views</p>
                );
              })()}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="sidebar-widget">
            <h3>Weekly Digest</h3>
            <p>Get the top posts delivered weekly:</p>
            <form className="sidebar-newsletter-form" onSubmit={handleSubscribe}>
              <input type="email" placeholder="Your email" required />
              <button type="submit">
                <i className="fas fa-envelope"></i> Subscribe
              </button>
            </form>
          </div>

          {/* Social Links */}
          <div className="sidebar-widget">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" className="social-link twitter">
                <i className="fab fa-twitter"></i>
                <span>Twitter</span>
              </a>
              <a href="#" className="social-link linkedin">
                <i className="fab fa-linkedin"></i>
                <span>LinkedIn</span>
              </a>
              <a href="#" className="social-link dribbble">
                <i className="fab fa-dribbble"></i>
                <span>Dribbble</span>
              </a>
              <a href="#" className="social-link github">
                <i className="fab fa-github"></i>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPage;