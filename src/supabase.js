import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'

// Your actual credentials
const supabaseUrl = 'https://ymqlxvvschytbkkjexvd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcWx4dnZzY2h5dGJra2pleHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MjI2NjUsImV4cCI6MjA4MTQ5ODY2NX0.oZr6o8cg_WuJ83maXa-d8a3TfVAtQaGp3EXftUidjzo'

// SINGLETON PATTERN: Create client only once
let supabaseInstance = null;

// Enhanced cache with localStorage backup
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days

const getSupabaseClient = () => {
  if (!supabaseInstance) {
    console.log('🔄 Creating Supabase client instance...');
    
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storage: typeof window !== 'undefined' ? localStorage : undefined,
        storageKey: 'sb-ymqlxvvschytbkkjexvd-auth-token',
        flowType: 'pkce'
      },
      global: {
        headers: {
          'X-Client-Info': 'blog-js-1.0',
          'Cache-Control': 'no-cache'
        },
        // Add timeout to prevent hanging requests
        fetch: (...args) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
          
          return fetch(...args, {
            signal: controller.signal,
            cache: 'no-store'
          }).finally(() => clearTimeout(timeoutId));
        }
      },
      db: {
        schema: 'public'
      },
      realtime: {
        params: {
          eventsPerSecond: 5
        }
      }
    });
    
    // Add auth state change listener
    supabaseInstance.auth.onAuthStateChange((event, session) => {
      console.log('📱 Auth state changed:', event);
      if (event === 'SIGNED_IN') {
        console.log('✅ User signed in:', session?.user?.email);
        // Create database session entry
        createDatabaseSession(session);
        persistSession(session);
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 User signed out');
        clearSessionStorage();
        clearCache();
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed');
        if (session) {
          persistSession(session);
        }
      }
    });
  }
  return supabaseInstance;
};

// Export the single instance
export const supabase = getSupabaseClient();

// Create database session entry
const createDatabaseSession = async (session) => {
  if (!session?.user?.id) return;
  
  try {
    // Create or update session in database
    const { data, error } = await supabase
      .from('sessions')
      .upsert({
        user_id: session.user.id,
        session_token: session.access_token,
        expires_at: new Date(Date.now() + SESSION_TIMEOUT).toISOString(),
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        last_active: new Date().toISOString(),
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      });
    
    if (error) {
      console.log('⚠️ Could not create database session:', error.message);
    } else {
      console.log('💾 Database session created/updated');
    }
  } catch (error) {
    console.log('❌ Error creating database session:', error.message);
  }
};

// Update session activity
const updateSessionActivity = async (userId) => {
  if (!userId) return;
  
  try {
    await supabase
      .from('sessions')
      .update({ 
        last_active: new Date().toISOString() 
      })
      .eq('user_id', userId);
  } catch (error) {
    console.log('⚠️ Could not update session activity:', error.message);
  }
};

// Check if database session is valid
const checkDatabaseSession = async (userId) => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('expires_at, last_active')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error || !data) {
      return false;
    }
    
    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    
    if (expiresAt < now) {
      // Clear expired session
      await supabase
        .from('sessions')
        .delete()
        .eq('user_id', userId);
      return false;
    }
    
    // Update last activity
    const lastActive = new Date(data.last_active);
    const hoursSinceActivity = (now - lastActive) / (1000 * 60 * 60);
    
    if (hoursSinceActivity > 1) {
      await updateSessionActivity(userId);
    }
    
    return true;
  } catch (error) {
    console.log('❌ Error checking database session:', error.message);
    return false;
  }
};

// Session persistence helper functions
const persistSession = (session) => {
  if (session && typeof window !== 'undefined') {
    try {
      // Store enhanced session data
      const sessionData = {
        userId: session.user.id,
        email: session.user.email,
        expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : new Date(Date.now() + SESSION_TIMEOUT).toISOString(),
        lastUpdated: new Date().toISOString(),
        accessToken: session.access_token,
        refreshToken: session.refresh_token
      };
      
      localStorage.setItem('blog_session_data', JSON.stringify(sessionData));
      console.log('💾 Session persisted to storage');
    } catch (error) {
      console.log('❌ Error persisting session:', error);
    }
  }
};

const restoreSession = async () => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Get session data from localStorage
    const sessionJson = localStorage.getItem('blog_session_data');
    if (!sessionJson) {
      console.log('📭 No saved session data found');
      return null;
    }
    
    const sessionData = JSON.parse(sessionJson);
    const { userId, email, expiresAt, lastUpdated, accessToken } = sessionData;
    
    if (!userId || !expiresAt) {
      console.log('📭 Invalid session data');
      return null;
    }
    
    // Check if session is expired
    if (new Date(expiresAt) < new Date()) {
      console.log('⏰ Session expired, clearing storage');
      clearSessionStorage();
      return null;
    }
    
    // Check database session validity
    const dbSessionValid = await checkDatabaseSession(userId);
    if (!dbSessionValid) {
      console.log('🗄️ Database session invalid or expired');
      clearSessionStorage();
      return null;
    }
    
    // Try to restore session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user?.id === userId) {
      console.log('✅ Session restored from storage for:', email);
      // Update session activity
      updateSessionActivity(userId);
      return session.user;
    } else {
      // Try to set session manually if we have tokens
      if (accessToken) {
        console.log('🔄 Attempting to restore session with stored token');
        try {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: sessionData.refreshToken
          });
          
          // Check again after setting session
          const { data: { session: newSession } } = await supabase.auth.getSession();
          if (newSession?.user?.id === userId) {
            console.log('✅ Session restored with stored token');
            updateSessionActivity(userId);
            return newSession.user;
          }
        } catch (tokenError) {
          console.log('❌ Failed to restore with token:', tokenError.message);
        }
      }
    }
    
    console.log('❌ No matching session found in Supabase');
    return null;
  } catch (error) {
    console.log('❌ Error restoring session:', error);
    return null;
  }
};

const clearSessionStorage = () => {
  if (typeof window === 'undefined') return;
  
  // Clear all session-related items
  localStorage.removeItem('blog_session_data');
  localStorage.removeItem('blog_session_user_id');
  localStorage.removeItem('blog_session_email');
  localStorage.removeItem('blog_session_expiry');
  localStorage.removeItem('blog_remember_me');
  localStorage.removeItem('blog_user_email');
  
  // Clear auth tokens
  const authKeys = Object.keys(localStorage).filter(key => 
    key.includes('sb-auth') || key.includes('-auth-token')
  );
  authKeys.forEach(key => localStorage.removeItem(key));
  
  console.log('🧹 Session storage cleared');
};

// Helper function to calculate read time
const calculateReadTime = (content) => {
  if (!content) return '5 min read';
  
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // Average reading speed: 200 words per minute
  
  if (minutes < 1) return '1 min read';
  return `${minutes} min read`;
};

// Simple data transformation
const transformPostData = (post) => {
  if (!post) return null;
  
  // Get user info from the joined data
  const user = post.users || {};
  
  return {
    id: post.id,
    title: post.title || 'Untitled Post',
    excerpt: post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : 'Read more...'),
    content: post.content || '',
    category: (post.category || 'general').toLowerCase(),
    image_url: post.image_url || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=800&auto=format&fit=crop`,
    views: parseInt(post.views || 0),
    comments: parseInt(post.comments_count || 0),
    likes: parseInt(post.likes || 0),
    featured: post.featured || false,
    published: post.published !== false,
    created_at: post.created_at || new Date().toISOString(),
    readTime: calculateReadTime(post.content) || '5 min read',
    author: user.name || user.username || user.email?.split('@')[0] || 'Author',
    author_avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || 'Author')}&background=6c63ff&color=fff`,
    user_id: post.user_id,
    user_role: user.role || 'user'
  };
};

const transformPostsData = (posts) => {
  if (!Array.isArray(posts)) return [];
  return posts.map(transformPostData).filter(Boolean);
};

// Utility functions
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  
  const number = parseInt(num);
  
  if (isNaN(number)) return '0';
  
  if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
  if (number >= 1000) return (number / 1000).toFixed(1) + 'K';
  return number.toString();
};

export const formatTimeAgo = (timestamp) => {
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

// Enhanced cache system
const loadFromCache = (key) => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log(`📦 Loading from cache: ${key}`);
      return data;
    }
    return null;
  } catch (error) {
    console.log('Cache load error:', error);
    return null;
  }
};

const saveToCache = (key, data) => {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.log('Cache save error:', error);
  }
};

// Cache clearing function
export const clearCache = () => {
  if (typeof window === 'undefined') return;
  
  // Clear specific cache keys
  const cacheKeys = [
    'blog_posts',
    'blog_post_details_',
    'blog_comments_count_'
  ];
  
  cacheKeys.forEach(key => {
    if (key.endsWith('_')) {
      // Clear keys with prefix
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(key)) {
          localStorage.removeItem(k);
        }
      });
    } else {
      localStorage.removeItem(key);
    }
  });
  
  console.log('🧹 Blog cache cleared');
};

// SIMPLE BLOG API
export const blogAPI = {
  async getPosts(forceRefresh = false) {
    try {
      // Try to load from cache first
      if (!forceRefresh) {
        const cachedPosts = loadFromCache('blog_posts');
        if (cachedPosts) {
          console.log('📦 Returning cached posts');
          return cachedPosts;
        }
      }
      
      console.log('📡 Fetching posts from Supabase...');
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users:user_id (
            id,
            name,
            username,
            email,
            avatar_url,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.log('⚠️ Error fetching posts:', error.message);
        // Try to return stale cache if available
        const staleCache = loadFromCache('blog_posts');
        if (staleCache) {
          console.log('⚠️ Using stale cache due to API error');
          return staleCache;
        }
        return [];
      }
      
      const transformedPosts = transformPostsData(data || []);
      
      // Save to cache
      saveToCache('blog_posts', transformedPosts);
      
      console.log(`✅ Found ${transformedPosts.length} posts`);
      return transformedPosts;
    } catch (error) {
      console.log('❌ Exception in getPosts:', error.message);
      // Try to return stale cache if available
      const staleCache = loadFromCache('blog_posts');
      if (staleCache) {
        console.log('⚠️ Using stale cache due to exception');
        return staleCache;
      }
      return [];
    }
  },

  async getCommentsCount(postId) {
    try {
      const cacheKey = `blog_comments_count_${postId}`;
      
      // Return cached count if valid
      const cachedCount = loadFromCache(cacheKey);
      if (cachedCount !== null) {
        return cachedCount;
      }
      
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);
      
      if (error) throw error;
      
      const countValue = count || 0;
      
      // Cache the result
      saveToCache(cacheKey, countValue);
      
      return countValue;
    } catch (error) {
      console.log('Error getting comment count:', error.message);
      return 0;
    }
  },

  async getPostsByUserId(userId) {
    try {
      console.log(`📡 Fetching posts for user: ${userId}`);
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users:user_id (
            id,
            name,
            username,
            email,
            avatar_url,
            role
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.log('⚠️ Error fetching user posts:', error.message);
        return [];
      }
      
      console.log(`✅ Found ${data?.length || 0} posts for user ${userId}`);
      return transformPostsData(data || []);
    } catch (error) {
      console.log('❌ Exception in getPostsByUserId:', error.message);
      return [];
    }
  },

  async getUserPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users:user_id (
            id,
            name,
            username,
            email,
            avatar_url,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.log('⚠️ Error in getUserPosts:', error.message);
        return transformPostsData([]);
      }
      
      return transformPostsData(data || []);
    } catch (error) {
      console.log('❌ Exception in getUserPosts:', error.message);
      return transformPostsData([]);
    }
  },

  async getPost(id, forceRefresh = false) {
    try {
      const cacheKey = `blog_post_details_${id}`;
      
      // Return cached post if valid
      if (!forceRefresh) {
        const cachedPost = loadFromCache(cacheKey);
        if (cachedPost) {
          console.log('📦 Returning cached post');
          return cachedPost;
        }
      }
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users:user_id (
            id,
            name,
            username,
            email,
            avatar_url,
            role
          )
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      const transformedPost = transformPostData(data);
      
      // Cache the result
      saveToCache(cacheKey, transformedPost);
      
      return transformedPost;
    } catch (error) {
      console.log('❌ Error in getPost:', error.message);
      return null;
    }
  },

  async trackView(postId) {
    try {
      const { data, error } = await supabase.rpc('increment_views', { post_id: postId });
      
      if (error) {
        // Fallback if RPC doesn't exist
        const { data: post } = await supabase
          .from('posts')
          .select('views')
          .eq('id', postId)
          .single();
        
        const currentViews = parseInt(post?.views || 0);
        const newViews = currentViews + 1;
        
        await supabase
          .from('posts')
          .update({ views: newViews })
          .eq('id', postId);
        
        // Invalidate cache for this post
        localStorage.removeItem(`blog_post_details_${postId}`);
        return newViews;
      }
      
      // Invalidate cache for this post
      localStorage.removeItem(`blog_post_details_${postId}`);
      return data || 0;
    } catch (error) {
      console.log('⚠️ Error tracking view:', error.message);
      return 0;
    }
  },

  async updatePost(postId, postData) {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('User must be logged in to update posts');
      }
      
      const postToUpdate = {
        title: postData.title || 'Untitled Post',
        excerpt: postData.excerpt || (postData.content ? postData.content.substring(0, 150) + '...' : 'Read more...'),
        content: postData.content || '',
        category: (postData.category || 'general').toLowerCase(),
        image_url: postData.image_url || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=800&auto=format&fit=crop`,
        featured: postData.featured || false,
        published: postData.published !== false,
        updated_at: new Date().toISOString()
      };
      
      const cleanPostToUpdate = Object.fromEntries(
        Object.entries(postToUpdate).filter(([_, v]) => v !== undefined)
      );
      
      const { data, error } = await supabase
        .from('posts')
        .update(cleanPostToUpdate)
        .eq('id', postId)
        .select();
      
      if (error) throw error;
      
      // Clear relevant cache
      localStorage.removeItem('blog_posts');
      localStorage.removeItem(`blog_post_details_${postId}`);
      
      return transformPostData(data[0]);
    } catch (error) {
      console.log('Error in updatePost:', error.message);
      return null;
    }
  },

  async deletePost(postId) {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('User must be logged in to delete posts');
      }
      
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      // Clear cache
      localStorage.removeItem('blog_posts');
      localStorage.removeItem(`blog_post_details_${postId}`);
      localStorage.removeItem(`blog_comments_count_${postId}`);
      
      return true;
    } catch (error) {
      console.log('Error in deletePost:', error.message);
      return false;
    }
  },

  async getComments(postId) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.log('Error getting comments:', error.message);
        return [];
      }
      
      const transformedComments = data?.map(comment => ({
        id: comment.id,
        author_name: comment.author_name || 'Anonymous',
        author_email: comment.author_email,
        content: comment.content,
        avatar_url: comment.avatar_url || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        created_at: comment.created_at,
        likes: parseInt(comment.likes || 0),
        post_id: comment.post_id,
        user_id: comment.user_id
      })) || [];
      
      return transformedComments;
    } catch (error) {
      console.log('Error in getComments:', error.message);
      return [];
    }
  },

  async addComment(postId, commentData) {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const commentToInsert = {
        post_id: parseInt(postId),
        user_id: user?.user?.id || null,
        author_name: commentData.user || user?.user?.email?.split('@')[0] || 'Anonymous',
        author_email: commentData.email || user?.user?.email || 'anonymous@example.com',
        content: commentData.text,
        avatar_url: commentData.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        created_at: new Date().toISOString(),
        likes: 0
      };
      
      const { data, error } = await supabase
        .from('comments')
        .insert([commentToInsert])
        .select();
      
      if (error) throw error;
      
      try {
        await supabase.rpc('increment_comments_count', { post_id: postId });
      } catch (rpcError) {
        console.log('RPC error (non-critical):', rpcError.message);
        const { data: post } = await supabase
          .from('posts')
          .select('comments_count')
          .eq('id', postId)
          .single();
        
        if (post) {
          await supabase
            .from('posts')
            .update({ comments_count: (post.comments_count || 0) + 1 })
            .eq('id', postId);
        }
      }
      
      localStorage.removeItem(`blog_comments_count_${postId}`);
      localStorage.removeItem(`blog_post_details_${postId}`);
      
      return data[0];
    } catch (error) {
      console.log('Error adding comment:', error.message);
      return null;
    }
  },

  async likeComment(commentId) {
    try {
      const { data, error } = await supabase.rpc('increment_likes', { comment_id: commentId });
      
      if (error) {
        const { data: comment } = await supabase
          .from('comments')
          .select('likes')
          .eq('id', commentId)
          .single();
        
        if (!comment) throw new Error('Comment not found');
        
        const currentLikes = parseInt(comment?.likes || 0);
        const newLikes = currentLikes + 1;
        
        await supabase
          .from('comments')
          .update({ likes: newLikes })
          .eq('id', commentId);
        
        return newLikes;
      }
      
      return data || 0;
    } catch (error) {
      console.log('Error in likeComment:', error.message);
      return null;
    }
  },

  async createPost(postData) {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('User must be logged in to create posts');
      }
      
      const postToInsert = {
        title: postData.title || 'Untitled Post',
        excerpt: postData.excerpt || (postData.content ? postData.content.substring(0, 150) + '...' : 'Read more...'),
        content: postData.content || '',
        category: (postData.category || 'general').toLowerCase(),
        image_url: postData.image_url || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=800&auto=format&fit=crop`,
        views: 0,
        comments_count: 0,
        likes: 0,
        featured: postData.featured || false,
        published: postData.published !== false,
        user_id: user.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('posts')
        .insert([postToInsert])
        .select();
      
      if (error) throw error;
      
      localStorage.removeItem('blog_posts');
      
      return transformPostData(data[0]);
    } catch (error) {
      console.log('Error in createPost:', error.message);
      return null;
    }
  }
};

// Enhanced session management
const SessionManager = {
  // Initialize session on app startup
  async initialize() {
    if (typeof window === 'undefined') return null;
    
    try {
      console.log('🚀 Initializing session manager...');
      
      // Check for stored session first
      const restoredUser = await restoreSession();
      if (restoredUser) {
        console.log('✅ Session initialized from storage');
        return restoredUser;
      }
      
      // Check current Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('✅ Session initialized from Supabase');
        persistSession(session);
        await createDatabaseSession(session);
        return session.user;
      }
      
      console.log('❌ No session found on initialization');
      return null;
    } catch (error) {
      console.log('❌ Session initialization error:', error);
      return null;
    }
  },
  
  // Validate session on demand
  async validateSession() {
    try {
      const user = await authAPI.getCurrentUser();
      if (!user) return false;
      
      // Check database session validity
      const isValid = await checkDatabaseSession(user.id);
      return isValid;
    } catch (error) {
      console.log('❌ Session validation error:', error);
      return false;
    }
  },
  
  // Refresh session
  async refreshSession() {
    try {
      console.log('🔄 Refreshing session...');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.log('❌ Session refresh error:', error.message);
        return false;
      }
      
      if (data?.session) {
        persistSession(data.session);
        await createDatabaseSession(data.session);
        console.log('✅ Session refreshed');
        return true;
      }
      
      return false;
    } catch (error) {
      console.log('❌ Session refresh exception:', error);
      return false;
    }
  },
  
  // Get session status
  async getSessionStatus() {
    const user = await authAPI.getCurrentUser();
    const isValid = user ? await checkDatabaseSession(user.id) : false;
    
    return {
      isAuthenticated: !!user,
      isValid: isValid,
      user: user,
      timestamp: new Date().toISOString()
    };
  }
};

// Auth Context for React components
export const AuthContext = React.createContext();

// Enhanced Auth Provider Component with session management
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    userRole: 'user',
    loading: true,
    sessionValid: false
  });

  // Session refresh interval
  useEffect(() => {
    let refreshInterval;
    
    const setupSessionRefresh = () => {
      // Refresh session every 30 minutes
      refreshInterval = setInterval(async () => {
        if (authState.isAuthenticated) {
          await SessionManager.refreshSession();
        }
      }, 30 * 60 * 1000);
    };
    
    setupSessionRefresh();
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [authState.isAuthenticated]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔍 Initializing authentication...');
        setAuthState(prev => ({ ...prev, loading: true }));
        
        // Initialize session manager
        const user = await SessionManager.initialize();
        
        if (user) {
          // Get user profile
          const userWithProfile = await authAPI.getCurrentUserWithProfile();
          const role = userWithProfile?.profile?.role || 'user';
          const sessionValid = await SessionManager.validateSession();
          
          console.log(`✅ User authenticated: ${user.email} (Role: ${role})`);
          
          setAuthState({
            isAuthenticated: true,
            user: userWithProfile,
            userRole: role,
            loading: false,
            sessionValid: sessionValid
          });
        } else {
          console.log('❌ No authenticated user found');
          setAuthState({
            isAuthenticated: false,
            user: null,
            userRole: 'user',
            loading: false,
            sessionValid: false
          });
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          userRole: 'user',
          loading: false,
          sessionValid: false
        });
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const result = await authAPI.adminLogin(email, password);
    if (result.success) {
      const user = await authAPI.getCurrentUserWithProfile();
      const role = user?.profile?.role || 'user';
      const sessionValid = await SessionManager.validateSession();
      
      setAuthState({
        isAuthenticated: true,
        user: user,
        userRole: role,
        loading: false,
        sessionValid: sessionValid
      });
    }
    return result;
  };

  const logout = async () => {
    const result = await authAPI.logout();
    if (result) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        userRole: 'user',
        loading: false,
        sessionValid: false
      });
    }
    return result;
  };

  const validateSession = async () => {
    const isValid = await SessionManager.validateSession();
    setAuthState(prev => ({ ...prev, sessionValid: isValid }));
    return isValid;
  };

  const refreshSession = async () => {
    const refreshed = await SessionManager.refreshSession();
    if (refreshed) {
      const sessionValid = await SessionManager.validateSession();
      setAuthState(prev => ({ ...prev, sessionValid: sessionValid }));
    }
    return refreshed;
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      logout, 
      validateSession,
      refreshSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => React.useContext(AuthContext);

// COMPLETE AUTH API with enhanced session persistence
export const authAPI = {
  // Initialize session manager on import
  sessionManager: SessionManager,
  
  // Check if user is logged in
  async isLoggedIn() {
    try {
      // Validate session first
      const status = await SessionManager.getSessionStatus();
      
      if (status.isAuthenticated && status.isValid) {
        console.log('✅ User logged in with valid session');
        return true;
      } else if (status.isAuthenticated && !status.isValid) {
        console.log('⚠️ User session expired');
        // Try to refresh
        const refreshed = await SessionManager.refreshSession();
        return refreshed;
      }
      
      return false;
    } catch (error) {
      console.log('❌ Error checking login status:', error.message);
      return false;
    }
  },

  // Login user
  async adminLogin(email, password) {
    try {
      console.log('🔐 Attempting login for:', email);
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim()
      });
      
      if (error) {
        console.log('❌ Login error:', error.message);
        return { 
          success: false, 
          error: error.message.includes('Invalid') 
            ? 'Invalid email or password' 
            : error.message 
        };
      }
      
      if (data?.user && data?.session) {
        console.log('✅ Login successful for user:', data.user.email);
        
        // Create database session and persist
        await createDatabaseSession(data.session);
        persistSession(data.session);
        
        // Check user role
        let isAdmin = false;
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.user.id)
            .maybeSingle();
          
          isAdmin = userData?.role === 'admin';
          console.log('👑 User role:', isAdmin ? 'Admin' : 'User');
        } catch (err) {
          console.log('Could not check admin status:', err.message);
          isAdmin = false;
        }
        
        return { 
          success: true, 
          user: data.user,
          session: data.session,
          isAdmin: isAdmin
        };
      }
      
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    } catch (error) {
      console.error('❌ Login exception:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection.' 
      };
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      console.log('🔑 Resetting password for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      
      if (error) {
        console.log('❌ Reset password error:', error.message);
        return { 
          success: false, 
          error: error.message || 'Failed to send reset email' 
        };
      }
      
      return { 
        success: true, 
        message: 'Password reset instructions sent to your email!' 
      };
    } catch (error) {
      console.error('❌ Reset password exception:', error);
      return { 
        success: false, 
        error: 'Password reset failed. Please try again.' 
      };
    }
  },

  // Register new user
  async register(email, password, name) {
    try {
      console.log('📝 Registering new user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password.trim(),
        options: {
          data: {
            name: name || email.split('@')[0]
          }
        }
      });
      
      if (error) {
        console.log('❌ Registration error:', error.message);
        return { 
          success: false, 
          error: error.message || 'Registration failed' 
        };
      }
      
      if (data?.user) {
        console.log('✅ Registration successful for:', data.user.email);
        
        // Create user profile in users table
        try {
          await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                name: name || email.split('@')[0],
                role: 'user',
                created_at: new Date().toISOString()
              }
            ]);
        } catch (profileErr) {
          console.log('⚠️ Profile creation error (non-critical):', profileErr.message);
        }
        
        return { 
          success: true, 
          user: data.user,
          message: 'Registration successful! You can now login.'
        };
      }
      
      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      };
    } catch (error) {
      console.error('❌ Registration exception:', error);
      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      };
    }
  },

  // Logout
  async logout() {
    try {
      // Get current user to clear database session
      const user = await this.getCurrentUser();
      if (user) {
        try {
          await supabase
            .from('sessions')
            .delete()
            .eq('user_id', user.id);
        } catch (dbError) {
          console.log('⚠️ Could not clear database session:', dbError.message);
        }
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.log('❌ Logout error:', error.message);
        return false;
      }
      
      console.log('✅ Logout successful');
      clearSessionStorage();
      clearCache();
      return true;
    } catch (error) {
      console.error('❌ Logout exception:', error);
      return false;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      // First check database session validity
      const sessionJson = localStorage.getItem('blog_session_data');
      if (sessionJson) {
        const sessionData = JSON.parse(sessionJson);
        const isValid = await checkDatabaseSession(sessionData.userId);
        
        if (!isValid) {
          console.log('❌ Database session invalid');
          clearSessionStorage();
          return null;
        }
      }
      
      // Then get from Supabase
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        // Update session activity
        updateSessionActivity(data.user.id);
        return data.user;
      }
      return null;
    } catch (error) {
      console.log('❌ Error getting current user:', error.message);
      return null;
    }
  },

  // Get current user with profile
  async getCurrentUserWithProfile() {
    try {
      const user = await this.getCurrentUser();
      
      if (!user) {
        return null;
      }
      
      // Try to get user profile from users table
      let profile = { 
        role: 'user', 
        name: user.email?.split('@')[0] || 'User' 
      };
      
      try {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profileData) {
          profile = profileData;
        }
      } catch (profileErr) {
        console.log('⚠️ Profile fetch error:', profileErr.message);
      }
      
      return {
        ...user,
        profile: profile
      };
    } catch (error) {
      console.log('❌ Get current user error:', error.message);
      return null;
    }
  },

  // Get current session
  async getCurrentSession() {
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session || null;
    } catch (error) {
      console.log('❌ Error getting session:', error.message);
      return null;
    }
  },

  // Check auth status
  async checkAuthStatus() {
    try {
      const status = await SessionManager.getSessionStatus();
      return status;
    } catch (error) {
      console.log('❌ Error checking auth status:', error.message);
      return {
        isAuthenticated: false,
        isValid: false,
        user: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Expose supabase for auth state
  supabase
};

// Initialize on startup
if (typeof window !== 'undefined') {
  console.log('🚀 Initializing Supabase client and session manager...');
  
  // Initialize session manager with delay to ensure everything is loaded
  setTimeout(async () => {
    try {
      await SessionManager.initialize();
      console.log('✅ Session manager initialized');
    } catch (error) {
      console.log('❌ Session manager initialization error:', error.message);
    }
  }, 500);
}