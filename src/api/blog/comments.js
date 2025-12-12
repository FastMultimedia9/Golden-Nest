import { connectToDatabase } from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getComments(req, res);
  }
  
  if (req.method === 'POST') {
    return createComment(req, res);
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}

async function getComments(req, res) {
  try {
    const { postId, parentId = null, page = 1, limit = 20 } = req.query;
    
    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }
    
    const { db } = await connectToDatabase();
    
    // Convert postId to ObjectId
    let postObjectId;
    try {
      postObjectId = new ObjectId(postId);
    } catch {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    // Build query
    const query = { 
      postId: postObjectId,
      parentId: parentId ? new ObjectId(parentId) : null
    };
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get comments
    const comments = await db.collection('comments')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    // Get total count
    const total = await db.collection('comments').countDocuments(query);
    
    // For each comment, get replies count
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const repliesCount = await db.collection('comments').countDocuments({
          parentId: comment._id
        });
        
        return {
          ...comment,
          repliesCount
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: commentsWithReplies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
}

async function createComment(req, res) {
  try {
    const { db } = await connectToDatabase();
    const { postId, parentId, text, userName, userEmail } = req.body;
    
    if (!postId || !text || !userName) {
      return res.status(400).json({ 
        error: 'Post ID, text, and user name are required' 
      });
    }
    
    // Convert IDs to ObjectId
    let postObjectId;
    let parentObjectId = null;
    
    try {
      postObjectId = new ObjectId(postId);
      if (parentId) {
        parentObjectId = new ObjectId(parentId);
      }
    } catch {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    // Verify post exists
    const post = await db.collection('posts').findOne({ _id: postObjectId });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Generate avatar URL based on email or random
    const avatar = userEmail 
      ? `https://www.gravatar.com/avatar/${md5(userEmail.trim().toLowerCase())}?d=identicon&s=200`
      : `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
    
    const commentData = {
      postId: postObjectId,
      parentId: parentObjectId,
      text,
      userName,
      userEmail: userEmail || null,
      avatar,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('comments').insertOne(commentData);
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertedId,
        ...commentData
      }
    });
    
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
}

// Helper function for MD5 (for Gravatar)
function md5(string) {
  // Simple MD5 implementation or use a library
  // For now, we'll use a placeholder
  return CryptoJS.MD5(string).toString();
}