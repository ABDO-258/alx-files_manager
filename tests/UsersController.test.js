import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import crypto from 'crypto';
import { MongoClient } from 'mongodb';
import app from '../server';
import dbClient from '../utils/db';

const { expect } = chai;
chai.use(chaiHttp);

describe('POST /users', () => {
  let dbStub;
  let findOneStub;
  let insertOneStub;

  before(() => {
    // Stub the dbClient.db method to return a mock collection
    findOneStub = sinon.stub();
    insertOneStub = sinon.stub();
    
    dbStub = sinon.stub(dbClient, 'db').returns({
      collection: () => ({
        findOne: findOneStub,
        insertOne: insertOneStub,
      }),
    });
  });

  after(() => {
    dbStub.restore();
  });

  it('should return 400 if email is missing', (done) => {
    chai.request(app)
      .post('/users')
      .send({ password: '123456' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'Missing email');
        done();
      });
  });

  it('should return 400 if password is missing', (done) => {
    chai.request(app)
      .post('/users')
      .send({ email: 'test@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'Missing password');
        done();
      });
  });

  it('should return 400 if user already exists', (done) => {
    // Mock existing user in the database
    findOneStub.resolves({ email: 'test2@example.com' });

    chai.request(app)
      .post('/users')
      .send({ email: 'test2@example.com', password: '123456' })
      .end((err, res) => {
        console.log('findOneStub called:', findOneStub.calledOnce);  // Debugging info
        console.log('insertOneStub called:', insertOneStub.called);  // Debugging info
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'Already exist');
        done();
      });
  });

  // it('should create a new user and return 201', (done) => {
  //   // Mock no existing user in the database and successful insert
  //   findOneStub.resolves(null);
  //   insertOneStub.resolves({
  //     ops: [{ _id: 'some_unique_id', email: 'test@example.com' }],
  //   });

  //   chai.request(app)
  //     .post('/users')
  //     .send({ email: 'test@example.com', password: '123456' })
  //     .end((err, res) => {
  //       console.log('findOneStub called:', findOneStub.calledOnce);  // Debugging info
  //       console.log('insertOneStub called:', insertOneStub.calledOnce);  // Debugging info
  //       console.log('Response:', res.body);
  //       expect(res).to.have.status(201);
  //       expect(res.body).to.have.property('id', 'some_unique_id');
  //       expect(res.body).to.have.property('email', 'test@example.com');
  //       done();
  //     });
  // });

  // it('should return 500 if there is an internal server error', (done) => {
  //   // Mock an error during insert
  //   findOneStub.resolves(null);
  //   insertOneStub.rejects(new Error('Internal server error'));

  //   chai.request(app)
  //     .post('/users')
  //     .send({ email: 'test@example.com', password: '123456' })
  //     .end((err, res) => {
  //       console.log('findOneStub called:', findOneStub.calledOnce);  // Debugging info
  //       console.log('insertOneStub called:', insertOneStub.calledOnce);  // Debugging info
  //       console.log('Response:', res.body);
  //       expect(res).to.have.status(500);
  //       expect(res.body).to.have.property('error', 'Internal server error');
  //       done();
  //     });
  // });
});
