import { assert } from 'chai';
import sinon, { SinonStub } from 'sinon';
import express from 'express';
import * as userService from '../server/service/user';
import authentication from '../server/middleware/authentication';

const req = Object.create(express.request);
const res = Object.create(express.response);
const next = () => {
  // do nothing
};

suite('middleware - authentication', function authenticationSuite() {
  setup(function setup() {
    sinon.stub(res, 'append').returns(res);
    sinon.stub(res, 'send').returns(res);
    sinon.stub(userService, 'findById');
  });

  teardown(function teardown() {
    sinon.restore();
  });

  test('missing session object returns 401', function missingSession() {
    authentication(req, res, next);
    assert.equal(res.statusCode, 401);
  });

  test('null identity returns 401', async function nullIdentity() {
    req.session = { identity: 'goodIdentityName' };
    (userService.findById as SinonStub).resolves(null);
    await authentication(req, res, next);
    assert.equal(res.statusCode, 401);
  });

  test('valid session appends identity to request and calls next()', async function validSession() {
    const nextSpy = sinon.spy();
    const identity = { mockIdentity: 42 };
    req.session = { identity: 'goodIdentityName' };
    (userService.findById as SinonStub).resolves(identity);
    await authentication(req, res, nextSpy);
    assert.equal(req.identity, identity);
    assert.isTrue(nextSpy.calledOnce);
  });
});
