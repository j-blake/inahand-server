import { assert } from 'chai';
import sinon from 'sinon';
import * as repo from '../server/repository/mongoose/user';
import * as userService from '../server/service/user';
import * as passwordService from '../server/service/password';
import { User } from '../server/@types/user';

suite('user service', function userSuite() {
  let mockUser: User;
  setup(function setup() {
    mockUser = {
      id: '123',
      firstName: 'lark',
      lastName: 'tarpleton',
      email: 'l@a.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      passwordHash: 'hashthing',
      profiles: [
        {
          id: '123',
          categories: [],
          accounts: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };
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
      ...mockUser,
      firstName,
      lastName,
      email,
      passwordHash: hash,
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
    sinon.stub(repo, 'findByEmail').resolves(null);
    const identity = await userService.findByAuthentication(
      'narf@yark.com',
      'pass'
    );
    assert.isNull(identity);
  });

  test('should return null if password is incorrect', async function incorrectPassword() {
    sinon.stub(repo, 'findByEmail').resolves(mockUser);
    const identity = await userService.findByAuthentication('email', 'pass');
    assert.isNull(identity);
  });

  test('should return null if exception is thrown', async function throwsException() {
    sinon.stub(repo, 'findByEmail').throws();
    const identity = await userService.findByAuthentication('email', 'pass');
    assert.isNull(identity);
  });

  test('should return identity document if valid email address and password provided', async function validAuthentication() {
    sinon.stub(repo, 'findByEmail').resolves(mockUser);
    sinon.stub(passwordService, 'authenticatePassword').resolves(true);
    const identity = await userService.findByAuthentication('email', 'pass');
    assert.isObject(identity);
  });
});
