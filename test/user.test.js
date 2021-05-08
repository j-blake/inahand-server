const { assert } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const userService = require('../server/service/user');
const passwordService = require('../server/service/password');
const Identity = require('../server/model/identity');

const name = 'yakkster';
const mock = new Identity();
mock.email = 'yark@tarp.com';
mock.firstName = name;
mock.passwordHash = 'hashpass';

suite('user service', function userSuite() {
  setup(function setup() {
    mongoose.Model.prototype.save = sinon.stub().resolves();
    mongoose.Query.prototype.exec = sinon.stub().resolves();
  });

  teardown(function teardown() {
    sinon.restore();
  });

  test('should return object on successful user creation', async function createUser() {
    const first = 'lark';
    const last = 'tarpleton';
    const email = 'l@a.com';
    const hash = 'hashting';
    const identity = await userService.createUser(first, last, email, hash);
    assert.isObject(identity);
    assert.equal(first, identity.firstName);
    assert.equal(last, identity.lastName);
    assert.equal(hash, identity.passwordHash);
    assert.equal(1, identity.profiles.length);
    assert.isObject(identity.profiles[0]);
    assert.isEmpty(identity.profiles[0].accounts);
  });

  test('should return null on unsuccessful user creation', async function unsuccessfulCreateUser() {
    mongoose.Model.prototype.save = sinon.stub().throws();
    const identity = await userService.createUser('f', 'l', 'e', 'h');
    assert.isNull(identity);
  });

  test('should return null if no identity with submitted email address exists', async function emailAddressNotExist() {
    const identity = await userService.findByAuthentication(
      'narf@yark.com',
      'pass'
    );
    assert.isNull(identity);
  });

  test('should return null if password is incorrect', async function incorrectPassword() {
    mongoose.Query.prototype.exec.resolves(mock);
    const identity = await userService.findByAuthentication('email', 'pass');
    assert.isNull(identity);
  });

  test('should return null if exception is thrown', async function throwsException() {
    mongoose.Query.prototype.exec.throws();
    const identity = await userService.findByAuthentication('email', 'pass');
    assert.isNull(identity);
  });

  test('should return identity document if valid email address and password provided', async function validAuthentication() {
    mongoose.Query.prototype.exec.resolves(mock);
    sinon.stub(passwordService, 'authenticatePassword').resolves(true);
    const identity = await userService.findByAuthentication('email', 'pass');
    assert.isObject(identity);
  });
});
