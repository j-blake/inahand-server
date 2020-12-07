const { assert } = require('chai');
const sinon = require('sinon');
const express = require('express');
const userService = require('../server/service/user');
const authentication = require('../server/middleware/authentication');

const req = Object.create(express.request);
const res = Object.create(express.response);
const next = () => {};

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
    userService.findById.resolves(null);
    await authentication(req, res, next);
    assert.equal(res.statusCode, 401);
  });

  test('valid session appends identity to request and calls next()', async function validSession() {
    const nextSpy = sinon.spy();
    const identity = { mockIdentity: 42 };
    req.session = { identity: 'goodIdentityName' };
    userService.findById.resolves(identity);
    await authentication(req, res, nextSpy);
    assert.equal(req.identity, identity);
    assert.isTrue(nextSpy.calledOnce);
  });
});
