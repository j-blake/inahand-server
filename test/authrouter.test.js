import { assert } from 'chai';
import { restore, stub, spy } from 'sinon';
import { response as _response } from 'express';
import { agent as _agent } from 'supertest';
import authRouter from '../server/routes/public/auth';
import * as userService from '../server/service/user';
import * as passwordService from '../server/service/password';
import sessionService, { destroySession } from '../server/service/session';
import app, { use, _router } from './mockApp';

const agent = _agent(app);

suite('auth router', function authRouterSuite() {
  const first = 'nathaniel';
  const last = 'tarp';
  const email = 'y@t.com';
  const password = 'passString';

  suiteSetup(function suiteSetup() {
    use((req, res, done) => {
      req.session = {};
      done();
    });
    use('/api', authRouter);
  });

  setup(function setup() {
    // do any setup here
  });

  teardown(function teardown() {
    restore();
  });

  suiteTeardown(function suiteTeardown() {
    // eslint-disable-next-line no-underscore-dangle
    _router.stack.pop();
    // eslint-disable-next-line no-underscore-dangle
    _router.stack.pop();
  });

  test('should return first name, last name, email on successful user creation', function successfulUserCreation(done) {
    stub(passwordService, 'createPasswordHash').resolves('passwordHash');
    stub(userService, 'createUser').resolves({
      firstName: first,
      lastName: last,
      email,
    });
    agent
      .post('/api/auth/create')
      .send({
        firstName: first,
        lastName: last,
        email,
        password,
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(201)
      .then((response) => {
        const { firstName, lastName, email: emailAddress } = response.body.user;
        assert.equal(firstName, first);
        assert.equal(lastName, last);
        assert.equal(emailAddress, email);
        done();
      })
      .catch((err) => done(err));
  });

  test('should return 401 on invalid login attempt', function invalidLoginAttempt(done) {
    stub(userService, 'findByAuthentication').resolves(null);
    agent
      .post('/api/auth/login')
      .send({ email, password })
      .expect(
        'WWW-Authenticate',
        'Bearer realm="Access to inahand data layer" charset="UTF-8"'
      )
      .expect(401, done);
  });

  test('should return 200 on valid login', function validLoginAttempt(done) {
    stub(userService, 'findByAuthentication').resolves({ id: 42 });
    stub(userService, 'createUserAgentDocument').returns();
    stub(sessionService, 'saveSession').resolves(true);
    agent
      .post('/api/auth/login')
      .send({
        email,
        password,
      })
      .expect(200, done);
  });

  test('should return 400 on login if session save fails', function missingPassword(done) {
    stub(userService, 'findByAuthentication').resolves({ id: 7 });
    stub(userService, 'createUserAgentDocument').returns();
    stub(sessionService, 'saveSession').throws();
    agent.post('/api/auth/login').send({ email }).expect(400, done);
  });

  test('should delete the session document if it exists and clear cookie when logging out', function deleteSessionDocument(done) {
    stub(sessionService, 'destroySession').resolves();
    spy(_response, 'clearCookie');
    agent
      .post('/api/auth/logout')
      .expect(204)
      .then(() => {
        assert(destroySession.calledOnce);
        assert(_response.clearCookie.calledOnce);
        done();
      })
      .catch((err) => done(err));
  });

  test('should clear the cookie even if error thrown when logging out', function clearSessionCookie(done) {
    stub(sessionService, 'destroySession').throws();
    spy(_response, 'clearCookie');
    agent
      .post('/api/auth/logout')
      .expect(204)
      .then(() => {
        assert(destroySession.calledOnce);
        assert(_response.clearCookie.calledOnce);
        done();
      })
      .catch((err) => done(err));
  });

  test('should return 204 with a valid session', function validSession(done) {
    stub(sessionService, 'isValidSession').resolves(true);
    agent.get('/api/auth/check').expect(204, done);
  });

  test('should return 401 with a missing session', function noValidSession(done) {
    stub(sessionService, 'isValidSession').resolves(false);
    agent.get('/api/auth/check').expect(401, done);
  });

  test('should return 401 on error thrown during session validation', function validSession(done) {
    stub(sessionService, 'isValidSession').throws();
    agent.get('/api/auth/check').expect(401, done);
  });
});
