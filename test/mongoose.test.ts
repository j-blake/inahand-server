import { assert } from 'chai';
import sinon, { SinonStub } from 'sinon';
import mongoose from 'mongoose';
import connectMongoose from '../server/mongoose';

suite('mongoose', function mongooseSuite() {
  let mockConnect: SinonStub;
  let mockExit: SinonStub;
  let mockError: SinonStub;
  setup(function setup() {
    mockConnect = sinon.stub(mongoose, 'connect');
    mockExit = sinon.stub(process, 'exit');
    mockError = sinon.stub(console, 'error');
  });
  teardown(function teardown() {
    mockConnect.restore();
    mockExit.restore();
    mockError.restore();
  });
  test('mongoose connects to MongoDB', async function connectionSuccess() {
    mockConnect.resolves(true);
    const connection = await connectMongoose();
    assert.instanceOf(connection, mongoose.Connection);
  });
  test('application exits on mongoose connection failure', async function connectionFailure() {
    mockConnect.throws();
    await connectMongoose();
    assert(mockExit.called);
  });
});
