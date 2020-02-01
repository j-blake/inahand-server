const mongoose = require('mongoose');
const validator = require('validator');

const sessionSchema = require('./session');

const { Schema, model } = mongoose;

const identitySchema = Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    validator: v => validator.isEmail(v),
    message: props => `${props.value} is not a valid email address`,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  sessions: {
    type: [sessionSchema.schema],
  },
  activeAccounts: {
    type: [Schema.Types.ObjectId],
    index: true,
    default: [],
    // todo ref: 'IdentityAccounts'
  },
  isActive: { type: Boolean, default: true },
},
{
  timestamps: true,
});

module.exports = model('Identity', identitySchema);
