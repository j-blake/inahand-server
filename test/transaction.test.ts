import { expect } from 'chai';
import sinon from 'sinon';
import {
  findAccountTransactionsByProfile,
  findTransactionByProfile,
  createTransaction,
} from '../server/service/transaction';
import * as transactionRepo from '../server/repository/mongoose/transaction';
import mockProfile from './mockProfile';
import mockTransactions from './mockTransactions';
import { EditableTransactionFields } from '../server/@types/EditableTransactionFields';

const mockRequestBody: EditableTransactionFields = {
  amount: 125.75,
  currency: 'USD',
  transactionType: 'debit',
  description: 'Delete Test',
  transactionDate: new Date('2021-06-21'),
  payingAccount: '5c22547987527217a5417309',
  details: [
    {
      category: '60cc864cee6f6f865bfa432d',
      amount: 35.62,
    },
    {
      category: '60cc8661ee6f6f865bfa432f',
      amount: 65.24,
    },
    {
      category: '60cc8668ee6f6f865bfa4331',
      amount: 24.89,
    },
  ],
};

suite('transaction tests', function transactionTests() {
  teardown(function teardown() {
    sinon.restore();
  });
  test('should return emtpy array when no accounts found', async function () {
    const transactions = await findAccountTransactionsByProfile(
      mockProfile(),
      'notarealid'
    );
    expect(transactions).empty;
  });

  test('should return formatted transactions', async function () {
    sinon.stub(transactionRepo, 'findByAccount').resolves(mockTransactions());
    const transactions = await findAccountTransactionsByProfile(
      mockProfile(),
      '5c22547987527217a5417309'
    );
    expect(transactions).length(mockTransactions().length);
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  [null, ...mockTransactions()].forEach((mockTransaction) => {
    const id = mockTransaction?.id || 'null';
    test(`should return formatted transaction ${id}`, async function () {
      sinon.stub(transactionRepo, 'findOneByProfile').resolves(mockTransaction);
      const transaction = await findTransactionByProfile(id, mockProfile());
      expect(transaction).equals(mockTransaction);
    });
  });

  test('should return null for a profile with no accounts', async function () {
    const profile = { ...mockProfile() };
    profile.accounts = [];
    const transaction = await findTransactionByProfile('123', profile);
    expect(transaction).null;
  });

  test('should create new transaction', async function () {
    sinon.stub(transactionRepo, 'create').resolves(mockTransactions()[0]);
    const transaction = await createTransaction(mockRequestBody, mockProfile());
    expect(transaction.id).to.equal('1');
  });
});
