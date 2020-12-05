const { assert } = require('chai');
const sinon = require('sinon');
const express = require('express');
const request = require('supertest');
const authRouter = require('../server/routes/public/auth');
const userService = require('../server/service/user');
const passwordService = require('../server/service/password');
const sessionService = require('../server/service/session');
const app = require('./mockApp');

const agent = request.agent(app);

suite('auth router', function authRouterSuite() {
  const first = 'nathaniel';
  const last = 'tarp';
  const email = 'y@t.com';
  const password = 'passString';

  suiteSetup(function suiteSetup() {
    app.use((req, res, done) => {
      req.session = {};
      done();
    });
    app.use('/api', authRouter);
  });

  setup(function setup() {});

  teardown(function teardown() {
    sinon.restore();
  });

  suiteTeardown(function suiteTeardown() {
    // eslint-disable-next-line no-underscore-dangle
    app._router.stack.pop();
    // eslint-disable-next-line no-underscore-dangle
    app._router.stack.pop();
  });

  test('should return first name, last name, email on successful user creation', function successfulUserCreation(done) {
    sinon.stub(passwordService, 'createPasswordHash').resolves('passwordHash');
    sinon.stub(userService, 'createUser').resolves({
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
    sinon.stub(userService, 'findByAuthentication').resolves(null);
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
    sinon.stub(userService, 'findByAuthentication').resolves({ id: 42 });
    sinon.stub(userService, 'createUserAgentDocument').returns();
    sinon.stub(sessionService, 'saveSession').resolves(true);
    agent
      .post('/api/auth/login')
      .send({
        email,
        password,
      })
      .expect(200, done);
  });

  test('should return 400 on login if session save fails', function missingPassword(done) {
    sinon.stub(userService, 'findByAuthentication').resolves({ id: 7 });
    sinon.stub(userService, 'createUserAgentDocument').returns();
    sinon.stub(sessionService, 'saveSession').throws();
    agent.post('/api/auth/login').send({ email }).expect(400, done);
  });

  test('should delete the session document if it exists and clear cookie when logging out', function deleteSessionDocument(done) {
    sinon.stub(sessionService, 'destroySession').resolves();
    sinon.spy(express.response, 'clearCookie');
    agent
      .post('/api/auth/logout')
      .expect(204)
      .then(() => {
        assert(sessionService.destroySession.calledOnce);
        assert(express.response.clearCookie.calledOnce);
        done();
      })
      .catch((err) => done(err));
  });

  test('should clear the cookie even if error thrown when logging out', function clearSessionCookie(done) {
    sinon.stub(sessionService, 'destroySession').throws();
    sinon.spy(express.response, 'clearCookie');
    agent
      .post('/api/auth/logout')
      .expect(204)
      .then(() => {
        assert(sessionService.destroySession.calledOnce);
        assert(express.response.clearCookie.calledOnce);
        done();
      })
      .catch((err) => done(err));
  });

  test('should return 204 with a valid session', function validSession(done) {
    sinon.stub(sessionService, 'isValidSession').resolves(true);
    agent.get('/api/auth/check').expect(204, done);
  });

  test('should return 401 with a missing session', function noValidSession(done) {
    sinon.stub(sessionService, 'isValidSession').resolves(false);
    agent.get('/api/auth/check').expect(401, done);
  });

  test('should return 401 on error thrown during session validation', function validSession(done) {
    sinon.stub(sessionService, 'isValidSession').throws();
    agent.get('/api/auth/check').expect(401, done);
  });
});
