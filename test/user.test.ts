import { assert } from 'chai';
import sinon, { SinonStub } from 'sinon';
import mongoose from 'mongoose';
import * as repo from '../server/repository/mongoose/user';
import * as userService from '../server/service/user';
import * as passwordService from '../server/service/password';
import { MongooseIdentity } from '../server/model/identity';
import profile from '../server/model/profile';

suite('user service', function userSuite() {
  let mock: MongooseIdentity;
  setup(function setup() {
    const identityModel = mongoose.model('Identity');
    const name = 'yakkster';
    mock = new identityModel() as MongooseIdentity;
    mock.email = 'yark@tarp.com';
    mock.firstName = name;
    mock.passwordHash = 'hashpass';
    mongoose.Query.prototype.exec = sinon.stub().resolves();
  });

  teardown(function teardown() {
    sinon.restore();
  });

  test('should return object on successful user creation', async function createUser() {
    const firstName = 'lark';
    const lastName = 'tarpleton';
    const email = 'l@a.com';
    const hash = 'hashthing';
    sinon.stub(repo, 'createUser').resolves({
      id: '123',
      firstName,
      lastName,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      passwordHash: hash,
      profiles: [new profile()],
    });
    const identity = await userService.createUser(
      firstName,
      lastName,
      email,
      hash
    );
    assert.isObject(identity);
    assert.equal(firstName, identity?.firstName);
    assert.equal(lastName, identity?.lastName);
    assert.equal(1, identity?.profiles.length);
    assert.isObject(identity?.profiles[0]);
    assert.isEmpty(identity?.profiles[0].accounts);
  });

  test('should return null if no identity with submitted email address exists', async function emailAddressNotExist() {
    const identity = await userService.findByAuthentication(
      'narf@yark.com',
      'pass'
    );
    assert.isNull(identity);
  });

  test('should return null if password is incorrect', async function incorrectPassword() {
    (mongoose.Query.prototype.exec as SinonStub).resolves(mock);
    const identity = await userService.findByAuthentication('email', 'pass');
    assert.isNull(identity);
  });

  test('should return null if exception is thrown', async function throwsException() {
    (mongoose.Query.prototype.exec as SinonStub).throws();
    const identity = await userService.findByAuthentication('email', 'pass');
    assert.isNull(identity);
  });

  test('should return identity document if valid email address and password provided', async function validAuthentication() {
    (mongoose.Query.prototype.exec as SinonStub).resolves(mock);
    sinon.stub(passwordService, 'authenticatePassword').resolves(true);
    const identity = await userService.findByAuthentication('email', 'pass');
    assert.isObject(identity);
  });
});
