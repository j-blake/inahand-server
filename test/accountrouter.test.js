/* eslint-disable no-underscore-dangle */
const sinon = require('sinon');
const request = require('supertest');
const accountRouter = require('../server/routes/account');
const app = require('./mockApp');

const agent = request.agent(app);

suite('account router', function accountRouterSuite() {
  const identity = { profiles: [{ accounts: [] }] };
  suiteSetup(function suiteSetup() {
    app.use((req, res, next) => {
      req.identity = identity;
      next();
    });
    app.use('/api', accountRouter);
  });

  teardown(function tearDown() {
    sinon.restore();
  });

  suiteTeardown(function suiteTeardown() {
    app._router.stack.pop();
    app._router.stack.pop();
  });

  test('should return 200 on request for all accounts belonging to a user', function allAccounts(done) {
    identity.profiles[0].accounts = [1, 2, 3];
    agent.get('/api/accounts').expect(200, done);
  });

  test('should return 404 if identity object is misshaped', function allAccounts(done) {
    delete identity.profiles;
    agent.get('/api/accounts').expect(404, done);
  });
});
