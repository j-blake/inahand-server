import { assert } from 'chai';
import { restore, stub, spy, SinonStub } from 'sinon';
import { response as _response } from 'express';
import { agent as _agent } from 'supertest';
import authRouter from '../server/routes/public/auth';
import * as userService from '../server/service/user';
import * as passwordService from '../server/service/password';
import * as sessionService from '../server/service/session';
import app from './mockApp';
import { Session } from '../server/@types/session';
import { User } from '../server/@types/user';
import { UserAgent } from '../server/@types/userAgent';

const agent = _agent(app);

suite('auth router', function authRouterSuite() {
  const first = 'nathaniel';
  const last = 'tarp';
  const email = 'y@t.com';
  const password = 'passString';

  const userMock: User = {
    id: '123',
    passwordHash: 'hashahash',
    firstName: first,
    lastName: last,
    email,
    isActive: true,
    profiles: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const userAgentMock: UserAgent = {
    agent: 'agent',
    device: 'a good one',
    ipAddress: 'localhost',
    os: 'thingOS',
  };

  suiteSetup(function suiteSetup() {
    app.use((req, _, done) => {
      req.session = {} as Session;
      done();
    });
    app.use('/api', authRouter);
  });

  setup(function setup() {
    // do any setup here
  });

  teardown(function teardown() {
    restore();
  });

  suiteTeardown(function suiteTeardown() {
    // eslint-disable-next-line no-underscore-dangle
    app._router.stack.pop();
    // eslint-disable-next-line no-underscore-dangle
    app._router.stack.pop();
  });

  test('should return first name, last name, email on successful user creation', function successfulUserCreation(done) {
    stub(passwordService, 'createPasswordHash').resolves('passwordHash');
    stub(userService, 'createUser').resolves(userMock);
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
    stub(userService, 'findByAuthentication').resolves({
      ...userMock,
      id: '42',
    });
    stub(userService, 'createUserAgentDocument').returns(userAgentMock);
    stub(sessionService, 'saveSession').resolves();
    agent
      .post('/api/auth/login')
      .send({
        email,
        password,
      })
      .expect(200, done);
  });

  test('should return 400 on login if session save fails', function missingPassword(done) {
    stub(userService, 'findByAuthentication').resolves({
      ...userMock,
      id: '7',
    });
    stub(userService, 'createUserAgentDocument').returns(userAgentMock);
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
        assert((sessionService.destroySession as SinonStub).calledOnce);
        assert((_response.clearCookie as SinonStub).calledOnce);
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
        assert((sessionService.destroySession as SinonStub).calledOnce);
        assert((_response.clearCookie as SinonStub).calledOnce);
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
