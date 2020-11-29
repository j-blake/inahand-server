const { assert } = require('chai');
const sinon = require('sinon');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const authRouter = require('../server/routes/public/auth');
const userService = require('../server/service/user');
const passwordService = require('../server/service/password');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', authRouter);
const agent = request.agent(app);

const first = 'nathaniel';
const last = 'tarp';
const email = 'y@t.com';

suite('auth router', function authRouterSuite() {
  setup(function setup() {
    sinon.stub(passwordService, 'createPasswordHash').resolves('passwordHash');
    sinon.stub(userService, 'createUser').resolves({
      firstName: first,
      lastName: last,
      email,
    });
  });

  teardown(function teardown() {
    sinon.restore();
  });

  test('should return first name, last name, email on successful user creation', function successfulUserCreation(done) {
    agent
      .post('/api/auth/create')
      .send({
        firstName: first,
        lastName: last,
        email,
        password: 'passwordString',
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
});
