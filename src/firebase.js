// src/firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  increment, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  getDoc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your Firebase configuration (using YOUR actual keys)
const firebaseConfig = {
  apiKey: "AIzaSyARm6nM57tmC9IAWQhFooN6K4q8m5QLYLE",
  authDomain: "myapp-8db85.firebaseapp.com",
  projectId: "myapp-8db85",
  storageBucket: "myapp-8db85.firebasestorage.app",
  messagingSenderId: "669307880232",
  appId: "1:669307880232:web:0b6019819ed2180700061d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Helper functions
const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
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
  } catch (error) {
    console.error('Error formatting time:', error);
  }
  
  return 'Just now';
};

// Initialize Firestore with default posts if empty
export const initializeBlog = async () => {
  try {
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    if (postsSnapshot.empty) {
      console.log('Initializing Firestore with default posts...');
      
      const defaultPosts = [
        {
          title: 'Top Web Design Trends for 2025',
          excerpt: 'As web design and its best practices are ever-evolving, web designers need to constantly adapt to new challenges and opportunities.',
          content: '<h2>The Evolution of Web Design</h2><p>Web design has come a long way...</p>',
          category: 'design',
          image: 'https://www.hostinger.com/in/tutorials/wp-content/uploads/sites/52/2023/06/Website-Development-alt-1.jpg',
          date: 'Dec 15, 2024',
          readTime: '5 min read',
          featured: true,
          views: 0,
          comments: 0,
          likes: 0,
          createdAt: serverTimestamp()
        },
        {
          title: 'Building Scalable React Applications',
          excerpt: 'Learn best practices for creating maintainable and scalable React applications.',
          content: '<h2>Introduction to Scalable Architecture</h2><p>Building React applications...</p>',
          category: 'development',
          image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
          date: 'Dec 10, 2024',
          readTime: '8 min read',
          featured: false,
          views: 0,
          comments: 0,
          likes: 0,
          createdAt: serverTimestamp()
        }
      ];
      
      for (const post of defaultPosts) {
        await addDoc(collection(db, 'posts'), post);
      }
      
      console.log('Default posts added to Firestore');
    }
  } catch (error) {
    console.error('Error initializing blog:', error);
  }
};

// Blog API functions
export const blogAPI = {
  // Get all posts
  async getPosts() {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  },

  // Get single post
  async getPost(postId) {
    try {
      const docRef = doc(db, 'posts', postId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting post:', error);
      return null;
    }
  },

  // Create new post
  async createPost(postData) {
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        ...postData,
        views: 0,
        comments: 0,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...postData };
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  },

  // Track view
  async trackView(postId) {
    try {
      const sessionViews = JSON.parse(sessionStorage.getItem('firebase_views') || '{}');
      
      if (!sessionViews[postId]) {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          views: increment(1)
        });
        
        sessionViews[postId] = true;
        sessionStorage.setItem('firebase_views', JSON.stringify(sessionViews));
      }
      
      // Get updated view count
      const post = await this.getPost(postId);
      return post ? (post.views || 0) + 1 : 1;
    } catch (error) {
      console.error('Error tracking view:', error);
      return 0;
    }
  },

  // Get comments
  async getComments(postId) {
    try {
      const q = query(
        collection(db, 'posts', postId, 'comments'), 
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  },

  // Add comment
  async addComment(postId, commentData) {
    try {
      // Add comment
      const docRef = await addDoc(collection(db, 'posts', postId, 'comments'), {
        ...commentData,
        likes: 0,
        timestamp: serverTimestamp()
      });
      
      // Update post comment count
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: increment(1)
      });
      
      return { id: docRef.id, ...commentData };
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  },

  // Like comment
  async likeComment(postId, commentId) {
    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      await updateDoc(commentRef, {
        likes: increment(1)
      });
      return true;
    } catch (error) {
      console.error('Error liking comment:', error);
      return false;
    }
  },

  // Get popular posts
  async getPopularPosts(limit = 5) {
    try {
      const q = query(collection(db, 'posts'), orderBy('views', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.slice(0, limit).map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting popular posts:', error);
      return [];
    }
  },

  // Real-time listeners
  onPostsUpdate(callback) {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(posts);
    });
  },

  onCommentsUpdate(postId, callback) {
    const q = query(
      collection(db, 'posts', postId, 'comments'), 
      orderBy('timestamp', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(comments);
    });
  }
};

// Initialize blog on first load
initializeBlog();

export { db, auth, googleProvider, formatNumber, formatTimeAgo };
export default app;