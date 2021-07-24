import sinon, { SinonStubbedInstance } from 'sinon';
import request from 'supertest';
import { Request } from '../server/@types/request';
import accountRouter from '../server/routes/account';
import * as accountService from '../server/service/account';
import app from './mockApp';

const agent = request.agent(app);

suite('account router', function accountRouterSuite() {
  let accountServiceMock: SinonStubbedInstance<typeof accountService>;
  suiteSetup(function suiteSetup() {
    app.use((req, _, next) => {
      (req as Request).identity = {
        id: '123',
        firstName: 'lark',
        lastName: 'tarpleton',
        email: 'l@a.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: 'hashthing',
        profiles: [],
      };
      next();
    });
    app.use('/api', accountRouter);
  });

  setup(function setup() {
    accountServiceMock = sinon.stub(accountService);
  });

  teardown(function tearDown() {
    sinon.restore();
  });

  suiteTeardown(function suiteTeardown() {
    app._router.stack.pop();
    app._router.stack.pop();
  });

  test('should return 200 on request for all accounts belonging to a user', function allAccounts(done) {
    accountServiceMock.findAll.resolves([]);
    agent.get('/api/accounts').expect(200, done);
  });

  test('should return 404 if identity object is misshaped in request for all accounts', function allAccountsError(done) {
    accountServiceMock.findAll.throws();
    agent.get('/api/accounts').expect(404, done);
  });

  test('should return 200 when successfully adding a new account', function addAccount(done) {
    accountServiceMock.create.resolves();
    agent.post('/api/account').expect(201, done);
  });

  test('should return 400 when attempting to save new account fails', function addAccountError(done) {
    accountServiceMock.create.throws();
    agent.post('/api/account').expect(400, done);
  });
});
