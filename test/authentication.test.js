const assert = require('chai').assert;
const sinon = require('sinon');
const authentication = require('../server/middleware/authentication');
const identityService = require('../server/service/identity');
const express = require('express');

const req = Object.create(express.request); 
const res = Object.create(express.response);
const next = () => {};

suite('middleware - authentication', function() {
  setup(function() {
    sinon.stub(res, 'append').returns(res);
    sinon.stub(res, 'send').returns(res);
    sinon.stub(identityService, 'findOneById');
  });

  teardown(function() {
    sinon.restore();
  });
  
  test('missing session object returns 401', function() {
    authentication(req, res, next);
    assert.equal(res.statusCode, 401);
  });

  test('null identity returns 401', async function () {
    req.session = { identity : 'narf' };
    identityService.findOneById.resolves(null);
    await authentication(req, res, next);
    assert.equal(res.statusCode, 401);
  });

  test('valid session appends identity to request and calls next()', async function() {
    const next = sinon.spy();
    identity = { 'mockIdentity': 42 };
    req.session = { identity : 'narf' };
    identityService.findOneById.resolves(identity);
    await authentication(req, res, next);
    assert.equal(req.identity, identity);
    assert.isTrue(next.calledOnce);
  });
});