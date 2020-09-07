const { assert } = require('chai');
require('dotenv').config();
const app = require('../server/app');

suite('app', function appSuite() {
  test('app is mounted', function appIsMounted() {
    assert.equal(app.mountpath, '/');
  });
});
