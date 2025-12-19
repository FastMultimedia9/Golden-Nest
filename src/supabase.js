import { createClient } from '@supabase/supabase-js'

// Your actual credentials
const supabaseUrl = 'https://ymqlxvvschytbkkjexvd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcWx4dnZzY2h5dGJra2pleHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MjI2NjUsImV4cCI6MjA4MTQ5ODY2NX0.oZr6o8cg_WuJ83maXa-d8a3TfVAtQaGp3EXftUidjzo'

// SINGLETON PATTERN: Create client only once
let supabaseInstance = null;

const getSupabaseClient = () => {
  if (!supabaseInstance) {
    console.log('🔄 Creating Supabase client instance...');
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storage: localStorage,
        storageKey: 'sb-auth-token'
      }
    });
  }
  return supabaseInstance;
};

// Export the single instance
export const supabase = getSupabaseClient();

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

// SIMPLE BLOG API
export const blogAPI = {
  async getPosts() {
    try {
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
        .order('created_at', { ascending: false });
      
      if (error) {
        console.log('⚠️ Error fetching posts:', error.message);
        return [];
      }
      
      console.log(`✅ Found ${data?.length || 0} posts`);
      return data || [];
    } catch (error) {
      console.log('❌ Exception in getPosts:', error.message);
      return [];
    }
  },

  // NEW: Get posts by specific user ID
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
        .eq('user_id', userId)  // Filter by user_id
        .order('created_at', { ascending: false });
      
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

  // FIXED: getUserPosts - removed the problematic logic
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
        .order('created_at', { ascending: false });
      
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

  async getPost(id) {
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
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      return transformPostData(data);
    } catch (error) {
      console.log('❌ Error in getPost:', error.message);
      return null;
    }
  },

  async trackView(postId) {
    try {
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
      
      return newViews;
    } catch (error) {
      console.log('⚠️ Error tracking view:', error.message);
      return 0;
    }
  },

  // NEW: Update post function
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
      
      // Filter out undefined values
      const cleanPostToUpdate = Object.fromEntries(
        Object.entries(postToUpdate).filter(([_, v]) => v !== undefined)
      );
      
      const { data, error } = await supabase
        .from('posts')
        .update(cleanPostToUpdate)
        .eq('id', postId)
        .select();
      
      if (error) throw error;
      
      return transformPostData(data[0]);
    } catch (error) {
      console.log('Error in updatePost:', error.message);
      return null;
    }
  },

  // NEW: Delete post function
  async deletePost(postId) {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('User must be logged in to delete posts');
      }
      
      // First, delete associated comments (to maintain referential integrity)
      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .eq('post_id', postId);
      
      if (commentsError) {
        console.log('Warning: Could not delete comments:', commentsError.message);
        // Continue with post deletion even if comments deletion fails
      }
      
      // Then delete the post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.log('Error in deletePost:', error.message);
      return false;
    }
  },

  // Get comments for a post
  async getComments(postId) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.log('Error getting comments:', error.message);
        return [];
      }
      
      // Transform comment data
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

  // Add comment
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
      
      // Update the post's comments count
      await supabase.rpc('increment_comments_count', { post_id: postId });
      
      return data[0];
    } catch (error) {
      console.log('Error adding comment:', error.message);
      return null;
    }
  },

  // Like comment
  async likeComment(commentId) {
    try {
      // Get current likes
      const { data: comment, error: fetchError } = await supabase
        .from('comments')
        .select('likes')
        .eq('id', commentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const currentLikes = parseInt(comment?.likes || 0);
      const newLikes = currentLikes + 1;
      
      // Update likes
      const { error: updateError } = await supabase
        .from('comments')
        .update({ likes: newLikes })
        .eq('id', commentId);
      
      if (updateError) throw updateError;
      
      return newLikes;
    } catch (error) {
      console.log('Error in likeComment:', error.message);
      return null;
    }
  },

  // Create post
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
      
      return transformPostData(data[0]);
    } catch (error) {
      console.log('Error in createPost:', error.message);
      return null;
    }
  }
};

// COMPLETE AUTH API
export const authAPI = {
  // Check if user is logged in
  async isLoggedIn() {
    try {
      const { data } = await supabase.auth.getSession();
      return !!data?.session?.user;
    } catch {
      return false;
    }
  },

  // Login user
  async adminLogin(email, password) {
    try {
      console.log('🔐 Attempting login for:', email);
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });
      
      if (error) {
        console.log('Login error:', error.message);
        return { 
          success: false, 
          error: error.message || 'Invalid email or password' 
        };
      }
      
      if (data?.user) {
        console.log('✅ Login successful for user:', data.user.email);
        
        // Check if user is admin (you can customize this logic)
        let isAdmin = false;
        try {
          // Check if user exists in users table with admin role
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.user.id)
            .maybeSingle();
          
          isAdmin = userData?.role === 'admin';
        } catch (err) {
          console.log('Could not check admin status:', err.message);
          // Default to false if can't check
          isAdmin = false;
        }
        
        return { 
          success: true, 
          user: data.user,
          isAdmin: isAdmin
        };
      }
      
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    } catch (error) {
      console.error('Login exception:', error);
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      console.log('🔑 Resetting password for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      
      if (error) {
        console.log('Reset password error:', error.message);
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
      console.error('Reset password exception:', error);
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
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            name: name || email.split('@')[0]
          }
        }
      });
      
      if (error) {
        console.log('Registration error:', error.message);
        return { 
          success: false, 
          error: error.message || 'Registration failed' 
        };
      }
      
      if (data?.user) {
        console.log('✅ Registration successful for:', data.user.email);
        
        // Create user profile in users table (optional)
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
          console.log('Profile creation error (optional):', profileErr.message);
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
      console.error('Registration exception:', error);
      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      };
    }
  },

  // Logout
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.log('Logout error:', error.message);
        return false;
      }
      
      console.log('✅ Logout successful');
      return true;
    } catch (error) {
      console.error('Logout exception:', error);
      return false;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session?.user || null;
    } catch {
      return null;
    }
  },

  // Get current user with profile
  async getCurrentUserWithProfile() {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session?.user) {
        return null;
      }
      
      const user = sessionData.session.user;
      
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
        console.log('Profile fetch error:', profileErr.message);
      }
      
      return {
        ...user,
        profile: profile
      };
    } catch (error) {
      console.log('Get current user error:', error.message);
      return null;
    }
  }
};

// Initialize only once
if (typeof window !== 'undefined') {
  console.log('🚀 Initializing Supabase (singleton)...');
}

// Database Function for Incrementing Comments Count
// Run this SQL in your Supabase SQL editor:
/*
CREATE OR REPLACE FUNCTION increment_comments_count(post_id_param bigint)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET comments_count = comments_count + 1
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;
*/