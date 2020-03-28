const mongoose = require('mongoose');
const validator = require('validator');

const sessionSchema = require('./session');

const { Schema, model } = mongoose;

const nameValidator = {
  // allow names containing apostrophes or dashes
  validator: v => /^[-'.a-zA-Z]{0,50}$/.test(v),
  message: () => 'Enter a first name containing letters, apostrophes, dashes, or periods',
};

const validateUniqueEmail = async (v) => {
  const identity = await mongoose.model('Identity').findOne({ email: v }).exec();
  return identity === null;
};

const identitySchema = Schema({
  firstName: {
    type: String,
    validate: nameValidator,
  },
  lastName: {
    type: String,
    validate: nameValidator,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    validate: [
      {
        validator: v => validator.isEmail(v),
        message: props => `${props.value} is not a valid email addresss`,
      },
      {
        validator: v => validateUniqueEmail(v),
        message: props => `${props.value} is not available`,
      },
    ],
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
  isActive: {
    type: Boolean,
    default: true,
  },
},
{
  timestamps: true,
});

function transformToObject(doc) {
  return {
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    activeAccounts: doc.activeAccounts,
  };
}
identitySchema.set('toObject', { transform: transformToObject });

module.exports = model('Identity', identitySchema);
