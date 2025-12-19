import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, authAPI, blogAPI } from '../supabase';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-posts');
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const currentUser = await authAPI.getCurrentUserWithProfile();
    
    if (!currentUser) {
      navigate('/login'); // Changed to regular user login
      return;
    }
    
    setUser(currentUser);
    
    // Check if user is admin - redirect to admin panel
    if (currentUser.profile?.role === 'admin') {
      navigate('/admin');
      return;
    }
    
    fetchUserPosts();
  };

  const fetchUserPosts = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Use the correct API function that filters by user_id
      const userPosts = await blogAPI.getPostsByUserId(user.id);
      setPosts(userPosts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    navigate('/');
  };

  const handleCreateNewPost = () => {
    // Navigate to the NewPostPage
    navigate('/user/new-post');
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    
    if (!editingPost || !user?.id) return;
    
    // Verify the user owns this post before updating
    if (editingPost.user_id !== user.id) {
      alert('You can only edit your own posts');
      return;
    }
    
    try {
      const updatedData = {
        ...editingPost,
        updated_at: new Date().toISOString()
      };
      
      const post = await blogAPI.updatePost(editingPost.id, updatedData);
      if (post) {
        alert('Post updated successfully!');
        setEditingPost(null);
        fetchUserPosts(); // Refresh the posts list
        setActiveTab('my-posts');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post: ' + error.message);
    }
  };

  const handleDeletePost = async (id) => {
    // Find the post to verify ownership
    const postToDelete = posts.find(p => p.id === id);
    if (!postToDelete) return;
    
    if (postToDelete.user_id !== user?.id) {
      alert('You can only delete your own posts');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        const success = await blogAPI.deletePost(id);
        if (success) {
          alert('Post deleted successfully!');
          fetchUserPosts(); // Refresh the posts list
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post: ' + error.message);
      }
    }
  };

  const startEditing = (post) => {
    // Verify the user owns this post before allowing edit
    if (post.user_id !== user?.id) {
      alert('You can only edit your own posts');
      return;
    }
    setEditingPost({...post});
    setActiveTab('edit-post');
  };

  // Format number for display (e.g., 1000 becomes 1K)
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    const number = parseInt(num);
    if (isNaN(number)) return '0';
    if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
    if (number >= 1000) return (number / 1000).toFixed(1) + 'K';
    return number.toString();
  };

  // Calculate stats
  const calculateStats = () => {
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const publishedPosts = posts.filter(p => p.published).length;
    
    return {
      totalViews,
      totalComments,
      totalLikes,
      publishedPosts
    };
  };

  const stats = calculateStats();

  if (loading) {
    return <div className="user-loading">Loading your dashboard...</div>;
  }

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="user-header">
        <div className="user-info">
          <div className="user-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div>
            <h1>Welcome, {user?.profile?.name || user?.email}</h1>
            <p>Your Personal Dashboard</p>
          </div>
        </div>
        <div className="user-actions">
          <button 
            className="btn-view-profile"
            onClick={() => navigate('/blog')}
          >
            <i className="fas fa-globe"></i> View Public Blog
          </button>
          <button 
            className="btn-logout"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="user-content">
        {/* Sidebar Navigation */}
        <div className="user-sidebar">
          <nav className="user-nav">
            <button 
              className={`nav-btn ${activeTab === 'my-posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-posts')}
            >
              <i className="fas fa-newspaper"></i> My Posts ({posts.length})
            </button>
            <button 
              className={`nav-btn ${activeTab === 'create-post' ? 'active' : ''}`}
              onClick={handleCreateNewPost}  // Changed to navigate to NewPostPage
            >
              <i className="fas fa-plus-circle"></i> Create New Post
            </button>
            {editingPost && (
              <button 
                className={`nav-btn ${activeTab === 'edit-post' ? 'active' : ''}`}
                onClick={() => setActiveTab('edit-post')}
              >
                <i className="fas fa-edit"></i> Edit Post
              </button>
            )}
            <button 
              className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user-cog"></i> My Profile
            </button>
          </nav>
          
          <div className="user-stats">
            <div className="stat-item">
              <h3>{posts.length}</h3>
              <p>Total Posts</p>
            </div>
            <div className="stat-item">
              <h3>{formatNumber(stats.totalViews)}</h3>
              <p>Total Views</p>
            </div>
            <div className="stat-item">
              <h3>{formatNumber(stats.totalComments)}</h3>
              <p>Total Comments</p>
            </div>
            <div className="stat-item">
              <h3>{stats.publishedPosts}</h3>
              <p>Published</p>
            </div>
            <div className="stat-item">
              <h3>{posts.filter(p => p.featured).length}</h3>
              <p>Featured</p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="user-main">
          {activeTab === 'my-posts' && (
            <div className="my-posts">
              <h2>My Posts</h2>
              {posts.length === 0 ? (
                <div className="no-posts">
                  <i className="fas fa-file-alt"></i>
                  <h3>No posts yet</h3>
                  <p>Create your first post to get started!</p>
                  <button 
                    className="btn-create-first"
                    onClick={handleCreateNewPost}
                  >
                    <i className="fas fa-plus"></i> Create Your First Post
                  </button>
                </div>
              ) : (
                <div className="posts-grid">
                  {posts.map(post => (
                    <div key={post.id} className="post-card">
                      <div className="post-card-header">
                        <span className={`status-badge ${post.published ? 'published' : 'draft'}`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                        {post.featured && (
                          <span className="featured-badge">
                            <i className="fas fa-star"></i> Featured
                          </span>
                        )}
                      </div>
                      <div className="post-card-body">
                        <h3>{post.title}</h3>
                        <p className="post-excerpt">{post.excerpt}</p>
                        <div className="post-meta">
                          <span className="post-category">{post.category}</span>
                          <span className="post-views">
                            <i className="fas fa-eye"></i> {formatNumber(post.views || 0)}
                          </span>
                          <span className="post-comments">
                            <i className="fas fa-comment"></i> {formatNumber(post.comments || 0)}
                          </span>
                          <span className="post-date">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="post-card-actions">
                        <button 
                          className="btn-view"
                          onClick={() => navigate(`/blog/${post.id}`)}
                        >
                          <i className="fas fa-eye"></i> View
                        </button>
                        <button 
                          className="btn-edit"
                          onClick={() => startEditing(post)}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'edit-post' && editingPost && (
            <div className="edit-post">
              <h2>Edit Post</h2>
              <form onSubmit={handleUpdatePost} className="post-form">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Excerpt</label>
                  <textarea
                    value={editingPost.excerpt}
                    onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label>Content *</label>
                  <textarea
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                    rows="10"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={editingPost.category}
                      onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                    >
                      <option value="general">General</option>
                      <option value="design">Design</option>
                      <option value="development">Development</option>
                      <option value="business">Business</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      value={editingPost.image_url}
                      onChange={(e) => setEditingPost({...editingPost, image_url: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        checked={editingPost.published}
                        onChange={(e) => setEditingPost({...editingPost, published: e.target.checked})}
                      />
                      <span>Published</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        checked={editingPost.featured}
                        onChange={(e) => setEditingPost({...editingPost, featured: e.target.checked})}
                      />
                      <span>Featured</span>
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingPost(null);
                      setActiveTab('my-posts');
                    }}
                    className="btn-cancel"
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    <i className="fas fa-save"></i> Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="user-profile">
              <h2>My Profile</h2>
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div>
                    <h3>{user?.profile?.name || 'User'}</h3>
                    <p className="user-email">{user?.email}</p>
                    <p className="user-role">Regular User</p>
                  </div>
                </div>
                
                <div className="profile-details">
                  <div className="detail-item">
                    <label>Username:</label>
                    <span>{user?.profile?.username || 'Not set'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Member since:</label>
                    <span>{new Date(user?.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Posts created:</label>
                    <span>{posts.length}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total views:</label>
                    <span>{formatNumber(stats.totalViews)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total comments:</label>
                    <span>{formatNumber(stats.totalComments)}</span>
                  </div>
                </div>
                
                <div className="profile-actions">
                  <button className="btn-edit-profile">
                    <i className="fas fa-user-edit"></i> Edit Profile
                  </button>
                  <button className="btn-change-password">
                    <i className="fas fa-key"></i> Change Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;