import { assert } from 'chai';
import sinon, { SinonStub } from 'sinon';
import mongoose from 'mongoose';
import connectMongoose from '../server/mongoose';

suite('mongoose', function mongooseSuite() {
  setup(function setup() {
    sinon.stub(mongoose, 'connect');
    sinon.stub(process, 'exit');
    sinon.stub(console, 'error');
  });
  teardown(function teardown() {
    (mongoose.connect as SinonStub).restore();
    ((process.exit as unknown) as SinonStub).restore();
    // eslint-disable-next-line no-console
    (console.error as SinonStub).restore();
  });
  test('mongoose connects to MongoDB', async function connectionSuccess() {
    (mongoose.connect as SinonStub).resolves(true);
    const connection = await connectMongoose();
    assert.instanceOf(connection, mongoose.Connection);
  });
  test('application exits on mongoose connection failure', async function connectionFailure() {
    (mongoose.connect as SinonStub).throws();
    await connectMongoose();
    assert(((process.exit as unknown) as SinonStub).called);
  });
});
