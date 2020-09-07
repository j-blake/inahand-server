const { assert } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const connectMongoose = require('../server/mongoose');

suite('mongoose', function mongooseSuite() {
  setup(function setup() {
    sinon.stub(mongoose, 'connect');
    sinon.stub(process, 'exit');
    sinon.stub(console, 'error');
  });
  teardown(function teardown() {
    mongoose.connect.restore();
    process.exit.restore();
    // eslint-disable-next-line no-console
    console.error.restore();
  });
  test('connection to mongoose returns connection', async function connectionSuccess() {
    mongoose.connect.resolves(true);
    assert(await connectMongoose());
  });
  test('application exits on mongoose connection failure', async function connectionFailure() {
    mongoose.connect.throws();
    await connectMongoose();
    assert(process.exit.called);
  });
});
