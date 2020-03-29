const mongoose = require('mongoose');
const Account = require('./account');

const { Schema, model } = mongoose;

const profileSchema = Schema({
  accounts: [{
    type: Schema.Types.ObjectId,
    ref: Account,
    index: true,
    default: [],
  }],
});

module.exports = model('Profile', profileSchema);
