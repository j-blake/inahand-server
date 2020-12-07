/* eslint-disable no-underscore-dangle */
const sinon = require('sinon');
const request = require('supertest');
const accountRouter = require('../server/routes/account');
const accountService = require('../server/service/account');
const app = require('./mockApp');

const agent = request.agent(app);

suite('account router', function accountRouterSuite() {
  suiteSetup(function suiteSetup() {
    app.use((req, res, next) => {
      req.identity = {};
      next();
    });
    app.use('/api', accountRouter);
  });

  setup(function setup() {
    sinon.stub(accountService);
  });

  teardown(function tearDown() {
    sinon.restore();
  });

  suiteTeardown(function suiteTeardown() {
    app._router.stack.pop();
    app._router.stack.pop();
  });

  test('should return 200 on request for all accounts belonging to a user', function allAccounts(done) {
    accountService.findAll.resolves([]);
    agent.get('/api/accounts').expect(200, done);
  });

  test('should return 404 if identity object is misshaped in request for all accounts', function allAccountsError(done) {
    accountService.findAll.throws();
    agent.get('/api/accounts').expect(404, done);
  });

  test('should return 200 when successfully adding a new account', function addAccount(done) {
    accountService.add.resolves();
    agent.post('/api/account').expect(201, done);
  });

  test('should return 400 when attempting to save new account fails', function addAccountError(done) {
    accountService.add.throws();
    agent.post('/api/account').expect(400, done);
  });
});
