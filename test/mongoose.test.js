const assert = require("chai").assert;
const sinon = require("sinon");
const mongoose = require("mongoose");
const connectMongoose = require("../server/mongoose");

suite("mongoose", function () {
  setup(function () {
    sinon.stub(mongoose, "connect");
    sinon.stub(process, "exit");
    sinon.stub(console, "error");
  });
  teardown(function () {
    mongoose.connect.restore();
    process.exit.restore();
    console.error.restore();
  });
  test("connection to mongoose returns connection", async function () {
    mongoose.connect.resolves(true);
    assert(await connectMongoose());
  });
  test("application exits on mongoose connection failure", async function () {
    mongoose.connect.throws();
    await connectMongoose();
    assert(process.exit.called);
  });
});
