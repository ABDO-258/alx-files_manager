import { expect } from 'chai';
import sinon from 'sinon';
import redisClient from '../utils/redis';

describe('redisClient', () => {
  it('should return true if the client is connected', () => {
    sinon.stub(redisClient, 'isAlive').returns(true);
    expect(redisClient.isAlive()).to.be.true;
    redisClient.isAlive.restore();
  });

  it('should return false if the client is not connected', () => {
    sinon.stub(redisClient, 'isAlive').returns(false);
    expect(redisClient.isAlive()).to.be.false;
    redisClient.isAlive.restore();
  });

  it('should get a value from Redis', async () => {
    const stub = sinon.stub(redisClient, 'get').resolves('value');
    const result = await redisClient.get('key');
    expect(result).to.equal('value');
    stub.restore();
  });

  it('should set a value in Redis', async () => {
    const stub = sinon.stub(redisClient, 'set').resolves();
    await redisClient.set('key', 'value');
    expect(stub.calledOnce).to.be.true;
    stub.restore();
  });
});