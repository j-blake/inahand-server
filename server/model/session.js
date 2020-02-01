const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const sessionSchema = Schema({
  uuid: {
    type: String,
  },
  userAgent: {
    agent: { type: String },
    os: { type: String },
    device: { type: String },
  },
  ipAddress: { type: String },
},
{
  timestamps: true,
});

module.exports = model('Session', sessionSchema);
