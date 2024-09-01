import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const userId = await redisClient.get(token);
      // console.log('User ID from Redis:', userId); // Debugging log

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { db } = dbClient;
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      // console.log('User from MongoDB:', user); // Debugging log

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      return res.status(200).json({ id: user._id, email: user.email });
    } catch (err) {
      console.error('Error retrieving user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const { db } = dbClient;

    try {
      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

      // Create a new user
      const result = await db.collection('users').insertOne({
        email,
        password: hashedPassword,
      });

      const newUser = result.ops[0];
      return res.status(201).json({ id: newUser._id, email: newUser.email });
    } catch (err) {
      console.error('Error creating user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UsersController;
