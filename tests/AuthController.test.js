import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /connect', () => {
  it('should return 200 and a token', (done) => {
    chai.request(app)
      .get('/connect')
      .auth('test@example.com', '123456')
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });
});

describe('GET /disconnect', () => {
  it('should return 204 on successful logout', (done) => {
    request(app)
      .get('/disconnect')
      .set('x-token', 'valid_token')
      .expect(204, done);
  });
});