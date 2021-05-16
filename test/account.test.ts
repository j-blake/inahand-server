import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mongoose from 'mongoose';
import { Account } from '../server/@types/account';
import { Category } from '../server/@types/category';
import sinon from 'sinon';
import * as accountService from '../server/service/account';
import { MongooseIdentity } from '../server/model/identity';
import { MongooseProfile } from '../server/model/profile';
import AccountModel from '../server/model/account';

chai.use(chaiAsPromised);

suite('account service', function accountServiceSuite() {
  let identity: MongooseIdentity;
  let profile: MongooseProfile;

  setup(function setup() {
    const profileModel = mongoose.model('Profile');
    const identityModel = mongoose.model('Identity');
    profile = new profileModel({
      accounts: [] as Account[],
      categories: [] as Category[],
    }) as MongooseProfile;
    identity = new identityModel({
      firstName: 'John',
      lastName: 'Smith',
      email: 'a@a.com',
      passwordHash: 'asdf',
      profiles: [profile],
    }) as MongooseIdentity;
  });

  teardown(function teardown() {
    sinon.restore();
    delete mongoose.models.Identity;
    delete mongoose.models.Profile;
  });

  suiteTeardown(function suiteTeardown() {
    sinon.restore();
  });

  test('should return document on successful account creation', async function addAccountSuccess() {
    mongoose.Model.prototype.save = sinon.stub().resolves();
    const account = await accountService.add(identity, {
      name: 'Bank of Mongo',
      currentBalance: 50,
      dateCreated: new Date(),
      dateUpdated: new Date(),
      initialBalance: 100,
      isActive: true
    });
    assert.isObject(account);
    assert.equal(profile.accounts[0].name, account?.name);
  });

  test('should throw if saving account fails', async function addAccountFailure() {
    mongoose.Model.prototype.save = sinon.stub().throws();
    assert.isRejected(accountService.add(identity, {} as Account));
  });

  test('should update account record', async function udpateAccount() {
    const account = new AccountModel({
      name: 'old name',
      initialBalance: 100,
      currentBalance: 50,
      isActive: true,
    });
    const name = 'new name';
    const isActive = false;
    const currentBalance = 50.95;
    const initialBalance = 1000000;
    mongoose.Model.prototype.save = sinon.stub().resolves(
      new AccountModel({
        name,
        initialBalance: 100,
        isActive,
        currentBalance,
      })
    );
    const updatedAccount = await accountService.updateOne(account, {
      name,
      isActive,
      currentBalance,
      initialBalance,
      dateCreated: new Date(),
      dateUpdated: new Date(),
    });
    assert.equal(updatedAccount.name, 'new name');
    assert.equal(updatedAccount.currentBalance, 50.95);
    assert.equal(updatedAccount.isActive, false);
    assert.equal(updatedAccount.initialBalance, 100);
  });
});