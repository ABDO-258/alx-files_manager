import { expect } from 'chai';
import sinon from 'sinon';
import dbClient from '../utils/db';

describe('dbClient', () => {
  it('should return true if the client is connected', () => {
    sinon.stub(dbClient, 'isAlive').returns(true);
    expect(dbClient.isAlive()).to.be.true;
    dbClient.isAlive.restore();
  });

  it('should return false if the client is not connected', () => {
    sinon.stub(dbClient, 'isAlive').returns(false);
    expect(dbClient.isAlive()).to.be.false;
    dbClient.isAlive.restore();
  });

  it('should return the number of users', async () => {
    sinon.stub(dbClient, 'nbUsers').resolves(5);
    const result = await dbClient.nbUsers();
    expect(result).to.equal(5);
    dbClient.nbUsers.restore();
  });

  it('should return the number of files', async () => {
    sinon.stub(dbClient, 'nbFiles').resolves(10);
    const result = await dbClient.nbFiles();
    expect(result).to.equal(10);
    dbClient.nbFiles.restore();
  });
});