import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const { expect } = chai;
chai.use(chaiHttp);

before((done) => {
  // Optional: Start server if not automatically started
  done();
});

after((done) => {
  // Optional: Close server if started manually
  done();
});

describe('POST /files', () => {
  it('should upload a file and return 201', (done) => {
    chai.request(app)
      .post('/files')
      .set('x-token', 'valid_token')
      .send({ name: 'test.txt', type: 'file', data: 'dGVzdCBkYXRh' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name', 'test.txt');
        done();
      });
  });
});

describe('GET /files/:id', () => {
  it('should return 200 and the file details', (done) => {
    chai.request(app)
      .get('/files/valid_id')
      .set('x-token', 'valid_token')
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name');
        done();
      });
  });
});

describe('GET /files', () => {
  it('should return 200 and a list of files', (done) => {
    chai.request(app)
      .get('/files')
      .set('x-token', 'valid_token')
      .query({ page: 0 })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});

describe('PUT /files/:id/publish', () => {
  it('should publish the file and return 200', (done) => {
    chai.request(app)
      .put('/files/valid_id/publish')
      .set('x-token', 'valid_token')
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('isPublic', true);
        done();
      });
  });
});

describe('PUT /files/:id/unpublish', () => {
  it('should unpublish the file and return 200', (done) => {
    chai.request(app)
      .put('/files/valid_id/unpublish')
      .set('x-token', 'valid_token')
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('isPublic', false);
        done();
      });
  });
});

describe('GET /files/:id/data', () => {
  it('should return the file content', (done) => {
    chai.request(app)
      .get('/files/valid_id/data')
      .set('x-token', 'valid_token')
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.text).to.be.a('string');
        done();
      });
  });
});