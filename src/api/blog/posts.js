import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getPosts(req, res);
  }
  
  if (req.method === 'POST') {
    return createPost(req, res);
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}

async function getPosts(req, res) {
  try {
    const { db } = await connectToDatabase();
    
    // Get query parameters
    const { category, limit = 10, page = 1, sort = 'newest' } = req.query;
    
    // Build query
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Build sort
    let sortOption = {};
    if (sort === 'newest') {
      sortOption.createdAt = -1;
    } else if (sort === 'popular') {
      sortOption.views = -1;
    } else if (sort === 'oldest') {
      sortOption.createdAt = 1;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get posts
    const posts = await db.collection('posts')
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    // Get total count for pagination
    const total = await db.collection('posts').countDocuments(query);
    
    // Get view counts for each post
    const postsWithStats = await Promise.all(
      posts.map(async (post) => {
        const views = await db.collection('views').findOne({ postId: post._id });
        const comments = await db.collection('comments').countDocuments({ 
          postId: post._id, 
          parentId: null // Only count top-level comments
        });
        
        return {
          ...post,
          views: views?.count || 0,
          comments: comments || 0
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: postsWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
}

async function createPost(req, res) {
  try {
    // Basic authentication (in production, use proper auth)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { db } = await connectToDatabase();
    
    const postData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      published: req.body.published || false
    };
    
    const result = await db.collection('posts').insertOne(postData);
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertedId,
        ...postData
      }
    });
    
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
}