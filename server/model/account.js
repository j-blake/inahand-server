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

module.exports = mongoose.models.Account || model('Account', accountSchema);
