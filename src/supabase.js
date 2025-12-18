import { createClient } from '@supabase/supabase-js'

// Your actual credentials
const supabaseUrl = 'https://ymqlxvvschytbkkjexvd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcWx4dnZzY2h5dGJra2pleHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MjI2NjUsImV4cCI6MjA4MTQ5ODY2NX0.oZr6o8cg_WuJ83maXa-d8a3TfVAtQaGp3EXftUidjzo'

// SINGLETON PATTERN - Only create client once
let supabaseInstance = null;

const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: localStorage,
        storageKey: 'sb-auth-token',
        autoConfirmEmail: true
      },
      global: {
        headers: {
          'Content-Type': 'application/json'
        }
      },
      db: {
        schema: 'public'
      }
    });
  }
  return supabaseInstance;
};

// Export a single instance
export const supabase = getSupabase();

// Test connection - SIMPLIFIED
export const testConnection = async () => {
  try {
    console.log('🔧 Testing Supabase connection...');
    
    // Test 1: Simple health check
    const { data: health, error: healthError } = await supabase.rpc('say_hello');
    
    if (!healthError) {
      console.log('✅ Supabase connection test 1 passed');
    }
    
    // Test 2: Try to query posts directly (no joins)
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('id, title')
      .limit(1);
    
    if (postsError) {
      console.error('❌ Posts query failed:', postsError.message);
      return false;
    }
    
    console.log('✅ Posts query test passed, found:', postsData?.length || 0, 'posts');
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error);
    return false;
  }
}

// Simple data transformation - NO DEPENDENCIES
const transformPostData = (post) => {
  if (!post) return null;
  
  return {
    id: post.id,
    title: post.title || 'Untitled Post',
    excerpt: post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : 'Read more...'),
    content: post.content || '',
    category: (post.category || 'general').toLowerCase(),
    image_url: post.image_url || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=800&auto=format&fit=crop`,
    theme: post.theme || 'default',
    views: parseInt(post.views || 0),
    comments: parseInt(post.comments_count || 0),
    likes: parseInt(post.likes || 0),
    featured: post.featured || false,
    published: post.published !== false,
    created_at: post.created_at || new Date().toISOString(),
    updated_at: post.updated_at || new Date().toISOString(),
    readTime: '5 min read',
    author: post.users?.name || post.users?.username || 'Author',
    author_id: post.user_id,
    user_id: post.user_id
  };
};

const transformPostsData = (posts) => {
  if (!Array.isArray(posts)) return [];
  return posts.map(transformPostData).filter(Boolean);
};

// SIMPLE BLOG API - NO COMPLEX JOINS INITIALLY
export const blogAPI = {
  // Get posts WITHOUT user joins first
  async getPostsSimple() {
    try {
      console.log('🔄 Getting simple posts (no joins)...');
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Simple posts error:', error.message);
        
        // Try even simpler query
        const { data: simpleData, error: simpleError } = await supabase
          .from('posts')
          .select('id, title, published')
          .limit(10);
          
        if (simpleError) {
          throw simpleError;
        }
        return simpleData || [];
      }
      
      console.log('✅ Simple posts fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Exception in getPostsSimple:', error.message);
      
      // If table might not exist, return empty array
      if (error.message.includes('does not exist') || error.message.includes('relation')) {
        console.warn('⚠️ Posts table might not exist yet');
        return [];
      }
      return [];
    }
  },

  // Get posts with user joins - SAFE VERSION
  async getPosts() {
    try {
      console.log('🔄 Getting posts with user info...');
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users:user_id (name, username, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('⚠️ Failed to get posts with joins:', error.message);
        
        // Fallback to simple posts
        console.log('🔄 Falling back to simple posts...');
        const simplePosts = await this.getPostsSimple();
        
        // Add default author info
        return simplePosts.map(post => ({
          ...post,
          author: 'Author',
          users: { name: 'Author', username: 'author', email: '' }
        }));
      }
      
      console.log('✅ Posts with user info fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Exception in getPosts:', error);
      return [];
    }
  },

  // Get user-specific posts - ULTRA SIMPLE
  async getUserPosts(userId = null) {
    try {
      console.log('🔄 Getting user posts...');
      
      // First, just get all posts without filtering
      const allPosts = await this.getPosts();
      
      console.log('📊 Total posts found:', allPosts.length);
      
      // If no user is logged in, return only published posts
      const { data: session } = await supabase.auth.getSession();
      const currentUser = session?.session?.user;
      
      if (!currentUser) {
        console.log('👤 No user logged in, showing only published posts');
        const publishedPosts = allPosts.filter(post => post.published === true);
        console.log('📄 Published posts:', publishedPosts.length);
        return transformPostsData(publishedPosts);
      }
      
      // Get user role
      let isAdmin = false;
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', currentUser.id)
          .maybeSingle();
          
        isAdmin = userData?.role === 'admin';
        console.log('👑 User is admin?', isAdmin);
      } catch (roleError) {
        console.warn('⚠️ Could not check user role:', roleError.message);
      }
      
      // Filter posts based on user role
      let filteredPosts;
      if (isAdmin) {
        // Admin sees all posts
        filteredPosts = allPosts;
        console.log('👑 Admin view: All posts');
      } else {
        // Regular user sees their own posts + published posts
        filteredPosts = allPosts.filter(post => 
          post.user_id === currentUser.id || post.published === true
        );
        console.log('👤 User view: Own + published posts');
      }
      
      console.log('✅ Final filtered posts:', filteredPosts.length);
      return transformPostsData(filteredPosts);
    } catch (error) {
      console.error('❌ Error in getUserPosts:', error);
      return [];
    }
  },

  // Get single post
  async getPost(id) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return transformPostData(data);
    } catch (error) {
      console.error('Error in getPost:', error);
      return null;
    }
  },

  // Get popular posts
  async getPopularPosts(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('views', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return transformPostsData(data);
    } catch (error) {
      console.error('Error in getPopularPosts:', error);
      return [];
    }
  },

  // Track view count
  async trackView(postId) {
    try {
      // Get current views
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('views')
        .eq('id', postId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching post for view tracking:', fetchError);
        return 0;
      }
      
      const currentViews = parseInt(post?.views || 0);
      const newViews = currentViews + 1;
      
      // Update views
      const { error: updateError } = await supabase
        .from('posts')
        .update({ views: newViews })
        .eq('id', postId);
      
      if (updateError) {
        console.error('Error updating view count:', updateError);
        return currentViews;
      }
      
      return newViews;
    } catch (error) {
      console.error('Error in trackView:', error);
      return 0;
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
      
      return data[0];
    } catch (error) {
      console.error('Error adding comment:', error);
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
        theme: postData.theme || 'default',
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
      console.error('Error in createPost:', error);
      return null;
    }
  }
};

// SIMPLE AUTH API
export const authAPI = {
  async getCurrentUserWithProfile() {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session?.user) {
        return null;
      }
      
      const user = sessionData.session.user;
      
      // Try to get profile
      let profile = { role: 'user', name: user.email?.split('@')[0] || 'User' };
      
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
        console.warn('Profile fetch error:', profileErr.message);
      }
      
      return {
        ...user,
        profile: profile
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async adminLogin(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        console.error('Login error:', error);
        return { 
          success: false, 
          error: error.message || 'Invalid email or password' 
        };
      }

      if (data.user) {
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_username', data.user.email);
        localStorage.setItem('admin_session', Date.now().toString());
        
        return {
          success: true,
          user: data.user,
          message: 'Login successful!'
        };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login exception:', error);
      return { 
        success: false, 
        error: 'Login failed. Please check your connection.' 
      };
    }
  },

  async logout() {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_role');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }
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

// Initialize and test
console.log('🚀 Initializing Supabase...');
testConnection().then(success => {
  if (success) {
    console.log('🎉 Supabase initialized successfully!');
  } else {
    console.warn('⚠️ Supabase initialization had issues.');
  }
});