const { assert } = require('chai').use(require('chai-as-promised'));
const mongoose = require('mongoose');
const sinon = require('sinon');
const accountService = require('../server/service/account');
const Identity = require('../server/model/identity');
const Profile = require('../server/model/profile');
const Account = require('../server/model/account');

suite('account service', function accountServiceSuite() {
  const profile = new Profile();
  const identity = new Identity({
    profiles: [profile],
  });

  suiteSetup(function suiteSetup() { });

  setup(function setup() { });

  teardown(function teardown() {
    sinon.restore();
  });

  suiteTeardown(function suiteTeardown() {
    sinon.restore();
  });

  test('should return document on successful account creation', async function addAccountSuccess() {
    mongoose.Model.prototype.save = sinon.stub().resolves();
    const account = await accountService.add(identity, { name: 'Bank of Mongo' });
    assert.isObject(account);
    assert.equal(profile.accounts[0].name, account.name);
  });

  test('should throw if saving account fails', async function addAccountFailure() {
    mongoose.Model.prototype.save = sinon.stub().throws();
    assert.isRejected(accountService.add(identity, {}));
  });

  test('should update account record', async function udpateAccount() {
    const account = new Account({ name: 'old name', initialBalance: 100, currentBalance: 50, isActive: true });
    const name = 'new name';
    const isActive = 'false';
    const currentBalance = '50.95';
    const initialBalance = '1000000';
    mongoose.Model.prototype.save = sinon.stub().resolves(new Account({ name, initialBalance: 100, isActive, currentBalance}));
    const updatedAccount = await accountService.updateOne(account, { name, isActive, currentBalance, initialBalance });
    assert.equal(updatedAccount.name, 'new name');
    assert.equal(updatedAccount.currentBalance, 50.95);
    assert.equal(updatedAccount.isActive, false);
    assert.equal(updatedAccount.initialBalance, 100);
  });
});

