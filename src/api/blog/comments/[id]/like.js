import { connectToDatabase } from '../../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { id } = req.query;
  
  try {
    const { db } = await connectToDatabase();
    
    // Convert ID to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }
    
    // Increment likes
    const result = await db.collection('comments').updateOne(
      { _id: objectId },
      { $inc: { likes: 1 } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Get updated comment
    const updatedComment = await db.collection('comments').findOne({ _id: objectId });
    
    res.status(200).json({
      success: true,
      data: {
        likes: updatedComment.likes
      }
    });
    
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ error: 'Failed to like comment' });
  }
}