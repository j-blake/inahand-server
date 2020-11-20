const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const accountSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    initialBalance: { type: Number, required: true },
    currentBalance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// todo handle the response
accountSchema.statics.findAll = function findAll(callback) {
  this.find((err, accounts) => {
    if (err !== null) {
      return callback(err);
    }
    return callback(null, accounts);
  });
};

module.exports = mongoose.models.Account || model('Account', accountSchema);
