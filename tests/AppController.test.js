import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /status', () => {
  it('should return 200 and an OK status', (done) => {
    chai.request(app)
      .get('/status')
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('redis').that.is.true;
        expect(res.body).to.have.property('db').that.is.true;
        done();
      });
  });
});

describe('GET /stats', () => {
  it('should return 200 and the number of users and files', (done) => {
    chai.request(app)
      .get('/stats')
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('users').that.is.a('number');
        expect(res.body).to.have.property('files').that.is.a('number');
        done();
      });
  });
});
