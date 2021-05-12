const { assert } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const connectMongoose = require('../server/mongoose').default;

suite('mongoose', function mongooseSuite() {
  setup(function setup() {
    sinon.stub(mongoose, 'connect');
    sinon.stub(process, 'exit');
    sinon.stub(console, 'error');
  });
  teardown(function teardown() {
    mongoose.connect.restore();
    process.exit.restore();
    console.error.restore();
  });
  test('mongoose connects to MongoDB', async function connectionSuccess() {
    mongoose.connect.resolves(true);
    const connection = await connectMongoose();
    assert.instanceOf(connection, mongoose.Connection);
  });
  test('application exits on mongoose connection failure', async function connectionFailure() {
    mongoose.connect.throws();
    await connectMongoose();
    assert(process.exit.called);
  });
});
