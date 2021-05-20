/* eslint-disable no-underscore-dangle */
import sinon, { SinonStub } from 'sinon';
import request from 'supertest';
import { Request } from '../server/@types/request';
import Identity from '../server/model/identity';
import accountRouter from '../server/routes/account';
import * as accountService from '../server/service/account';
import app from './mockApp';

const agent = request.agent(app);

suite('account router', function accountRouterSuite() {
  suiteSetup(function suiteSetup() {
    app.use((req, _, next) => {
      (req as Request).identity = new Identity();
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
    (accountService.findAll as SinonStub).resolves([]);
    agent.get('/api/accounts').expect(200, done);
  });

  test('should return 404 if identity object is misshaped in request for all accounts', function allAccountsError(done) {
    (accountService.findAll as SinonStub).throws();
    agent.get('/api/accounts').expect(404, done);
  });

  test('should return 200 when successfully adding a new account', function addAccount(done) {
    (accountService.add as SinonStub).resolves();
    agent.post('/api/account').expect(201, done);
  });

  test('should return 400 when attempting to save new account fails', function addAccountError(done) {
    (accountService.add as SinonStub).throws();
    agent.post('/api/account').expect(400, done);
  });
});
