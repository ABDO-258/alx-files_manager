import Bull from 'bull';
import dbClient from './utils/db.js';

const userQueue = new Bull('userQueue');

async function enqueueJob() {
  const result = await dbClient.db.collection('users').insertOne({
    email: 'test@example.com',
    password: 'hashedpassword'
  });

  const userId = result.insertedId;

  await userQueue.add({ userId });
  console.log('Job added to userQueue');
}

enqueueJob().catch(console.error);
