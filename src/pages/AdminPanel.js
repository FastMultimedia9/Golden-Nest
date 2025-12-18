import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, blogAPI, authAPI } from '../supabase';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'design',
    image_url: '',
    featured: false,
    published: true
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, [navigate]);

  const checkAuthAndLoadData = async () => {
    const user = await authAPI.getCurrentUserWithProfile();
    
    if (!user) {
      navigate('/admin/login');
      return;
    }
    
    setCurrentUser(user);
    
    // Check if user is admin
    if (user.profile?.role !== 'admin') {
      navigate('/user/dashboard');
      return;
    }
    
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Fetch all posts (admin sees everything)
      const { data: postsData } = await supabase
        .from('posts')
        .select(`
          *,
          users:user_id (name, username, email)
        `)
        .order('created_at', { ascending: false });
      
      // Fetch all users (admin only)
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Fetch all comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select(`
          *,
          posts(title),
          users:author_id (name, email)
        `)
        .order('created_at', { ascending: false });
      
      setPosts(postsData || []);
      setUsers(usersData || []);
      setComments(commentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    navigate('/');
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    try {
      const post = await blogAPI.createPost(newPost);
      if (post) {
        alert('Post created successfully!');
        setNewPost({
          title: '',
          excerpt: '',
          content: '',
          category: 'design',
          image_url: '',
          featured: false,
          published: true
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post: ' + error.message);
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const success = await blogAPI.deletePost(id);
        if (success) {
          alert('Post deleted successfully!');
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post: ' + error.message);
      }
    }
  };

  const handleDeleteComment = async (id) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const { error } = await supabase
          .from('comments')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        alert('Comment deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Error deleting comment');
      }
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    if (window.confirm(`Change user role to ${newRole}?`)) {
      try {
        const { error } = await supabase
          .from('users')
          .update({ role: newRole })
          .eq('id', userId);
        
        if (error) throw error;
        
        alert('User role updated successfully!');
        fetchData();
      } catch (error) {
        console.error('Error updating user role:', error);
        alert('Error updating user role');
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Close sidebar on mobile when a tab is clicked
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading admin panel...</div>;
  }

  const userStats = {
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length
  };

  return (
    <div className="admin-panel">
      {/* Mobile Hamburger Button - Only shows on mobile */}
      <button 
        className="hamburger-menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-header">
          <div className="admin-profile">
            <div className="profile-avatar">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="profile-info">
              <h2>Admin Panel</h2>
              <p className="admin-name">{currentUser?.profile?.name || 'Administrator'}</p>
              <p className="admin-email">{currentUser?.profile?.email || currentUser?.email || 'admin@example.com'}</p>
              <small className="admin-badge">
                <i className="fas fa-crown"></i> Administrator
              </small>
            </div>
          </div>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </button>
          <button 
            className={`nav-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => handleTabChange('posts')}
          >
            <i className="fas fa-newspaper"></i> All Posts <span className="badge-count">{posts.length}</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            <i className="fas fa-users"></i> Users <span className="badge-count">{users.length}</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => handleTabChange('comments')}
          >
            <i className="fas fa-comments"></i> Comments <span className="badge-count">{comments.length}</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => handleTabChange('create')}
          >
            <i className="fas fa-plus-circle"></i> Create Post
          </button>
          
          <div className="nav-divider"></div>
          
          <button 
            className="nav-btn logout-btn"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
        
        <div className="admin-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="stat-content">
              <h3>{posts.length}</h3>
              <p>Total Posts</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-user-friends"></i>
            </div>
            <div className="stat-content">
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-comment-dots"></i>
            </div>
            <div className="stat-content">
              <h3>{comments.length}</h3>
              <p>Total Comments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="page-header">
              <h1>Admin Dashboard</h1>
              <p className="dashboard-subtitle">Welcome back, {currentUser?.profile?.name || 'Admin'}! Here's what's happening with your blog.</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <div className="stat-card-content">
                  <h3>{posts.reduce((sum, post) => sum + (post.views || 0), 0)}</h3>
                  <p>Total Views</p>
                  <small>Across all posts</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">
                  <i className="fas fa-comment"></i>
                </div>
                <div className="stat-card-content">
                  <h3>{posts.reduce((sum, post) => sum + (post.comments || 0), 0)}</h3>
                  <p>Total Comments</p>
                  <small>User engagement</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-card-content">
                  <h3>{userStats.totalUsers}</h3>
                  <p>Total Users</p>
                  <small>{userStats.adminUsers} admin, {userStats.regularUsers} regular</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">
                  <i className="fas fa-star"></i>
                </div>
                <div className="stat-card-content">
                  <h3>{posts.filter(p => p.featured).length}</h3>
                  <p>Featured Posts</p>
                  <small>Highlighted content</small>
                </div>
              </div>
            </div>

            <div className="content-grid">
              <div className="recent-posts">
                <div className="section-header">
                  <h2>Recent Posts</h2>
                  <button className="view-all-btn" onClick={() => handleTabChange('posts')}>
                    View All <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Views</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.slice(0, 5).map(post => (
                      <tr key={post.id}>
                        <td className="title-cell">
                          <strong>{post.title}</strong>
                          <small>{post.excerpt?.substring(0, 50)}...</small>
                        </td>
                        <td>
                          <div className="author-cell">
                            <strong>{post.users?.name || 'Unknown'}</strong>
                            <small>{post.users?.email}</small>
                          </div>
                        </td>
                        <td><span className="category-badge">{post.category}</span></td>
                        <td className="views-cell">{post.views}</td>
                        <td className="date-cell">{new Date(post.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="recent-users">
                <div className="section-header">
                  <h2>Recent Users</h2>
                  <button className="view-all-btn" onClick={() => handleTabChange('users')}>
                    View All <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Posts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <strong>{user.name}</strong>
                            <small>{user.username}</small>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="posts-count">{posts.filter(p => p.user_id === user.id).length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="posts-management">
            <div className="page-header">
              <h1>All Posts Management</h1>
              <p className="section-subtitle">View and manage posts from all users</p>
            </div>
            
            <div className="admin-controls">
              <div className="search-filter">
                <div className="search-box">
                  <i className="fas fa-search"></i>
                  <input type="text" placeholder="Search posts by title or author..." />
                </div>
                <select>
                  <option value="">All Users</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                <select>
                  <option value="">All Categories</option>
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="business">Business</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
            
            <div className="posts-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Views</th>
                    <th>Comments</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id}>
                      <td className="title-cell">
                        <strong>{post.title}</strong>
                        <small>{post.excerpt?.substring(0, 50)}...</small>
                      </td>
                      <td>
                        <div className="author-cell">
                          <strong>{post.users?.name || 'Unknown'}</strong>
                          <small>{post.users?.email}</small>
                        </div>
                      </td>
                      <td><span className="category-badge">{post.category}</span></td>
                      <td className="views-cell">{post.views}</td>
                      <td className="comments-cell">{post.comments}</td>
                      <td>
                        <span className={`status-badge ${post.published ? 'published' : 'draft'}`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                        {post.featured && (
                          <span className="featured-badge">
                            <i className="fas fa-star"></i> Featured
                          </span>
                        )}
                      </td>
                      <td className="date-cell">{new Date(post.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-view"
                            onClick={() => navigate(`/blog/${post.id}`)}
                            title="View Post"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="btn-edit"
                            title="Edit Post"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeletePost(post.id)}
                            title="Delete Post"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-management">
            <div className="page-header">
              <h1>User Management</h1>
              <p className="section-subtitle">Manage all user accounts and permissions</p>
            </div>
            
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Posts</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <div className="user-info">
                            <strong>{user.name}</strong>
                            {user.id === currentUser?.id && (
                              <small className="current-user">You</small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                      <td>
                        <div className="role-control">
                          <select 
                            value={user.role}
                            onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                            disabled={user.id === currentUser?.id}
                            className="role-select"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                      <td className="posts-count">{posts.filter(p => p.user_id === user.id).length}</td>
                      <td className="date-cell">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-view"
                            onClick={() => {
                              const userPosts = posts.filter(p => p.user_id === user.id);
                              setPosts(userPosts);
                              setActiveTab('posts');
                            }}
                            title="View User Posts"
                          >
                            <i className="fas fa-newspaper"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="comments-management">
            <div className="page-header">
              <h1>Comments Management</h1>
              <p className="section-subtitle">Moderate comments from all users</p>
            </div>
            
            <div className="comments-table">
              <table>
                <thead>
                  <tr>
                    <th>Post</th>
                    <th>Author</th>
                    <th>Comment</th>
                    <th>Likes</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map(comment => (
                    <tr key={comment.id}>
                      <td className="post-cell">{comment.posts?.title || `Post ${comment.post_id}`}</td>
                      <td>
                        <div className="author-info">
                          <div className="author-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <div>
                            <strong>{comment.author_name || comment.users?.name || 'Anonymous'}</strong>
                            <small>{comment.author_email || comment.users?.email || 'No email'}</small>
                          </div>
                        </div>
                      </td>
                      <td className="comment-content">{comment.content}</td>
                      <td className="likes-cell">{comment.likes}</td>
                      <td className="date-cell">{new Date(comment.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteComment(comment.id)}
                            title="Delete Comment"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="create-post">
            <div className="page-header">
              <h1>Create New Post</h1>
              <p className="section-subtitle">Create a post as admin (can be attributed to any user)</p>
            </div>
            
            <form onSubmit={handleCreatePost} className="post-form">
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="Enter post title"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Excerpt</label>
                  <textarea
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                    placeholder="Enter post excerpt"
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Content *</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Enter post content (HTML supported)"
                    rows="10"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  >
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                    <option value="business">Business</option>
                    <option value="general">General</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>User Attribution</label>
                  <select>
                    <option value={currentUser?.id}>{currentUser?.profile?.name} (You)</option>
                    {users.filter(u => u.id !== currentUser?.id).map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      checked={newPost.featured}
                      onChange={(e) => setNewPost({...newPost, featured: e.target.checked})}
                      id="featured"
                    />
                    <label htmlFor="featured">
                      <span className="checkbox-custom"></span>
                      Mark as featured
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      checked={newPost.published}
                      onChange={(e) => setNewPost({...newPost, published: e.target.checked})}
                      id="published"
                    />
                    <label htmlFor="published">
                      <span className="checkbox-custom"></span>
                      Publish immediately
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={newPost.image_url}
                    onChange={(e) => setNewPost({...newPost, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <i className="fas fa-plus-circle"></i> Create Post
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;