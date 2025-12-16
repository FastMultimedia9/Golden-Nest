// src/utils/blogStorage.js
// Keep this as localStorage fallback for Firebase

export const trackView = (postId) => {
  try {
    const views = JSON.parse(localStorage.getItem('blog_views') || '{}');
    const postViews = views[postId] || { count: 0, lastView: 0 };
    
    // Only count view if not viewed in last 30 minutes
    if (Date.now() - postViews.lastView > 30 * 60 * 1000) {
      postViews.count += 1;
      postViews.lastView = Date.now();
      views[postId] = postViews;
      localStorage.setItem('blog_views', JSON.stringify(views));
    }
    
    return postViews.count;
  } catch (error) {
    console.error('Error tracking view:', error);
    return 0;
  }
};

export const getViews = (postId) => {
  try {
    const views = JSON.parse(localStorage.getItem('blog_views') || '{}');
    return views[postId]?.count || 0;
  } catch (error) {
    return 0;
  }
};

export const getPopularPosts = (posts, limit = 5) => {
  try {
    return [...posts]
      .sort((a, b) => (getViews(b.id) || 0) - (getViews(a.id) || 0))
      .slice(0, limit);
  } catch (error) {
    return posts.slice(0, limit);
  }
};

export const addComment = (postId, commentData) => {
  try {
    const comments = JSON.parse(localStorage.getItem('blog_comments') || '{}');
    if (!comments[postId]) comments[postId] = [];
    
    const newComment = {
      id: Date.now().toString(),
      ...commentData,
      timestamp: new Date(),
      likes: 0
    };
    
    comments[postId].push(newComment);
    localStorage.setItem('blog_comments', JSON.stringify(comments));
    return newComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};

export const getComments = (postId) => {
  try {
    const comments = JSON.parse(localStorage.getItem('blog_comments') || '{}');
    return comments[postId] || [];
  } catch (error) {
    return [];
  }
};

export const likeComment = (postId, commentId) => {
  try {
    const comments = JSON.parse(localStorage.getItem('blog_comments') || '{}');
    if (comments[postId]) {
      const comment = comments[postId].find(c => c.id === commentId);
      if (comment) {
        comment.likes = (comment.likes || 0) + 1;
        localStorage.setItem('blog_comments', JSON.stringify(comments));
        return comment.likes;
      }
    }
    return 0;
  } catch (error) {
    return 0;
  }
};

export const saveArticle = (postId) => {
  try {
    const saved = JSON.parse(localStorage.getItem('saved_articles') || '[]');
    if (!saved.includes(postId)) {
      saved.push(postId);
      localStorage.setItem('saved_articles', JSON.stringify(saved));
    }
  } catch (error) {
    console.error('Error saving article:', error);
  }
};

export const isArticleSaved = (postId) => {
  try {
    const saved = JSON.parse(localStorage.getItem('saved_articles') || '[]');
    return saved.includes(postId);
  } catch (error) {
    return false;
  }
};

export const removeSavedArticle = (postId) => {
  try {
    const saved = JSON.parse(localStorage.getItem('saved_articles') || '[]');
    const filtered = saved.filter(id => id !== postId);
    localStorage.setItem('saved_articles', JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing saved article:', error);
  }
};

export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'Just now';
};