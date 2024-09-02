import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class FilesController {
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(token);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      name,
      type,
      parentId = 0,
      isPublic = false,
      data,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    if (!['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    let filePath = null;
    const { db } = dbClient;

    // Validate parentId if provided
    if (parentId !== 0) {
      const parentFile = await db.collection('files').findOne({ _id: new ObjectId(parentId) });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const newFile = {
      userId: new ObjectId(userId),
      name,
      type,
      isPublic,
      parentId: parentId === 0 ? '0' : new ObjectId(parentId),
    };

    if (type === 'folder') {
      // Save folder information to the database
      const result = await db.collection('files').insertOne(newFile);
      return res.status(201).json({
        id: result.insertedId,
        userId,
        name,
        type,
        isPublic,
        parentId,
      });
    }

    // Handle file and image types
    const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
    const fileName = uuidv4();
    const fileData = Buffer.from(data, 'base64');

    if (!fs.existsSync(FOLDER_PATH)) {
      fs.mkdirSync(FOLDER_PATH, { recursive: true });
    }

    filePath = path.join(FOLDER_PATH, fileName);
    fs.writeFileSync(filePath, fileData);

    newFile.localPath = filePath;
    const result = await db.collection('files').insertOne(newFile);

    return res.status(201).json({
      id: result.insertedId,
      userId,
      name,
      type,
      isPublic,
      parentId,
    });
  }
}

export default FilesController;
