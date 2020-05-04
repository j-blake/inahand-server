const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const profileSchema = Schema({
  accounts: [{
    type: Schema.Types.ObjectId,
    ref: 'Account',
    index: true,
    default: [],
  }],
});

module.exports = mongoose.models.Profile || model('Profile', profileSchema);
