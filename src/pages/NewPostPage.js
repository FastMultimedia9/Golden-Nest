import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './NewPostPage.css';

const NewPostPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [postData, setPostData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'general',
    image_url: '',
    theme: 'light',
    published: true,
    featured: false
  });

  const [showFormatHelp, setShowFormatHelp] = useState(false);

  const formatText = (format) => {
    const textarea = document.getElementById('post-content');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = postData.content;
    let formattedText = '';
    
    switch(format) {
      case 'bold':
        formattedText = `**${text.substring(start, end)}**`;
        break;
      case 'italic':
        formattedText = `*${text.substring(start, end)}*`;
        break;
      case 'h1':
        formattedText = `# ${text.substring(start, end)}`;
        break;
      case 'h2':
        formattedText = `## ${text.substring(start, end)}`;
        break;
      case 'link':
        formattedText = `[${text.substring(start, end)}](url)`;
        break;
      case 'list':
        formattedText = `  ${text.substring(start, end)}`;
        break;
      case 'image':
        formattedText = `![alt text](image-url)`;
        break;
      default:
        formattedText = text.substring(start, end);
    }
    
    const newText = text.substring(0, start) + formattedText + text.substring(end);
    setPostData({...postData, content: newText});
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  useEffect(() => {
    checkAuth();
    
    return () => {
      setSubmitError('');
    };
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔐 Checking authentication for NewPostPage...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        navigate('/admin/login');
        return;
      }
      
      if (!session) {
        console.log('No session found, redirecting to login');
        navigate('/admin/login');
        return;
      }
      
      const user = session.user;
      console.log('✅ User authenticated:', user.email);
      setCurrentUser(user);
      
      // Check if user exists in users table
      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error checking user in database:', error);
          
          // User doesn't exist in users table, create them
          console.log('👤 User not found in users table, creating profile...');
          await createUserProfile(user);
          
          setUserRole('user');
          setSubmitError('User profile created. You may need to refresh.');
          return;
        }
        
        console.log('User role:', userData?.role);
        setUserRole(userData?.role || 'user');
        
        if (userData?.role !== 'admin') {
          setSubmitError('Access denied. Admin privileges required.');
          setTimeout(() => navigate('/'), 2000);
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setSubmitError('Error verifying user permissions');
        setTimeout(() => navigate('/'), 2000);
        return;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      navigate('/admin/login');
    }
  };

  const createUserProfile = async (user) => {
    try {
      const { error } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email,
            username: user.email?.split('@')[0] || 'user',
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }
      
      console.log('✅ User profile created successfully');
    } catch (error) {
      console.error('Failed to create user profile:', error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');

    try {
      console.log('🚀 Starting post submission...');
      
      // Validate required fields
      if (!postData.title.trim()) {
        throw new Error('Post title is required');
      }
      
      if (!postData.content.trim()) {
        throw new Error('Post content is required');
      }

      // Check if user is still authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Your session has expired. Please login again.');
      }

      // Ensure user exists in users table
      const { data: userData } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!userData) {
        throw new Error('User profile not found. Please contact administrator.');
      }

      // Prepare post data
      const postToSubmit = {
        title: postData.title.trim(),
        excerpt: postData.excerpt.trim() || (postData.content.trim().substring(0, 150) + '...'),
        content: postData.content.trim(),
        category: postData.category,
        image_url: postData.image_url.trim() || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=800&auto=format&fit=crop`,
        theme: postData.theme,
        views: 0,
        comments_count: 0,
        likes: 0,
        featured: postData.featured,
        published: postData.published,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📝 Submitting post data:', {
        ...postToSubmit,
        content_length: postToSubmit.content.length
      });

      // Insert into posts table
      const { data, error } = await supabase
        .from('posts')
        .insert([postToSubmit])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase insert error:', error);
        
        // Provide specific error messages
        if (error.message.includes('violates foreign key constraint')) {
          throw new Error('User not found in database. Please ensure your account exists in users table.');
        } else if (error.message.includes('permission denied')) {
          throw new Error('Permission denied. Check your Supabase RLS policies.');
        } else if (error.message.includes('network')) {
          throw new Error('Network error. Please check your internet connection.');
        } else if (error.code === '23505') {
          throw new Error('Duplicate post. A post with similar title might already exist.');
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }

      console.log('✅ Post created successfully:', data);
      
      // Show success message
      alert('Post created successfully! Redirecting to admin panel...');
      
      // Clear form
      setPostData({
        title: '',
        excerpt: '',
        content: '',
        category: 'general',
        image_url: '',
        theme: 'light',
        published: true,
        featured: false
      });
      
      // Navigate to admin panel
      navigate('/admin');
      
    } catch (error) {
      console.error('❌ Error creating post:', error);
      setSubmitError(error.message || 'Failed to create post. Please try again.');
      
      // Show error in alert for immediate feedback
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (postData.title || postData.content) {
      if (window.confirm('Are you sure? All unsaved changes will be lost.')) {
        navigate('/admin');
      }
    } else {
      navigate('/admin');
    }
  };

  // Simple loading screen
  if (!currentUser || !userRole) {
    return (
      <div className="admin-panel-loading">
        <div className="loading-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Check if user is admin
  if (userRole !== 'admin') {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Access Denied</h2>
          <p>Admin privileges required to create posts.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="new-post-page">
      <div className="new-post-container">
        <header className="new-post-header">
          <h1>
            <i className="fas fa-plus-circle"></i>
            Create New Post
          </h1>
          <p>Fill in the details below to create a new blog post</p>
        </header>

        {submitError && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="new-post-form">
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="post-title">
                <i className="fas fa-heading"></i> Post Title *
              </label>
              <input
                type="text"
                id="post-title"
                name="title"
                value={postData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
                required
                maxLength="200"
                className="form-input"
                disabled={loading}
                autoComplete="title"
              />
              <small className="char-count">{postData.title.length}/200 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="post-excerpt">
                <i className="fas fa-align-left"></i> Excerpt
              </label>
              <textarea
                id="post-excerpt"
                name="excerpt"
                value={postData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief summary of the post (shown in listings)"
                rows="3"
                maxLength="300"
                className="form-input"
                disabled={loading}
              />
              <small className="char-count">{postData.excerpt.length}/300 characters</small>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group full-width">
              <div className="editor-header">
                <label htmlFor="post-content">
                  <i className="fas fa-edit"></i> Content *
                </label>
                <div className="formatting-buttons">
                  <button 
                    type="button" 
                    onClick={() => formatText('h1')} 
                    title="Heading 1"
                    className="format-btn"
                    disabled={loading}
                  >
                    <i className="fas fa-heading"></i> H1
                  </button>
                  <button 
                    type="button" 
                    onClick={() => formatText('h2')} 
                    title="Heading 2"
                    className="format-btn"
                    disabled={loading}
                  >
                    <i className="fas fa-heading"></i> H2
                  </button>
                  <button 
                    type="button" 
                    onClick={() => formatText('bold')} 
                    title="Bold"
                    className="format-btn"
                    disabled={loading}
                  >
                    <i className="fas fa-bold"></i>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => formatText('italic')} 
                    title="Italic"
                    className="format-btn"
                    disabled={loading}
                  >
                    <i className="fas fa-italic"></i>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => formatText('list')} 
                    title="List"
                    className="format-btn"
                    disabled={loading}
                  >
                    <i className="fas fa-list"></i>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => formatText('link')} 
                    title="Link"
                    className="format-btn"
                    disabled={loading}
                  >
                    <i className="fas fa-link"></i>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => formatText('image')} 
                    title="Image"
                    className="format-btn"
                    disabled={loading}
                  >
                    <i className="fas fa-image"></i>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowFormatHelp(!showFormatHelp)}
                    title="Formatting Help"
                    className="format-btn"
                    disabled={loading}
                  >
                    <i className="fas fa-question-circle"></i>
                  </button>
                </div>
              </div>
              
              <div className="editor-container">
                <textarea
                  id="post-content"
                  name="content"
                  value={postData.content}
                  onChange={handleInputChange}
                  placeholder="Write your post content here... You can use Markdown formatting"
                  rows="15"
                  required
                  className="form-input content-input"
                  disabled={loading}
                />
              </div>
              
              {showFormatHelp && (
                <div className="format-help">
                  <h4><i className="fas fa-info-circle"></i> Markdown Formatting Help:</h4>
                  <ul>
                    <li><code># Heading 1</code></li>
                    <li><code>## Heading 2</code></li>
                    <li><code>**bold text**</code></li>
                    <li><code>*italic text*</code></li>
                    <li><code>  List item</code> (two spaces)</li>
                    <li><code>[link text](url)</code></li>
                    <li><code>![alt text](image-url)</code></li>
                    <li><code>&gt; Blockquote</code></li>
                  </ul>
                </div>
              )}
              
              <small className="char-count">{postData.content.length} characters</small>
            </div>
          </div>

          <div className="form-section grid-2">
            <div className="form-group">
              <label htmlFor="post-category">
                <i className="fas fa-folder"></i> Category
              </label>
              <select
                id="post-category"
                name="category"
                value={postData.category}
                onChange={handleInputChange}
                className="form-select"
                disabled={loading}
              >
                <option value="general">General</option>
                <option value="design">Design</option>
                <option value="development">Development</option>
                <option value="business">Business</option>
                <option value="technology">Technology</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="post-theme">
                <i className="fas fa-palette"></i> Theme
              </label>
              <select
                id="post-theme"
                name="theme"
                value={postData.theme}
                onChange={handleInputChange}
                className="form-select"
                disabled={loading}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="post-image-url">
                <i className="fas fa-image"></i> Featured Image URL
              </label>
              <input
                type="url"
                id="post-image-url"
                name="image_url"
                value={postData.image_url}
                onChange={handleInputChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="form-input"
                disabled={loading}
              />
              {postData.image_url && (
                <div className="image-preview">
                  <img 
                    src={postData.image_url} 
                    alt="Preview" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div className="image-error" style={{ display: 'none' }}>
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>Cannot load image</span>
                  </div>
                </div>
              )}
              <small className="image-help">
                Leave empty for random image or use Unsplash URL
              </small>
            </div>
          </div>

          <div className="form-section">
            <div className="form-checkboxes">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="post-published"
                  name="published"
                  checked={postData.published}
                  onChange={handleInputChange}
                  className="checkbox-input"
                  disabled={loading}
                />
                <label htmlFor="post-published" className="checkbox-label">
                  <span className="checkbox-custom"></span>
                  <i className="fas fa-globe"></i>
                  <span className="checkbox-text">Publish immediately</span>
                </label>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="post-featured"
                  name="featured"
                  checked={postData.featured}
                  onChange={handleInputChange}
                  className="checkbox-input"
                  disabled={loading}
                />
                <label htmlFor="post-featured" className="checkbox-label">
                  <span className="checkbox-custom"></span>
                  <i className="fas fa-star"></i>
                  <span className="checkbox-text">Mark as featured post</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              <i className="fas fa-times"></i> Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || !postData.title || !postData.content}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus-circle"></i> Create Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPostPage;