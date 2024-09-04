import Bull from 'bull';

const userQueue = new Bull('userQueue', {
  redis: {
    host: 'localhost',
    port: 6379
  }
});

export default userQueue;
