import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { blogAPI } from '../supabase';
import './ArticlePage.css';

// Utility functions
const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  
  const number = parseInt(num);
  
  if (isNaN(number)) return '0';
  
  if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
  if (number >= 1000) return (number / 1000).toFixed(1) + 'K';
  return number.toString();
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + ' year' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + ' month' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + ' day' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + ' hour' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + ' minute' + (interval > 1 ? 's' : '') + ' ago';
  
  return 'Just now';
};

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

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Load user data first (local storage, fast)
        const savedName = localStorage.getItem('blog_user_name');
        const savedEmail = localStorage.getItem('blog_user_email');
        if (savedName && isMounted) setUserName(savedName);
        if (savedEmail && isMounted) setUserEmail(savedEmail);
        
        // Check if article is saved
        const saved = JSON.parse(localStorage.getItem('blog_saved') || '[]');
        if (isMounted) setIsSaved(saved.includes(id.toString()));
        
        // Run all API calls in parallel
        const [postData, allPosts, postComments] = await Promise.allSettled([
          blogAPI.getPost(id),
          blogAPI.getPosts(),
          blogAPI.getComments(id)
        ]);
        
        if (!isMounted) return;
        
        // Process post data
        if (postData.status === 'fulfilled' && postData.value) {
          const post = postData.value;
          setPost(post);
          
          // Track view - don't wait for this
          blogAPI.trackView(id).then(views => {
            if (isMounted) setViewCount(views || post.views || 0);
          }).catch(() => {
            if (isMounted) setViewCount(post.views || 0);
          });
          
          // Process related posts
          if (allPosts.status === 'fulfilled') {
            const related = allPosts.value
              .filter(p => p.category === post.category && p.id !== post.id)
              .slice(0, 3);
            if (isMounted) setRelatedPosts(related);
          }
        } else {
          throw new Error('Post not found');
        }
        
        // Process comments
        if (postComments.status === 'fulfilled') {
          if (isMounted) setComments(postComments.value || []);
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
        if (isMounted) navigate('/blog');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const handleCommentSubmit = useCallback(async (e) => {
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
    
    if (post) {
      try {
        console.log('Submitting comment for post:', post.id);
        const newCommentObj = await blogAPI.addComment(post.id, commentData);
        
        if (newCommentObj) {
          console.log('Comment added successfully:', newCommentObj);
          
          // Clear the form
          setNewComment('');
          
          // Save user info
          localStorage.setItem('blog_user_name', userName);
          if (userEmail) localStorage.setItem('blog_user_email', userEmail);
          
          // Refresh comments list
          const updatedComments = await blogAPI.getComments(post.id);
          setComments(updatedComments);
          
          // Update post to get new comment count
          const updatedPost = await blogAPI.getPost(post.id, true); // Force refresh
          setPost(updatedPost);
          
          // Show success message
          alert('Comment posted successfully!');
        } else {
          alert('Failed to post comment. Please try again.');
        }
      } catch (error) {
        console.error('Error adding comment:', error);
        alert('Error posting comment. Please try again.');
      }
    }
  }, [newComment, userName, userEmail, post]);

  const handleLikeComment = useCallback(async (commentId) => {
    try {
      await blogAPI.likeComment(commentId);
      
      // Refresh comments
      const updatedComments = await blogAPI.getComments(post.id);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  }, [post]);

  const handleSaveArticle = useCallback(() => {
    if (post) {
      const saved = JSON.parse(localStorage.getItem('blog_saved') || '[]');
      
      if (isSaved) {
        const newSaved = saved.filter(savedId => savedId !== post.id.toString());
        localStorage.setItem('blog_saved', JSON.stringify(newSaved));
        setIsSaved(false);
        alert('Article removed from saved articles');
      } else {
        saved.push(post.id.toString());
        localStorage.setItem('blog_saved', JSON.stringify(saved));
        setIsSaved(true);
        alert('Article saved to your reading list!');
      }
    }
  }, [post, isSaved]);

  const handleReplySubmit = useCallback(async (commentId) => {
    if (!replyText.trim()) {
      alert('Please enter a reply');
      return;
    }
    
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    const targetComment = comments.find(c => c.id === commentId);
    const replyData = {
      user: userName,
      email: userEmail || 'anonymous@example.com',
      text: `@${targetComment?.author_name || 'User'}: ${replyText}`,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    
    if (post) {
      try {
        await blogAPI.addComment(post.id, replyData);
        setReplyTo(null);
        setReplyText('');
        
        // Refresh comments
        const updatedComments = await blogAPI.getComments(post.id);
        setComments(updatedComments);
        
        alert('Reply posted successfully!');
      } catch (error) {
        console.error('Error adding reply:', error);
        alert('Failed to post reply. Please try again.');
      }
    }
  }, [replyText, userName, userEmail, comments, post]);

  const handleShare = useCallback((platform) => {
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
  }, [post]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Function to get category display name
  const getCategoryDisplayName = useCallback((category) => {
    if (!category) return 'General';
    return category.charAt(0).toUpperCase() + category.slice(1);
  }, []);

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
              {getCategoryDisplayName(post.category)}
            </span>
            <h1 className="article-title">{post.title}</h1>
            
            <div className="article-meta">
              <div className="author-info">
                <img 
                  src={post.author_avatar} 
                  alt={post.author} 
                  className="author-avatar" 
                  loading="lazy"
                />
                <div>
                  <h4>{post.author}</h4>
                  <p>{post.user_role === 'admin' ? 'Administrator' : 'Regular User'}</p>
                </div>
              </div>
              
              <div className="meta-details">
                <span><i className="far fa-calendar"></i> {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <span><i className="far fa-clock"></i> {post.readTime}</span>
                <span><i className="far fa-eye"></i> {formatNumber(viewCount)} views</span>
                <span><i className="far fa-comment"></i> {post.comments || 0} comments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container article-content-wrapper">
        <article className="article-main">
          {/* Featured Image */}
          <div className="article-featured-image">
            <img 
              src={post.image_url} 
              alt={post.title} 
              loading="lazy"
            />
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
              <img 
                src={post.author_avatar} 
                alt={post.author} 
                loading="lazy"
              />
              <div>
                <h3>About {post.author}</h3>
                <p>{post.user_role === 'admin' ? 'Administrator' : 'Regular User'}</p>
              </div>
            </div>
            <div className="author-social">
              <a href="#" title="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" title="LinkedIn"><i className="fab fa-linkedin"></i></a>
              <a href="#" title="Website"><i className="fas fa-globe"></i></a>
            </div>
            <p className="author-description">
              {post.author} is a {post.user_role === 'admin' ? 'site administrator' : 'contributor'} who has shared this post. 
              {post.user_role === 'admin' ? ' As an administrator, they help manage content and ensure the best experience for all readers.' : ' They enjoy sharing knowledge and insights with the community.'}
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
                      <img 
                        src={comment.avatar_url} 
                        alt={comment.author_name} 
                        loading="lazy"
                      />
                      <div>
                        <h4>{comment.author_name}</h4>
                        <span className="comment-time">
                          <TimeAgo date={comment.created_at} />
                        </span>
                      </div>
                    </div>
                    <p>{comment.content}</p>
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
                          placeholder={`Reply to ${comment.author_name}...`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows="2"
                        />
                        <div className="reply-actions">
                          <button 
                            onClick={() => handleReplySubmit(comment.id)}
                            className="submit-reply-btn"
                          >
                            <i className="fas fa-paper-plane"></i> Post Reply
                          </button>
                          <button 
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
                  <span className="stat-number">{new Date(post.created_at).getFullYear()}</span>
                  <span className="stat-label">Published</span>
                </div>
              </div>
              <div className="stat">
                <i className="far fa-clock"></i>
                <div>
                  <span className="stat-number">{post.readTime?.replace(' min read', '') || '5'}</span>
                  <span className="stat-label">Min Read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="sidebar-widget related-articles">
            <h3>Related Articles</h3>
            {relatedPosts.length > 0 ? (
              relatedPosts.map(relatedPost => (
                <div 
                  key={relatedPost.id} 
                  className="related-article" 
                  onClick={() => {
                    navigate(`/blog/${relatedPost.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <img 
                    src={relatedPost.image_url} 
                    alt={relatedPost.title} 
                    loading="lazy"
                  />
                  <div>
                    <h4>{relatedPost.title}</h4>
                    <div className="related-meta">
                      <span>{new Date(relatedPost.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span>•</span>
                      <span>{relatedPost.readTime}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-related">No related articles found.</p>
            )}
          </div>

          {/* Newsletter Widget */}
          <div className="sidebar-widget newsletter-widget">
            <h3>Get More Insights</h3>
            <p>Subscribe to receive the latest articles and resources.</p>
            <form className="sidebar-newsletter-form" onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.querySelector('input[type="email"]').value;
              if (email) {
                const subscriptions = JSON.parse(localStorage.getItem('blog_subscriptions') || '[]');
                if (!subscriptions.includes(email)) {
                  subscriptions.push(email);
                  localStorage.setItem('blog_subscriptions', JSON.stringify(subscriptions));
                  alert(`Thank you for subscribing with: ${email}`);
                  e.target.reset();
                } else {
                  alert('You are already subscribed!');
                }
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
          <button 
            className="nav-btn prev" 
            onClick={() => {
              navigate('/blog');
            }}
          >
            <i className="fas fa-arrow-left"></i>
            <div>
              <span>Back to Blog</span>
              <h4>All Articles</h4>
            </div>
          </button>
          
          {post.id < 10 && (
            <button 
              className="nav-btn next" 
              onClick={async () => {
                const allPosts = await blogAPI.getPosts();
                const currentIndex = allPosts.findIndex(p => p.id === post.id);
                if (currentIndex < allPosts.length - 1) {
                  navigate(`/blog/${allPosts[currentIndex + 1].id}`);
                  window.scrollTo(0, 0);
                }
              }}
            >
              <div>
                <span>Next Article</span>
                <h4>Read Next</h4>
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