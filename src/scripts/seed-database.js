import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config(); // Load environment variables

const posts = [
  {
    title: 'Top Web Design Trends for 2025',
    excerpt: 'As web design and its best practices are ever-evolving, web designers need to constantly adapt to new challenges and opportunities.',
    category: 'design',
    date: 'Dec. 15, 2025',
    readTime: '5 min read',
    image: 'https://www.hostinger.com/in/tutorials/wp-content/uploads/sites/52/2023/06/Website-Development-alt-1.jpg',
    featured: true,
    content: '...',
    createdAt: new Date(),
    updatedAt: new Date(),
    published: true
  },
  // Add more posts...
];

async function seedDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Clear existing data
    await db.collection('posts').deleteMany({});
    await db.collection('comments').deleteMany({});
    await db.collection('views').deleteMany({});
    
    // Insert posts
    const result = await db.collection('posts').insertMany(posts);
    console.log(`Inserted ${result.insertedCount} posts`);
    
    // Add initial views for each post
    const viewPromises = posts.map((post, index) => {
      return db.collection('views').insertOne({
        postId: result.insertedIds[index],
        count: Math.floor(Math.random() * 1000) + 100
      });
    });
    
    await Promise.all(viewPromises);
    console.log('Added view counts');
    
    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();