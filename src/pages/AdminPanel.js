import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAuthAndLoadData();
  }, [navigate]);

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }
      
      const user = session.user;
      setCurrentUser(user);
      
      // Check if user is admin in users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error || !userData || userData.role !== 'admin') {
        navigate('/user/dashboard');
        return;
      }
      
      fetchData();
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/admin/login');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Fetch all posts with user info
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          users:user_id (
            id,
            username,
            name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;
      
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (usersError) throw usersError;
      
      // Fetch all comments with user and post info
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          users:user_id (
            id,
            username,
            name,
            email
          ),
          posts (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false });
      
      if (commentsError) throw commentsError;
      
      setPosts(postsData || []);
      setUsers(usersData || []);
      setComments(commentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        // Delete associated comments first
        await supabase
          .from('comments')
          .delete()
          .eq('post_id', id);
        
        // Delete the post
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        alert('Post deleted successfully!');
        fetchData();
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
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const navigateToNewPost = () => {
    navigate('/admin/posts/new');
  };

  const navigateToEditPost = (postId) => {
    navigate(`/admin/posts/edit/${postId}`);
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.users?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-panel-loading">
        <div className="loading-spinner"></div>
        <p>Loading Admin Panel...</p>
      </div>
    );
  }

  const userStats = {
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length,
    totalPosts: posts.length,
    totalComments: comments.length
  };

  return (
    <div className="admin-panel">
      {/* Mobile Hamburger Menu */}
      <button 
        className="admin-hamburger"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-logo">
            <i className="fas fa-crown"></i>
            <h1>Admin Panel</h1>
          </div>
          <div className="admin-current-user">
            <div className="current-user-avatar">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="current-user-info">
              <span className="current-user-name">
                {currentUser?.email?.split('@')[0]}
              </span>
              <span className="current-user-role">Administrator</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => handleTabChange('posts')}
          >
            <i className="fas fa-newspaper"></i>
            <span>All Posts</span>
            <span className="nav-badge">{posts.length}</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            <i className="fas fa-users"></i>
            <span>Users</span>
            <span className="nav-badge">{users.length}</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => handleTabChange('comments')}
          >
            <i className="fas fa-comments"></i>
            <span>Comments</span>
            <span className="nav-badge">{comments.length}</span>
          </button>

          <div className="nav-divider"></div>

          <button 
            className="nav-item new-post-btn"
            onClick={navigateToNewPost}
          >
            <i className="fas fa-plus-circle"></i>
            <span>Create New Post</span>
          </button>

          <div className="nav-divider"></div>

          <button 
            className="nav-item logout-btn"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-title">
            <h2>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'posts' && 'Posts Management'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'comments' && 'Comments Management'}
            </h2>
            <p className="header-subtitle">
              {activeTab === 'dashboard' && 'Overview of your blog statistics'}
              {activeTab === 'posts' && 'Manage all blog posts'}
              {activeTab === 'users' && 'Manage user accounts and permissions'}
              {activeTab === 'comments' && 'Moderate user comments'}
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="btn-new-post"
              onClick={navigateToNewPost}
            >
              <i className="fas fa-plus"></i> New Post
            </button>
          </div>
        </header>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon total-posts">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="stat-content">
                  <h3>{userStats.totalPosts}</h3>
                  <p>Total Posts</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon total-users">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-content">
                  <h3>{userStats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon total-comments">
                  <i className="fas fa-comment"></i>
                </div>
                <div className="stat-content">
                  <h3>{userStats.totalComments}</h3>
                  <p>Total Comments</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon admin-users">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="stat-content">
                  <h3>{userStats.adminUsers}</h3>
                  <p>Admin Users</p>
                </div>
              </div>
            </div>

            <div className="dashboard-tables">
              <div className="recent-posts">
                <div className="table-header">
                  <h3>Recent Posts</h3>
                  <button 
                    className="view-all"
                    onClick={() => handleTabChange('posts')}
                  >
                    View All
                  </button>
                </div>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.slice(0, 5).map(post => (
                        <tr key={post.id}>
                          <td>
                            <div className="post-title-cell">
                              <strong>{post.title}</strong>
                              <small>{post.excerpt?.substring(0, 60)}...</small>
                            </div>
                          </td>
                          <td>{post.users?.name || post.users?.username || 'Unknown'}</td>
                          <td>
                            <span className="category-tag">{post.category}</span>
                          </td>
                          <td>{new Date(post.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="recent-users">
                <div className="table-header">
                  <h3>Recent Users</h3>
                  <button 
                    className="view-all"
                    onClick={() => handleTabChange('users')}
                  >
                    View All
                  </button>
                </div>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 5).map(user => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar">
                                {user.avatar_url ? (
                                  <img src={user.avatar_url} alt={user.name} />
                                ) : (
                                  <i className="fas fa-user"></i>
                                )}
                              </div>
                              <div className="user-info">
                                <strong>{user.name || user.username}</strong>
                                <small>@{user.username}</small>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="posts-content">
            <div className="content-header">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search posts by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-controls">
                <select className="filter-select">
                  <option value="all">All Categories</option>
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="business">Business</option>
                  <option value="general">General</option>
                </select>
                <select className="filter-select">
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="table-container">
              <table className="posts-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map(post => (
                    <tr key={post.id}>
                      <td>
                        <div className="post-title-cell">
                          <strong>{post.title}</strong>
                          <small>{post.excerpt?.substring(0, 80) || 'No excerpt...'}</small>
                        </div>
                      </td>
                      <td>{post.users?.name || post.users?.username || 'Unknown'}</td>
                      <td>
                        <span className="category-tag">{post.category}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${post.published ? 'published' : 'draft'}`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>{new Date(post.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-action btn-view"
                            onClick={() => navigate(`/blog/${post.id}`)}
                            title="View Post"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="btn-action btn-edit"
                            onClick={() => navigateToEditPost(post.id)}
                            title="Edit Post"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn-action btn-delete"
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

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="users-content">
            <div className="table-container">
              <table className="users-table">
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
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt={user.name} />
                            ) : (
                              <i className="fas fa-user"></i>
                            )}
                          </div>
                          <div className="user-info">
                            <strong>{user.name || user.username}</strong>
                            {user.id === currentUser?.id && (
                              <small className="current-user-tag">You</small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>@{user.username}</td>
                      <td>
                        <select 
                          value={user.role}
                          onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                          disabled={user.id === currentUser?.id}
                          className="role-select"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                        </select>
                      </td>
                      <td>
                        <span className="posts-count">
                          {posts.filter(p => p.user_id === user.id).length}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-action btn-view"
                            onClick={() => {
                              const userPosts = posts.filter(p => p.user_id === user.id);
                              alert(`${user.name || user.username} has ${userPosts.length} posts`);
                            }}
                            title="View User Info"
                          >
                            <i className="fas fa-info-circle"></i>
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

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="comments-content">
            <div className="table-container">
              <table className="comments-table">
                <thead>
                  <tr>
                    <th>Post</th>
                    <th>User</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map(comment => (
                    <tr key={comment.id}>
                      <td className="post-cell">
                        <strong>{comment.posts?.title || 'Unknown Post'}</strong>
                      </td>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {comment.users?.avatar_url ? (
                              <img src={comment.users.avatar_url} alt={comment.users.name} />
                            ) : (
                              <i className="fas fa-user"></i>
                            )}
                          </div>
                          <div className="user-info">
                            <strong>{comment.users?.name || comment.users?.username || comment.author_name || 'Anonymous'}</strong>
                          </div>
                        </div>
                      </td>
                      <td className="comment-cell">
                        {comment.content}
                      </td>
                      <td>{new Date(comment.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-action btn-delete"
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
      </main>
    </div>
  );
};

export default AdminPanel;