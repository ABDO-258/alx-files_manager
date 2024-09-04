import Bull from 'bull';
import sharp from 'sharp';
import { ObjectId } from 'mongodb';
import dbClient from './utils/db';

const fileQueue = new Bull('fileQueue');
const userQueue = new Bull('userQueue');

fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  if (!userId) {
    throw new Error('Missing userId');
  }

  const file = await dbClient.db.collection('files').findOne({ _id: new ObjectId(fileId), userId: new ObjectId(userId) });

  if (!file) {
    throw new Error('File not found');
  }

  const { localPath, name } = file;
  const sizes = [500, 250, 100];

  try {
    await Promise.all(sizes.map(async (size) => {
      const outputFilePath = `${localPath}_${size}`;
      await sharp(localPath)
        .resize({ width: size })
        .toFile(outputFilePath);
    }));
    console.log(`Thumbnails generated for file ${name}`);
  } catch (err) {
    console.error(`Error generating thumbnails for file ${name}: ${err.message}`);
  }
});

userQueue.process(async (job) => {
  const { userId } = job.data;

  if (!userId) {
    throw new Error('Missing userId');
  }

  const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new Error('User not found');
  }

  const { email } = user;

  // Simulate sending email
  console.log(`Welcome ${email}!`);

});