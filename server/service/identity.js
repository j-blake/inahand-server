const Identity = require('../model/identity');

exports.findOneBySession = async session => Identity.findOne({ 'sessions.uuid': session })
  .populate({
    path: 'profiles',
    populate: { path: 'accounts' },
  })
  .exec();

exports.findOneById = async id => Identity.findById(id)
  .populate({
    path: 'profiles',
    populate: { path: 'accounts' },
  })
  .exec();
