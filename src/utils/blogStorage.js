// Utility functions for blog data persistence using localStorage

const STORAGE_KEYS = {
  VIEWS: 'blog_views',
  COMMENTS: 'blog_comments',
  SAVED_ARTICLES: 'saved_articles',
  POPULAR_POSTS: 'blog_popular_posts',
  USER_COMMENTS: 'user_comments'
};

// View tracking functions
export const trackView = (postId) => {
  try {
    const views = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIEWS) || '{}');
    const now = Date.now();
    
    // Get or initialize post views
    if (!views[postId]) {
      views[postId] = {
        count: 1,
        firstView: now,
        lastView: now
      };
    } else {
      views[postId].count += 1;
      views[postId].lastView = now;
    }
    
    localStorage.setItem(STORAGE_KEYS.VIEWS, JSON.stringify(views));
    
    // Update popular posts tracking
    updatePopularPosts(postId, views[postId].count);
    
    return views[postId].count;
  } catch (error) {
    console.error('Error tracking view:', error);
    return 0;
  }
};

export const getViews = (postId) => {
  try {
    const views = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIEWS) || '{}');
    return views[postId]?.count || 0;
  } catch (error) {
    console.error('Error getting views:', error);
    return 0;
  }
};

export const getAllViews = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.VIEWS) || '{}');
  } catch (error) {
    console.error('Error getting all views:', error);
    return {};
  }
};

// Comment functions
export const addComment = (postId, commentData) => {
  try {
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
    
    if (!comments[postId]) {
      comments[postId] = [];
    }
    
    const newComment = {
      id: Date.now(),
      ...commentData,
      timestamp: Date.now(),
      likes: 0,
      replies: []
    };
    
    comments[postId].unshift(newComment); // Add to beginning for chronological order
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    
    // Save to user's comment history
    saveUserComment(postId, newComment.id);
    
    return newComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};

export const getComments = (postId) => {
  try {
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
    return comments[postId] || [];
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
};

export const likeComment = (postId, commentId) => {
  try {
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
    
    if (comments[postId]) {
      const commentIndex = comments[postId].findIndex(c => c.id === commentId);
      if (commentIndex !== -1) {
        comments[postId][commentIndex].likes += 1;
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
        return comments[postId][commentIndex].likes;
      }
    }
    return 0;
  } catch (error) {
    console.error('Error liking comment:', error);
    return 0;
  }
};

export const addReply = (postId, commentId, replyData) => {
  try {
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
    
    if (comments[postId]) {
      const commentIndex = comments[postId].findIndex(c => c.id === commentId);
      if (commentIndex !== -1) {
        const newReply = {
          id: Date.now(),
          ...replyData,
          timestamp: Date.now()
        };
        
        if (!comments[postId][commentIndex].replies) {
          comments[postId][commentIndex].replies = [];
        }
        
        comments[postId][commentIndex].replies.push(newReply);
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
        
        return newReply;
      }
    }
    return null;
  } catch (error) {
    console.error('Error adding reply:', error);
    return null;
  }
};

// User comment history
const saveUserComment = (postId, commentId) => {
  try {
    const userComments = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_COMMENTS) || '{}');
    const userId = getUserId();
    
    if (!userComments[userId]) {
      userComments[userId] = [];
    }
    
    userComments[userId].push({
      postId,
      commentId,
      timestamp: Date.now()
    });
    
    localStorage.setItem(STORAGE_KEYS.USER_COMMENTS, JSON.stringify(userComments));
  } catch (error) {
    console.error('Error saving user comment:', error);
  }
};

// Popular posts tracking
const updatePopularPosts = (postId, viewCount) => {
  try {
    const popularPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POPULAR_POSTS) || '[]');
    
    const existingIndex = popularPosts.findIndex(p => p.id === postId);
    
    if (existingIndex !== -1) {
      popularPosts[existingIndex].views = viewCount;
      popularPosts[existingIndex].lastViewed = Date.now();
    } else {
      popularPosts.push({
        id: postId,
        views: viewCount,
        lastViewed: Date.now()
      });
    }
    
    // Sort by views (descending) and keep only top 10
    popularPosts.sort((a, b) => b.views - a.views);
    const topPosts = popularPosts.slice(0, 10);
    
    localStorage.setItem(STORAGE_KEYS.POPULAR_POSTS, JSON.stringify(topPosts));
  } catch (error) {
    console.error('Error updating popular posts:', error);
  }
};

export const getPopularPosts = (allPosts) => {
  try {
    const popularData = JSON.parse(localStorage.getItem(STORAGE_KEYS.POPULAR_POSTS) || '[]');
    
    // Map popular data to actual posts
    const popularPosts = popularData
      .map(popular => {
        const post = allPosts.find(p => p.id === popular.id);
        if (post) {
          return {
            ...post,
            views: popular.views,
            lastViewed: popular.lastViewed
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5); // Top 5 popular posts
    
    return popularPosts;
  } catch (error) {
    console.error('Error getting popular posts:', error);
    return [];
  }
};

// Save article functions
export const saveArticle = (postId) => {
  try {
    const savedArticles = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_ARTICLES) || '[]');
    
    if (!savedArticles.includes(postId)) {
      savedArticles.push(postId);
      localStorage.setItem(STORAGE_KEYS.SAVED_ARTICLES, JSON.stringify(savedArticles));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving article:', error);
    return false;
  }
};

export const removeSavedArticle = (postId) => {
  try {
    const savedArticles = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_ARTICLES) || '[]');
    const newSavedArticles = savedArticles.filter(id => id !== postId);
    localStorage.setItem(STORAGE_KEYS.SAVED_ARTICLES, JSON.stringify(newSavedArticles));
    return true;
  } catch (error) {
    console.error('Error removing saved article:', error);
    return false;
  }
};

export const getSavedArticles = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_ARTICLES) || '[]');
  } catch (error) {
    console.error('Error getting saved articles:', error);
    return [];
  }
};

export const isArticleSaved = (postId) => {
  try {
    const savedArticles = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_ARTICLES) || '[]');
    return savedArticles.includes(postId);
  } catch (error) {
    console.error('Error checking saved article:', error);
    return false;
  }
};

// Helper functions
const getUserId = () => {
  let userId = localStorage.getItem('blog_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('blog_user_id', userId);
  }
  return userId;
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatTimeAgo = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
  if (diff < minute) {
    return 'just now';
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diff < month) {
    const weeks = Math.floor(diff / week);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diff / year);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
};

// Clear all data (for testing/debugging)
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  localStorage.removeItem('blog_user_id');
};