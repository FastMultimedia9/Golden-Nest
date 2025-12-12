import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  trackView, 
  getViews, 
  addComment, 
  getComments, 
  likeComment, 
  addReply, 
  saveArticle, 
  isArticleSaved,
  removeSavedArticle,
  formatNumber,
  formatTimeAgo
} from '../utils/blogStorage';
import './ArticlePage.css';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [viewCount, setViewCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

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

  // All blog posts data
  const allPosts = [
    {
      id: 1,
      title: 'Top Web Design Trends for 2025',
      excerpt: 'As web design and its best practices are ever-evolving, web designers need to constantly adapt to new challenges and opportunities.',
      category: 'design',
      date: 'Dec. 15, 2025',
      readTime: '5 min read',
      image: 'https://www.hostinger.com/in/tutorials/wp-content/uploads/sites/52/2023/06/Website-Development-alt-1.jpg',
      featured: true,
      content: `
        <h2>The Evolution of Web Design</h2>
        <p>Web design has come a long way from the static pages of the early internet. Today, we're seeing a shift towards more immersive, interactive, and user-centric experiences.</p>
        
        <h3>1. AI-Powered Design Tools</h3>
        <p>Artificial Intelligence is revolutionizing how we create websites. From automated layout generation to personalized content recommendations, AI tools are becoming essential in every designer's toolkit.</p>
        
        <h3>2. Dark Mode Excellence</h3>
        <p>Dark mode isn't just a trend anymore—it's becoming an expectation. Modern implementations focus on accessibility, reduced eye strain, and battery efficiency.</p>
        
        <h3>3. Immersive 3D Elements</h3>
        <p>With advancements in WebGL and Three.js, 3D elements are becoming more accessible and performant. These elements create memorable experiences that engage users.</p>
        
        <h3>4. Micro-interactions & Animation</h3>
        <p>Subtle animations and micro-interactions guide users, provide feedback, and make interfaces feel alive. These details significantly improve user experience.</p>
        
        <h3>5. Accessibility-First Design</h3>
        <p>Designing for accessibility is no longer optional. WCAG 2.2 guidelines are becoming the standard, ensuring websites are usable by everyone.</p>
        
        <h2>Practical Implementation Tips</h2>
        <p>To implement these trends effectively:</p>
        <ul>
          <li>Start with a strong foundation of responsive design</li>
          <li>Prioritize performance optimization</li>
          <li>Test thoroughly across devices</li>
          <li>Collect and analyze user feedback</li>
        </ul>
        
        <blockquote>
          "Good design is obvious. Great design is transparent." – Joe Sparano
        </blockquote>
        
        <p>The key to successful design in 2025 will be balancing innovation with usability, creating experiences that are both cutting-edge and intuitive.</p>
      `
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
      content: `
        <h2>Introduction to Scalable Architecture</h2>
        <p>Building React applications that scale requires careful planning and implementation of best practices from day one.</p>
        
        <h3>1. Project Structure</h3>
        <p>Organize your codebase in a way that scales with your team and feature set. Use feature-based folders and keep related files together.</p>
        
        <h3>2. State Management</h3>
        <p>Choose the right state management solution based on your application's complexity. Consider Context API for simple apps and Redux/Zustand for complex ones.</p>
        
        <h3>3. Performance Optimization</h3>
        <p>Implement code splitting, lazy loading, and proper memoization to ensure your app remains performant as it grows.</p>
        
        <h3>4. Testing Strategy</h3>
        <p>Establish a comprehensive testing strategy including unit tests, integration tests, and end-to-end tests.</p>
      `
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
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Find the current post
      const foundPost = allPosts.find(p => p.id === parseInt(id));
      
      if (foundPost) {
        setPost(foundPost);
        
        // Track view
        const views = trackView(foundPost.id);
        setViewCount(views);
        
        // Check if article is saved
        setIsSaved(isArticleSaved(foundPost.id));
        
        // Find related posts
        const related = allPosts
          .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
          .slice(0, 3);
        setRelatedPosts(related);
        
        // Load comments
        const postComments = getComments(foundPost.id);
        setComments(postComments);
        
        // Load user data if exists
        const savedName = localStorage.getItem('blog_user_name');
        const savedEmail = localStorage.getItem('blog_user_email');
        if (savedName) setUserName(savedName);
        if (savedEmail) setUserEmail(savedEmail);
      } else {
        navigate('/blog');
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [id, navigate]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      alert('Please enter a comment');
      return;
    }
    
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    const commentData = {
      user: userName,
      email: userEmail || 'anonymous@example.com',
      text: newComment,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    
    const newCommentObj = addComment(parseInt(id), commentData);
    
    if (newCommentObj) {
      // Refresh comments
      const updatedComments = getComments(parseInt(id));
      setComments(updatedComments);
      setNewComment('');
      
      // Save user info
      localStorage.setItem('blog_user_name', userName);
      if (userEmail) {
        localStorage.setItem('blog_user_email', userEmail);
      }
    }
  };

  const handleReplySubmit = (commentId) => {
    if (!replyText.trim() || !userName.trim()) {
      alert('Please enter your reply and name');
      return;
    }
    
    const replyData = {
      user: userName,
      text: replyText,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    
    const newReply = addReply(parseInt(id), commentId, replyData);
    
    if (newReply) {
      // Refresh comments
      const updatedComments = getComments(parseInt(id));
      setComments(updatedComments);
      setReplyText('');
      setReplyTo(null);
    }
  };

  const handleLikeComment = (commentId) => {
    const newLikeCount = likeComment(parseInt(id), commentId);
    
    // Update local state
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: newLikeCount }
          : comment
      )
    );
  };

  const handleSaveArticle = () => {
    if (post) {
      if (isSaved) {
        removeSavedArticle(post.id);
        setIsSaved(false);
        alert('Article removed from saved articles');
      } else {
        saveArticle(post.id);
        setIsSaved(true);
        alert('Article saved to your reading list!');
      }
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || 'Check out this article!';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article: ' + url)}`
    };
    
    if (platform === 'email') {
      window.location.href = shareUrls[platform];
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="article-loading">
        <div className="spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="article-not-found">
        <h2>Article Not Found</h2>
        <p>The article you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/blog')} className="back-to-blog-btn">
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="article-page">
      {/* Article Hero */}
      <section className="article-hero">
        <div className="container">
          <button onClick={() => navigate('/blog')} className="back-button">
            <i className="fas fa-arrow-left"></i> Back to Blog
          </button>
          
          <div className="article-header">
            <span className={`article-category ${post.category}`}>
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </span>
            <h1 className="article-title">{post.title}</h1>
            
            <div className="article-meta">
              <div className="author-info">
                <img src={authorInfo.avatar} alt={authorInfo.name} className="author-avatar" />
                <div>
                  <h4>{authorInfo.name}</h4>
                  <p>{authorInfo.bio}</p>
                </div>
              </div>
              
              <div className="meta-details">
                <span><i className="far fa-calendar"></i> {post.date}</span>
                <span><i className="far fa-clock"></i> {post.readTime}</span>
                <span><i className="far fa-eye"></i> {formatNumber(viewCount)} views</span>
                <span><i className="far fa-comment"></i> {comments.length} comments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container article-content-wrapper">
        <article className="article-main">
          {/* Featured Image */}
          <div className="article-featured-image">
            <img src={post.image} alt={post.title} />
          </div>

          {/* Article Actions */}
          <div className="article-actions">
            <div className="action-group">
              <button onClick={() => handleShare('twitter')} className="action-btn">
                <i className="fab fa-twitter"></i> Tweet
              </button>
              <button onClick={() => handleShare('linkedin')} className="action-btn">
                <i className="fab fa-linkedin"></i> Share
              </button>
              <button onClick={handleSaveArticle} className={`action-btn ${isSaved ? 'saved' : ''}`}>
                <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark`}></i> 
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button onClick={handlePrint} className="action-btn">
                <i className="fas fa-print"></i> Print
              </button>
            </div>
            <div className="read-time">
              <i className="far fa-clock"></i> Reading time: {post.readTime}
            </div>
          </div>

          {/* Article Content */}
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Article Tags */}
          <div className="article-tags">
            <span>Tags:</span>
            <button className="tag">Web Design</button>
            <button className="tag">UI/UX</button>
            <button className="tag">Trends 2025</button>
            <button className="tag">Digital Design</button>
          </div>

          {/* Share Section */}
          <div className="share-section">
            <h3>Share this article</h3>
            <div className="share-buttons">
              <button onClick={() => handleShare('twitter')} className="share-btn twitter">
                <i className="fab fa-twitter"></i>
              </button>
              <button onClick={() => handleShare('facebook')} className="share-btn facebook">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button onClick={() => handleShare('linkedin')} className="share-btn linkedin">
                <i className="fab fa-linkedin-in"></i>
              </button>
              <button onClick={() => handleShare('whatsapp')} className="share-btn whatsapp">
                <i className="fab fa-whatsapp"></i>
              </button>
              <button onClick={() => handleShare('email')} className="share-btn email">
                <i className="far fa-envelope"></i>
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }} 
                className="share-btn copy"
              >
                <i className="far fa-copy"></i>
              </button>
            </div>
          </div>

          {/* Author Bio */}
          <div className="author-bio">
            <div className="author-header">
              <img src={authorInfo.avatar} alt={authorInfo.name} />
              <div>
                <h3>About {authorInfo.name}</h3>
                <p>{authorInfo.bio}</p>
              </div>
            </div>
            <div className="author-social">
              <a href={authorInfo.social.twitter}><i className="fab fa-twitter"></i></a>
              <a href={authorInfo.social.linkedin}><i className="fab fa-linkedin"></i></a>
              <a href={authorInfo.social.dribbble}><i className="fab fa-dribbble"></i></a>
            </div>
            <p className="author-description">
              With over 8 years of experience in tech and design, Alex specializes in creating 
              user-centric digital experiences. He has worked with startups and Fortune 500 
              companies alike, focusing on blending aesthetics with functionality.
            </p>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h3>Comments ({comments.length})</h3>
            
            {/* User Info Form */}
            <div className="user-info-form">
              <input
                type="text"
                placeholder="Your name (required)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Your email (optional)"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            
            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="4"
                required
              />
              <div className="comment-form-actions">
                <button type="submit" className="submit-comment-btn">
                  <i className="fas fa-paper-plane"></i> Post Comment
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="comments-list">
              {comments.length === 0 ? (
                <div className="no-comments">
                  <i className="far fa-comments"></i>
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <img src={comment.avatar} alt={comment.user} />
                      <div>
                        <h4>{comment.user}</h4>
                        <span>{formatTimeAgo(comment.timestamp)}</span>
                      </div>
                    </div>
                    <p>{comment.text}</p>
                    <div className="comment-actions">
                      <button 
                        onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                        className="reply-btn"
                      >
                        <i className="fas fa-reply"></i> Reply
                      </button>
                      <button 
                        onClick={() => handleLikeComment(comment.id)}
                        className={`like-btn ${comment.likes > 0 ? 'liked' : ''}`}
                      >
                        <i className={`${comment.likes > 0 ? 'fas' : 'far'} fa-thumbs-up`}></i> 
                        {comment.likes > 0 ? ` ${comment.likes}` : ''}
                      </button>
                    </div>
                    
                    {/* Reply Form */}
                    {replyTo === comment.id && (
                      <div className="reply-form">
                        <textarea
                          placeholder="Write your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows="2"
                        />
                        <div className="reply-form-actions">
                          <button 
                            type="button" 
                            onClick={() => handleReplySubmit(comment.id)}
                            className="submit-reply-btn"
                          >
                            Post Reply
                          </button>
                          <button 
                            type="button" 
                            onClick={() => {
                              setReplyTo(null);
                              setReplyText('');
                            }}
                            className="cancel-reply-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="replies">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="reply">
                            <div className="reply-header">
                              <img src={reply.avatar} alt={reply.user} />
                              <div>
                                <h5>{reply.user}</h5>
                                <span>{formatTimeAgo(reply.timestamp)}</span>
                              </div>
                            </div>
                            <p>{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="article-sidebar">
          {/* Article Stats */}
          <div className="sidebar-widget stats-widget">
            <h3>Article Stats</h3>
            <div className="stats-grid">
              <div className="stat">
                <i className="far fa-eye"></i>
                <div>
                  <span className="stat-number">{formatNumber(viewCount)}</span>
                  <span className="stat-label">Views</span>
                </div>
              </div>
              <div className="stat">
                <i className="far fa-comment"></i>
                <div>
                  <span className="stat-number">{comments.length}</span>
                  <span className="stat-label">Comments</span>
                </div>
              </div>
              <div className="stat">
                <i className="far fa-calendar"></i>
                <div>
                  <span className="stat-number">{post.date.split(' ')[2]}</span>
                  <span className="stat-label">Published</span>
                </div>
              </div>
              <div className="stat">
                <i className="far fa-clock"></i>
                <div>
                  <span className="stat-number">{post.readTime.split(' ')[0]}</span>
                  <span className="stat-label">Min Read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="sidebar-widget related-articles">
            <h3>Related Articles</h3>
            {relatedPosts.map(relatedPost => (
              <div 
                key={relatedPost.id} 
                className="related-article" 
                onClick={() => {
                  navigate(`/blog/${relatedPost.id}`);
                  window.scrollTo(0, 0);
                }}
              >
                <img src={relatedPost.image} alt={relatedPost.title} />
                <div>
                  <h4>{relatedPost.title}</h4>
                  <div className="related-meta">
                    <span>{relatedPost.date}</span>
                    <span>•</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Widget */}
          <div className="sidebar-widget newsletter-widget">
            <h3>Get More Insights</h3>
            <p>Subscribe to receive the latest articles and resources.</p>
            <form className="sidebar-newsletter-form" onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.querySelector('input[type="email"]').value;
              if (email) {
                alert(`Thank you for subscribing with: ${email}`);
                e.target.reset();
              }
            }}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit">
                <i className="fas fa-paper-plane"></i> Subscribe
              </button>
            </form>
            <small>No spam. Unsubscribe anytime.</small>
          </div>

          {/* Popular Tags */}
          <div className="sidebar-widget popular-tags">
            <h3>Popular Tags</h3>
            <div className="tags-list">
              <button className="tag-btn">Web Design</button>
              <button className="tag-btn">Development</button>
              <button className="tag-btn">React</button>
              <button className="tag-btn">UI/UX</button>
              <button className="tag-btn">JavaScript</button>
              <button className="tag-btn">CSS</button>
              <button className="tag-btn">Accessibility</button>
              <button className="tag-btn">Performance</button>
            </div>
          </div>
        </aside>
      </div>

      {/* Next/Previous Navigation */}
      <div className="article-navigation">
        <div className="container">
          {parseInt(id) > 1 && (
            <button 
              className="nav-btn prev" 
              onClick={() => {
                navigate(`/blog/${parseInt(id) - 1}`);
                window.scrollTo(0, 0);
              }}
            >
              <i className="fas fa-arrow-left"></i>
              <div>
                <span>Previous</span>
                <h4>Previous Article</h4>
              </div>
            </button>
          )}
          
          {parseInt(id) < allPosts.length && (
            <button 
              className="nav-btn next" 
              onClick={() => {
                navigate(`/blog/${parseInt(id) + 1}`);
                window.scrollTo(0, 0);
              }}
            >
              <div>
                <span>Next</span>
                <h4>Next Article</h4>
              </div>
              <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;