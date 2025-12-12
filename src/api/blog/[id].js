import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    return getPost(req, res, id);
  }
  
  if (req.method === 'PUT') {
    return updatePost(req, res, id);
  }
  
  if (req.method === 'DELETE') {
    return deletePost(req, res, id);
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}

async function getPost(req, res, id) {
  try {
    const { db } = await connectToDatabase();
    
    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    // Get the post
    const post = await db.collection('posts').findOne({ _id: objectId });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Increment view count
    await db.collection('views').updateOne(
      { postId: objectId },
      { $inc: { count: 1 }, $setOnInsert: { postId: objectId } },
      { upsert: true }
    );
    
    // Get view count
    const views = await db.collection('views').findOne({ postId: objectId });
    
    // Get comment count
    const commentCount = await db.collection('comments').countDocuments({ 
      postId: objectId,
      parentId: null // Only count top-level comments
    });
    
    // Get related posts (same category)
    const relatedPosts = await db.collection('posts')
      .find({ 
        _id: { $ne: objectId },
        category: post.category,
        published: true
      })
      .limit(3)
      .toArray();
    
    // Add stats to related posts
    const relatedWithStats = await Promise.all(
      relatedPosts.map(async (relatedPost) => {
        const relatedViews = await db.collection('views').findOne({ 
          postId: relatedPost._id 
        });
        const relatedComments = await db.collection('comments').countDocuments({ 
          postId: relatedPost._id,
          parentId: null
        });
        
        return {
          ...relatedPost,
          views: relatedViews?.count || 0,
          comments: relatedComments || 0
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: {
        ...post,
        views: views?.count || 0,
        commentCount,
        relatedPosts: relatedWithStats
      }
    });
    
  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).json({ error: 'Failed to get post' });
  }
}