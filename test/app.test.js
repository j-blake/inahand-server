const assert = require('chai').assert;
require('dotenv').config();
const app = require('../server/app');

suite('app', function() {
  test('app is mounted', function() {
    assert.equal(app.mountpath, '/');
  });
});
