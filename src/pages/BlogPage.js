import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, blogAPI, formatNumber, authAPI } from '../supabase';
import './BlogPage.css';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [popularPosts, setPopularPosts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState({
    all: 0,
    design: 0,
    development: 0,
    business: 0,
    general: 0
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isMountedRef = useRef(true);

  const authorInfo = {
    name: "Laurie Pressman",
    bio: "Vice President, Pantone Color Institute™",
    avatar: "https://images.ctfassets.net/svmwj4tfnwbc/90gVEDVzZuNfqdwcpN7C8/8f8c0f62087dde525f58ab64eed4771d/headshot-pantone-color-institute-laurie-pressman.webp?w=200&auto=format&fit=crop",
    social: {
      twitter: "#",
      linkedin: "#",
      dribbble: "#"
    }
  };

  const categories = [
    { id: 'all', name: 'All Articles', count: categoryCounts.all },
    { id: 'design', name: 'Design', count: categoryCounts.design },
    { id: 'development', name: 'Development', count: categoryCounts.development },
    { id: 'business', name: 'Business', count: categoryCounts.business },
    { id: 'general', name: 'General', count: categoryCounts.general }
  ];

  const calculateCategoryCounts = (posts) => {
    const counts = {
      all: posts.length,
      design: posts.filter(p => p.category === 'design').length,
      development: posts.filter(p => p.category === 'development').length,
      business: posts.filter(p => p.category === 'business').length,
      general: posts.filter(p => p.category === 'general' || !p.category).length
    };
    setCategoryCounts(counts);
  };

  // ULTRA SIMPLE FETCH FUNCTION
  const fetchPosts = async () => {
    if (!isMountedRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Starting to fetch posts...');
      
      // First, just test if we can get user info
      const user = await authAPI.getCurrentUserWithProfile();
      if (!isMountedRef.current) return;
      
      setCurrentUser(user);
      const role = user?.profile?.role || 'user';
      setUserRole(role);
      console.log('👤 User role detected:', role);
      
      // SIMPLIFIED: Use simple posts first
      console.log('📡 Fetching posts from Supabase...');
      const posts = await blogAPI.getUserPosts(user?.id);
      
      if (!isMountedRef.current) return;
      
      console.log('✅ Posts received:', posts?.length || 0);
      
      if (posts && posts.length > 0) {
        setBlogPosts(posts);
        calculateCategoryCounts(posts);
        
        // Get popular posts
        let popular = [];
        if (role === 'admin') {
          popular = await blogAPI.getPopularPosts(5);
        } else {
          const publishedPosts = posts.filter(p => p.published);
          popular = [...publishedPosts]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);
        }
        setPopularPosts(popular || []);
        
        console.log('🎉 All data loaded successfully!');
      } else {
        console.log('📭 No posts found in database');
        setBlogPosts([]);
        calculateCategoryCounts([]);
        setPopularPosts([]);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      
      console.error('❌ Error fetching posts:', err);
      
      if (err.message.includes('timeout')) {
        setError('Request timeout. The database might be slow or there might be a connection issue.');
      } else {
        setError(`Failed to load posts: ${err.message}`);
      }
      
      setBlogPosts([]);
      calculateCategoryCounts([]);
      setPopularPosts([]);
      
      // Create demo data if database is empty
      console.log('🔄 Creating demo posts...');
      const demoPosts = createDemoPosts();
      setBlogPosts(demoPosts);
      calculateCategoryCounts(demoPosts);
      setPopularPosts(demoPosts.slice(0, 3));
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Create demo posts if database is empty
  const createDemoPosts = () => {
    return [
      {
        id: 1,
        title: "Welcome to the Blog",
        excerpt: "This is a sample post. Create your own posts to see them here!",
        content: "This is sample content. When you create real posts, they will appear here.",
        category: "general",
        image_url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop",
        views: 0,
        comments: 0,
        likes: 0,
        featured: true,
        published: true,
        created_at: new Date().toISOString(),
        readTime: '2 min read',
        author: 'Admin',
        user_id: 'demo'
      },
      {
        id: 2,
        title: "How to Create Your First Post",
        excerpt: "Learn how to create and publish your first blog post on our platform.",
        content: "Detailed instructions on creating posts will go here.",
        category: "development",
        image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
        views: 0,
        comments: 0,
        likes: 0,
        featured: false,
        published: true,
        created_at: new Date().toISOString(),
        readTime: '3 min read',
        author: 'Admin',
        user_id: 'demo'
      }
    ];
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    fetchPosts();
    
    // Subscribe to real-time updates
    try {
      const channel = supabase
        .channel('posts-updates')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'posts' }, 
          () => {
            console.log('🔄 Posts updated, refreshing...');
            if (isMountedRef.current) {
              fetchPosts();
            }
          }
        )
        .subscribe();
      
      console.log('📡 Real-time subscription active');
      
      return () => {
        isMountedRef.current = false;
        supabase.removeChannel(channel);
      };
    } catch (subscribeError) {
      console.warn('⚠️ Real-time subscription error:', subscribeError);
      return () => {
        isMountedRef.current = false;
      };
    }
  }, []);

  // Rest of your component remains the same...
  // [Keep all your existing JSX code from the previous version]
  // Only change was in the fetchPosts function above

  const handleReadMore = async (postId) => {
    try {
      await blogAPI.trackView(postId);
      
      const recentViews = JSON.parse(localStorage.getItem('blog_views') || '{}');
      recentViews[postId] = Date.now();
      localStorage.setItem('blog_views', JSON.stringify(recentViews));
    } catch (error) {
      console.log('Error tracking view:', error);
    }
    navigate(`/blog/${postId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const filtered = blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setBlogPosts(filtered);
      setActiveCategory('all');
    } else {
      fetchPosts();
      setActiveCategory('all');
    }
  };

  const handleCategoryClick = async (categoryId) => {
    setActiveCategory(categoryId);
    setSearchQuery('');
    
    await fetchPosts();
    
    if (categoryId !== 'all') {
      const allPosts = await blogAPI.getUserPosts(currentUser?.id);
      const filtered = allPosts.filter(post => 
        post.category === categoryId || 
        (!post.category && categoryId === 'general')
      );
      setBlogPosts(filtered);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    if (email) {
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
    : blogPosts.filter(post => 
        post.category === activeCategory || 
        (!post.category && activeCategory === 'general')
      );

  const featuredPost = blogPosts.find(post => post.featured && (post.published || userRole === 'admin')) || 
                      (blogPosts.length > 0 ? blogPosts[0] : null);

  const getCategoryDisplayName = (category) => {
    if (!category || category === 'general') return 'General';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (isLoading) {
    return (
      <div className="blog-loading">
        <div className="spinner"></div>
        <p>Loading articles...</p>
        <p className="loading-subtext">Connecting to database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-error">
        <div className="container">
          <i className="fas fa-exclamation-triangle error-icon"></i>
          <h2>Database Connection Issue</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={fetchPosts} className="retry-btn">
              <i className="fas fa-redo"></i> Try Again
            </button>
            <button 
              onClick={() => navigate('/user/dashboard?tab=create-post')}
              className="create-demo-btn"
            >
              <i className="fas fa-plus"></i> Create Your First Post
            </button>
          </div>
          <p className="error-hint">
            If this is your first time, you may need to create some posts first.
          </p>
        </div>
      </div>
    );
  }

  // [Rest of your JSX remains exactly the same...]
  // Return your full JSX structure here
  return (
    <div className="blog-page">
      {/* Your full JSX code from the previous version */}
      {/* I'm showing the structure but keeping it concise */}
      <section className="blog-hero">
        <div className="container">
          <h1 className="blog-title">Insights & Resources</h1>
          <p className="blog-subtitle">
            Latest trends, tips, and insights about design, development, and digital strategy.
          </p>
          
          {currentUser && (
            <div className="user-indicator">
              <span className={`role-badge ${userRole}`}>
                {userRole === 'admin' ? 'Administrator View' : 'Your Posts View'}
              </span>
              {/* ... rest of user indicator */}
            </div>
          )}
          
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
          {/* Featured Post Section */}
          {featuredPost && (
            <section className="featured-post">
              {/* ... featured post content */}
            </section>
          )}

          {/* Blog Content Section */}
          <section className="blog-content">
            {/* ... all your blog content */}
          </section>
        </div>

        <aside className="blog-sidebar">
          {/* ... all your sidebar widgets */}
        </aside>
      </div>
    </div>
  );
};

export default BlogPage;