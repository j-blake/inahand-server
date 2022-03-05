import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Account } from '../server/@types/account';
import { Category } from '../server/@types/category';
import sinon from 'sinon';
import * as accountService from '../server/service/account';
import * as accountRepo from '../server/repository/mongoose/account';
import { User } from '../server/@types/user';
import { Profile } from '../server/@types/profile';

chai.use(chaiAsPromised);

suite('account service', function accountServiceSuite() {
  let profile: Profile;
  let identity: User;
  let account: Account;

  setup(function setup() {
    profile = {
      id: 'profileId',
      accounts: [] as Account[],
      categories: [] as Category[],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    identity = {
      id: 'userId',
      firstName: 'John',
      lastName: 'Smith',
      email: 'a@a.com',
      passwordHash: 'asdf',
      profiles: [profile],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    account = {
      id: 'accountId',
      name: 'old name',
      initialBalance: 100,
      currentBalance: 50,
      isActive: true,
      currency: 'USD',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  teardown(function teardown() {
    sinon.restore();
  });

  test('should return array of documents', async function findAllAccounts() {
    sinon.stub(accountRepo, 'findAll').resolves([account]);
    const accounts = await accountService.findAll(identity);
    assert.deepEqual(accounts, [account]);
  });

  test('should find account', async function findOneAccount() {
    profile.accounts.push(account);
    sinon.stub(accountRepo, 'findOne').resolves(account);
    const fetchedAccount = await accountService.findAccount(
      identity,
      account.id
    );
    assert.equal(fetchedAccount, account);
  });

  test('should return document on successful account creation', async function addAccountSuccess() {
    const name = 'Bank of Mongo';
    const initialBalance = 100;
    sinon.stub(accountRepo, 'createAccountForProfile').resolves({
      ...account,
      name,
      initialBalance,
      currentBalance: initialBalance,
    });
    const accountDoc = await accountService.create(identity, {
      name,
      initialBalance,
    });
    assert.isObject(accountDoc);
  });

  test('should throw if saving account fails', async function addAccountFailure() {
    sinon.stub(accountRepo, 'createAccountForProfile').throws();
    assert.isRejected(accountService.create(identity, {} as Account));
  });

  test('should update account record', async function udpateAccount() {
    const name = 'new name';
    const isActive = false;
    const currentBalance = 50.95;
    sinon.stub(accountRepo, 'updateAccountForProfile').resolves({
      ...account,
      name,
      isActive,
      currentBalance,
    });
    const updatedAccount = await accountService.update(identity, account, {
      name,
      isActive,
      currentBalance,
    });
    assert.equal(updatedAccount?.name, 'new name');
    assert.equal(updatedAccount?.currentBalance, 50.95);
    assert.equal(updatedAccount?.isActive, false);
    assert.equal(updatedAccount?.initialBalance, 100);
  });

  test('should keep existing account data when updating with empty changes', async function udpateAccount() {
    const { name, currentBalance, isActive, initialBalance } = account;
    sinon.stub(accountRepo, 'updateAccountForProfile').resolves(account);
    const updatedAccount = await accountService.update(identity, account, {});
    assert.equal(updatedAccount?.name, name);
    assert.equal(updatedAccount?.currentBalance, currentBalance);
    assert.equal(updatedAccount?.isActive, isActive);
    assert.equal(updatedAccount?.initialBalance, initialBalance);
  });
});
