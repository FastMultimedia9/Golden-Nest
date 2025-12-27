import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI, authAPI, formatNumber, clearCache, supabase } from '../supabase';
import BlogSkeleton from '../components/BlogSkeleton';
import './BlogPage.css';

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);
  const navigate = useNavigate();
  
  // Refs for cleanup
  const isMounted = useRef(true);
  const refreshIntervalRef = useRef(null);
  const realtimeSubscriptionRef = useRef(null);

  // Real-time subscription for posts
  const setupRealtimeUpdates = useCallback(() => {
    if (realtimeSubscriptionRef.current) {
      supabase.removeChannel(realtimeSubscriptionRef.current);
    }

    // Subscribe to posts table changes
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        async (payload) => {
          console.log('📡 Realtime update received:', payload.eventType);
          
          // Refresh posts when changes occur
          try {
            const newPosts = await blogAPI.getPosts(true);
            if (isMounted.current && newPosts.length > 0) {
              setBlogPosts(newPosts);
              setLastRefresh(new Date());
            }
          } catch (error) {
            console.log('❌ Error in realtime update:', error.message);
          }
        }
      )
      .subscribe();

    realtimeSubscriptionRef.current = channel;
    return channel;
  }, []);

  // Auto-refresh function
  const autoRefreshPosts = useCallback(async () => {
    if (!isMounted.current || !autoRefreshEnabled) return;
    
    try {
      console.log('🔄 Auto-refreshing posts...');
      const newPosts = await blogAPI.getPosts(true);
      
      if (isMounted.current && newPosts.length > 0) {
        setBlogPosts(newPosts);
        setLastRefresh(new Date());
        setRefreshCount(prev => prev + 1);
      }
    } catch (error) {
      console.log('❌ Auto-refresh failed:', error.message);
      // Don't show error to user for background refresh
    }
  }, [autoRefreshEnabled]);

  // Enhanced fetch data function
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!isMounted.current) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      // Check user
      const user = await authAPI.getCurrentUser();
      if (isMounted.current) setCurrentUser(user);
      
      // Fetch posts
      const posts = await blogAPI.getPosts(forceRefresh);
      
      if (!isMounted.current) return;
      
      if (posts && posts.length > 0) {
        console.log(`✅ Loaded ${posts.length} posts`);
        setBlogPosts(posts);
        setLastRefresh(new Date());
        
        // Fetch comment counts for first 3 posts in background
        setTimeout(async () => {
          if (!isMounted.current) return;
          
          const postsToUpdate = posts.slice(0, 3);
          const updatedPosts = [...posts];
          
          for (let i = 0; i < postsToUpdate.length; i++) {
            try {
              const commentCount = await blogAPI.getCommentsCount(postsToUpdate[i].id);
              if (isMounted.current && commentCount !== undefined) {
                updatedPosts[i] = { 
                  ...updatedPosts[i], 
                  comments_count: commentCount 
                };
                // Update state only once after all counts are fetched
                if (i === postsToUpdate.length - 1) {
                  setBlogPosts(updatedPosts);
                }
              }
            } catch (err) {
              console.log(`Failed to get comment count for post ${postsToUpdate[i].id}:`, err.message);
            }
          }
        }, 100);
      } else {
        setBlogPosts([]);
      }
    } catch (error) {
      console.log('❌ Error loading data:', error.message);
      if (isMounted.current) {
        setError('Failed to load posts. Please try refreshing.');
        setBlogPosts([]);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Initialize and fetch data
  useEffect(() => {
    console.log('🚀 BlogPage mounted - initializing');
    isMounted.current = true;
    
    // Initial data fetch
    fetchData();
    
    // Setup real-time updates
    setupRealtimeUpdates();
    
    // Setup auto-refresh interval (every 10 seconds)
    refreshIntervalRef.current = setInterval(() => {
      if (isMounted.current && autoRefreshEnabled && document.visibilityState === 'visible') {
        autoRefreshPosts();
      }
    }, 10000); // 10 seconds
    
    // Setup heartbeat for real-time connection
    const heartbeatInterval = setInterval(() => {
      if (isMounted.current && realtimeSubscriptionRef.current) {
        // Send a ping to keep connection alive
        supabase.removeChannel(realtimeSubscriptionRef.current);
        setupRealtimeUpdates();
      }
    }, 60000); // Re-establish connection every minute
    
    // Cleanup function
    return () => {
      console.log('🧹 BlogPage cleanup');
      isMounted.current = false;
      
      // Clear intervals
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      clearInterval(heartbeatInterval);
      
      // Remove realtime subscription
      if (realtimeSubscriptionRef.current) {
        supabase.removeChannel(realtimeSubscriptionRef.current);
      }
    };
  }, [fetchData, setupRealtimeUpdates, autoRefreshEnabled, autoRefreshPosts]);

  // Toggle auto-refresh
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefreshEnabled(prev => !prev);
    if (autoRefreshEnabled) {
      console.log('⏸️ Auto-refresh paused');
    } else {
      console.log('▶️ Auto-refresh resumed');
      autoRefreshPosts(); // Refresh immediately when turning on
    }
  }, [autoRefreshEnabled, autoRefreshPosts]);

  // Handle search
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const filtered = blogPosts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setBlogPosts(filtered);
  }, [searchQuery, blogPosts]);

  // Handle category filter
  const handleCategoryClick = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  // Reset filters and refresh
  const resetFilters = useCallback(async () => {
    setSearchQuery('');
    setActiveCategory('all');
    setError('');
    setIsLoading(true);
    
    try {
      await fetchData(true); // Force refresh from server
    } catch (error) {
      console.log('❌ Error resetting filters:', error.message);
      setError('Failed to refresh posts.');
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [fetchData]);

  // Enhanced clear cache function - clears and immediately refreshes
  const handleHardRefresh = useCallback(async () => {
    console.log('🧹 Clearing cache and forcing refresh...');
    
    // Clear cache
    clearCache();
    
    // Immediately refresh posts
    setIsLoading(true);
    try {
      await fetchData(true);
    } catch (error) {
      console.log('❌ Hard refresh failed:', error.message);
      setError('Failed to refresh. Please try again.');
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [fetchData]);

  // Format time since last refresh
  const formatTimeSinceRefresh = useCallback(() => {
    const seconds = Math.floor((new Date() - lastRefresh) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }, [lastRefresh]);

  // Filter posts by category
  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  // Get unique categories from posts
  const getUniqueCategories = useCallback(() => {
    const categories = ['all', 'general', 'design', 'development', 'business'];
    const postCategories = blogPosts.map(post => post.category).filter(Boolean);
    const uniqueCategories = [...new Set([...categories, ...postCategories])];
    
    const categoryCounts = {};
    uniqueCategories.forEach(category => {
      if (category === 'all') {
        categoryCounts[category] = blogPosts.length;
      } else {
        categoryCounts[category] = blogPosts.filter(post => post.category === category).length;
      }
    });
    
    return { uniqueCategories, categoryCounts };
  }, [blogPosts]);

  const { uniqueCategories, categoryCounts } = getUniqueCategories();

  // Loading screen
  if (isLoading && blogPosts.length === 0) {
    return <BlogSkeleton />;
  }

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <div className="blog-hero">
        <div className="blog-container">
          <div className="blog-header-row">
            <div>
              <h1 className="blog-title">Blog Insights</h1>
              <p className="blog-subtitle">Discover the latest articles, trends, and expert insights</p>
            </div>
            
            {/* Live refresh indicator */}
            <div className="blog-live-indicator">
              <div className={`blog-live-dot ${autoRefreshEnabled ? 'live' : 'paused'}`}></div>
              <span className="blog-live-text">
                {autoRefreshEnabled ? 'LIVE' : 'PAUSED'}
              </span>
              <span className="blog-last-refresh">
                Last: {formatTimeSinceRefresh()}
              </span>
              <span className="blog-refresh-count">
                Updates: {refreshCount}
              </span>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="blog-error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error}</span>
              <button onClick={handleHardRefresh} className="blog-retry-btn">
                <i className="fas fa-redo"></i> Retry
              </button>
            </div>
          )}
          
          {/* User status and controls */}
          <div className="blog-controls-bar">
            {currentUser && (
              <div className="blog-user-status">
                <span className="blog-user-badge">
                  <i className="fas fa-user-circle"></i> 
                  {currentUser.email?.split('@')[0] || 'User'}
                </span>
                <button 
                  className="blog-create-post-btn"
                  onClick={() => navigate('/login')}
                >
                  <i className="fas fa-plus"></i> Create Post
                </button>
              </div>
            )}
            
            <div className="blog-refresh-controls">
              <button 
                onClick={toggleAutoRefresh}
                className={`blog-auto-refresh-btn ${autoRefreshEnabled ? 'active' : ''}`}
                title={autoRefreshEnabled ? 'Pause auto-refresh' : 'Enable auto-refresh'}
              >
                <i className={`fas fa-${autoRefreshEnabled ? 'pause' : 'play'}`}></i>
                {autoRefreshEnabled ? ' Pause Updates' : ' Live Updates'}
              </button>
              
              <button 
                onClick={handleHardRefresh}
                className="blog-refresh-now-btn"
                title="Refresh now"
              >
                <i className="fas fa-sync-alt"></i> Refresh Now
              </button>
              
              <button 
                onClick={() => {
                  clearCache();
                  handleHardRefresh();
                }}
                className="blog-clear-cache-btn"
                title="Clear all cache and refresh"
              >
                <i className="fas fa-broom"></i> Clear Cache
              </button>
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="blog-stats-summary">
            <div className="blog-stat-item">
              <i className="fas fa-newspaper"></i>
              <span className="blog-stat-count">{blogPosts.length}</span>
              <span className="blog-stat-label">Total Articles</span>
            </div>
            <div className="blog-stat-item">
              <i className="fas fa-eye"></i>
              <span className="blog-stat-count">
                {formatNumber(blogPosts.reduce((sum, post) => sum + (post.views || 0), 0))}
              </span>
              <span className="blog-stat-label">Total Views</span>
            </div>
            <div className="blog-stat-item">
              <i className="fas fa-comments"></i>
              <span className="blog-stat-count">
                {formatNumber(blogPosts.reduce((sum, post) => sum + (post.comments_count || post.comments || 0), 0))}
              </span>
              <span className="blog-stat-label">Total Comments</span>
            </div>
            <div className="blog-stat-item">
              <i className="fas fa-clock"></i>
              <span className="blog-stat-count">{formatTimeSinceRefresh()}</span>
              <span className="blog-stat-label">Last Update</span>
            </div>
          </div>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="blog-search-form">
            <div className="blog-search-wrapper">
              <i className="fas fa-search blog-search-icon"></i>
              <input
                type="text"
                placeholder="Search articles, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="blog-search-input"
              />
              <button type="submit" className="blog-search-button">
                Search
              </button>
              {(searchQuery || activeCategory !== 'all') && (
                <button 
                  type="button" 
                  onClick={resetFilters}
                  className="blog-clear-button"
                  title="Clear filters"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {/* Categories */}
      <div className="blog-categories-nav">
        <div className="blog-container">
          <div className="blog-categories-scroll">
            {uniqueCategories.map(category => (
              <button 
                key={category}
                className={`blog-category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                <span className="blog-category-name">
                  {category === 'all' ? 'All Posts' : category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <span className="blog-category-count">({categoryCounts[category] || 0})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Blog Posts */}
      <div className="blog-container">
        {filteredPosts.length > 0 ? (
          <>
            <div className="blog-grid">
              {filteredPosts.map((post, index) => (
                <div key={post.id} className="blog-card">
                  <div className="blog-card-image">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="blog-card-img"
                      loading={index < 3 ? "eager" : "lazy"}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&auto=format&fit=crop`;
                      }}
                    />
                    <div className="blog-card-badges">
                      <div className="blog-category-badge">
                        {post.category ? post.category.charAt(0).toUpperCase() + post.category.slice(1) : 'General'}
                      </div>
                      {post.featured && (
                        <div className="blog-featured-badge">
                          <i className="fas fa-star"></i> Featured
                        </div>
                      )}
                    </div>
                    <div className="blog-card-stats-overlay">
                      <div className="blog-card-stat">
                        <i className="fas fa-eye"></i>
                        <span>{formatNumber(post.views || 0)}</span>
                      </div>
                      <div className="blog-card-stat">
                        <i className="fas fa-comment"></i>
                        <span>{formatNumber(post.comments_count || post.comments || 0)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="blog-card-content">
                    <div className="blog-card-meta">
                      <span className="blog-card-date">
                        <i className="far fa-calendar"></i>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="blog-card-read-time">
                        <i className="far fa-clock"></i>
                        {post.readTime || '5 min read'}
                      </span>
                    </div>
                    <h3 className="blog-card-title">{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-author">
                      <i className="fas fa-user-edit"></i>
                      <span>{post.author || 'Author'}</span>
                    </div>
                    <button 
                      className="blog-read-more-button"
                      onClick={() => {
                        // Preload article data
                        setTimeout(() => {
                          blogAPI.getPost(post.id).catch(() => {});
                        }, 50);
                        navigate(`/blog/${post.id}`);
                      }}
                    >
                      <span>Read Article</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Status info */}
            <div className="blog-status-info">
              <div className="blog-status-content">
                <i className="fas fa-info-circle"></i>
                <p>
                  Showing <strong>{filteredPosts.length}</strong> of <strong>{blogPosts.length}</strong> articles • 
                  <span className="blog-database-status">
                    {autoRefreshEnabled ? ' Live Updates' : ' Manual Refresh'}
                  </span>
                  {currentUser ? ' • Logged In' : ' • Guest Mode'} • Last updated: {formatTimeSinceRefresh()}
                </p>
              </div>
              
              <div className="blog-action-buttons">
                <button 
                  onClick={toggleAutoRefresh}
                  className={`blog-auto-toggle-btn ${autoRefreshEnabled ? 'active' : ''}`}
                >
                  <i className={`fas fa-${autoRefreshEnabled ? 'pause-circle' : 'play-circle'}`}></i>
                  {autoRefreshEnabled ? ' Pause Live' : ' Enable Live'}
                </button>
                
                <button 
                  onClick={handleHardRefresh}
                  className="blog-refresh-now-action-btn"
                >
                  <i className="fas fa-sync-alt"></i> Refresh Now
                </button>
                
                <button 
                  onClick={() => {
                    clearCache();
                    handleHardRefresh();
                  }}
                  className="blog-clear-cache-action-btn"
                >
                  <i className="fas fa-broom"></i> Clear Cache
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="blog-no-posts">
            <div className="blog-no-posts-icon">
              <i className="far fa-newspaper"></i>
            </div>
            <h3 className="blog-no-posts-title">No articles found</h3>
            <p className="blog-no-posts-message">
              {searchQuery || activeCategory !== 'all' 
                ? 'Try a different search or category filter'
                : 'Be the first to create a blog post!'}
            </p>
            <div className="blog-no-posts-actions">
              {(searchQuery || activeCategory !== 'all') && (
                <button onClick={resetFilters} className="blog-reset-filters-btn">
                  <i className="fas fa-redo"></i> Reset Filters
                </button>
              )}
              <button onClick={() => navigate('/login')} className="blog-create-post-action-btn">
                <i className="fas fa-pen-fancy"></i> Start Writing
              </button>
              <button onClick={handleHardRefresh} className="blog-refresh-data-btn">
                <i className="fas fa-sync-alt"></i> Refresh Data
              </button>
              <button 
                onClick={() => {
                  clearCache();
                  handleHardRefresh();
                }}
                className="blog-clear-cache-action-btn"
              >
                <i className="fas fa-broom"></i> Clear Cache
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Live refresh indicator (floating) */}
      {autoRefreshEnabled && (
        <div className="blog-live-floating-indicator">
          <div className="blog-live-pulse"></div>
          <span>LIVE UPDATES • Next refresh in: {formatTimeSinceRefresh().replace(' ago', '')}</span>
        </div>
      )}
    </div>
  );
};

export default BlogPage;