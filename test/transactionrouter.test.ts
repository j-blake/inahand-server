import sinon, { SinonStubbedInstance } from 'sinon';
import transactionRouter from '../server/routes/transaction';
import * as transactionService from '../server/service/transaction';
import request from 'supertest';
import { Request } from '../server/@types/request';
import app from './mockApp';
import { Transaction } from '../server/@types/transaction';

const agent = request.agent(app);

suite('transaction router', function transactionRouterSuite() {
  let transactionServiceMock: SinonStubbedInstance<typeof transactionService>;
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
    app.use('/api', transactionRouter);
  });

  setup(function setup() {
    transactionServiceMock = sinon.stub(transactionService);
  });

  teardown(function tearDown() {
    sinon.restore();
  });

  suiteTeardown(function suiteTeardown() {
    app._router.stack.pop();
    app._router.stack.pop();
  });

  test('should return 200 on successful request for transactions', function allTransactions(done) {
    transactionServiceMock.findAccountTransactionsByProfile.resolves([]);
    agent.get('/api/transactions/123').expect(200, done);
  });

  test('should return 400 if service throws when requesting transactions', function allTransactionsError(done) {
    transactionServiceMock.findAccountTransactionsByProfile.throws();
    agent.get('/api/transactions/123').expect(400, done);
  });

  test('should return 200 on successful request for a transaction', function allTransactions(done) {
    transactionServiceMock.findTransactionByProfile.resolves({} as Transaction);
    agent.get('/api/transaction/123').expect(200, done);
  });

  test('should return 400 if service throws when requesting a transaction', function allTransactionsError(done) {
    transactionServiceMock.findTransactionByProfile.throws();
    agent.get('/api/transaction/123').expect(400, done);
  });

  test('should return 201 on successful transaction creation', function createTransaction(done) {
    transactionServiceMock.createTransaction.resolves({} as Transaction);
    agent.post('/api/transaction').expect(201, done);
  });

  test('should return 400 if an error occurs when creating a transaction', function createTransactionError(done) {
    transactionServiceMock.createTransaction.throws();
    agent.post('/api/transaction').expect(400, done);
  });

  test('should return 200 on successful transaction update', function createTransaction(done) {
    transactionServiceMock.updateTransaction.resolves({} as Transaction);
    agent.patch('/api/transaction/123').expect(200, done);
  });

  test('should return 400 if an error occurs when updating a transaction', function createTransactionError(done) {
    transactionServiceMock.updateTransaction.throws();
    agent.patch('/api/transaction/123').expect(400, done);
  });

  test('should return 204 on successful transaction deletion', function allTransactions(done) {
    transactionServiceMock.deleteTransaction.resolves();
    agent.delete('/api/transaction/123').expect(204, done);
  });

  test('should return 400 if an error occurs when deleting a transaction', function allTransactionsError(done) {
    transactionServiceMock.deleteTransaction.throws();
    agent.delete('/api/transaction/123').expect(400, done);
  });
});
