const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

export const blogApi = {
  // Get all posts
  async getPosts(options = {}) {
    const params = new URLSearchParams();
    if (options.category) params.append('category', options.category);
    if (options.limit) params.append('limit', options.limit);
    if (options.page) params.append('page', options.page);
    if (options.sort) params.append('sort', options.sort);
    
    const response = await fetch(`${API_BASE}/blog/posts?${params}`);
    return response.json();
  },

  // Get single post
  async getPost(id) {
    const response = await fetch(`${API_BASE}/blog/posts/${id}`);
    return response.json();
  },

  // Get comments for post
  async getComments(postId, options = {}) {
    const params = new URLSearchParams();
    params.append('postId', postId);
    if (options.parentId) params.append('parentId', options.parentId);
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    
    const response = await fetch(`${API_BASE}/blog/comments?${params}`);
    return response.json();
  },

  // Add comment
  async addComment(commentData) {
    const response = await fetch(`${API_BASE}/blog/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData)
    });
    return response.json();
  },

  // Like comment
  async likeComment(commentId) {
    const response = await fetch(`${API_BASE}/blog/comments/${commentId}/like`, {
      method: 'POST'
    });
    return response.json();
  },

  // Get popular posts
  async getPopularPosts(limit = 5) {
    const response = await fetch(`${API_BASE}/blog/popular?limit=${limit}`);
    return response.json();
  }
};